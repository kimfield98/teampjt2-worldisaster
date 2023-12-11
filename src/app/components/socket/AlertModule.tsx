"use client";
import React, { useEffect, useState } from 'react';
import { mailAlarmState, PostAlertInfo } from '../../recoil/dataRecoil';
import {useRecoilState} from "recoil";
import Cookies from 'js-cookie';
import axios from 'axios';
import MailAlertList from './MailAlertList';
import { Slider } from '@nextui-org/react';

export const MailAlertModul = () => {
  const [alertInfo, setAlertInfo] = useRecoilState(mailAlarmState);
  const [placeName, setPlaceName] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [alertrange, setAlertRange] = useState<number>(alertInfo.alertRadius); // 알람 범위
  const [alertLevelRed, setAlertLevelRed] = useState<boolean>(alertInfo.alertlevelRed); // 알람 레벨RED
  const [alertLevelOrange, setAlertLevelOrange] = useState<boolean>(alertInfo.alertlevelOrange); // 알람 레벨RED
  const [alertLevelGreen, setAlertLevelGreen] = useState<boolean>(alertInfo.alertlevelGreen); // 알람 레벨RED

  const token = Cookies.get('access-token');

  async function getLocationName(latitude:string, longitude:string) {
    try {
    // 육지에 대한 정보 조회
    const response = await axios(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      { headers: {
        'Accept-Language': 'en-US,en;q=0.9'
      }
      });
    const data = await response.data;
    if (data.address) {
      const address = data.address;
      const city = address.city || address.town || address.village || '';
      const country = address.country || '';
      return `${city}, ${country}`;
    }
    // 독도의 대략적인 위도와 경도 범위 확인
    const isDokdo = (Number(latitude) >= 37.23 && Number(latitude) <= 37.25) && (Number(longitude) >= 131.86 && Number(longitude) <= 131.88);
    if (isDokdo) {
      return "Dokdo, South Korea";
    }
      return ', ocean'; // 위치를 찾을 수 없음
    } catch (error) {
      return 'Unknown Location';
    }
  }

  useEffect(()=>{
    setAlertRange(alertInfo.alertRadius);
  },[alertInfo.alertRadius])

  useEffect(() => {
    async function updateLocationName() {
      setIsLoaded(true); // 로딩 시작
      try {
        const locationName = await getLocationName(String(alertInfo.alertLatitude), String(alertInfo.alertLongitude));
        console.log(locationName)
        setPlaceName(locationName);
      } catch (error) {
        console.error('Error updating location name:', error);
      } finally {
        setIsLoaded(false); // 로딩 종료
      }
    }
    updateLocationName();
  },[alertInfo.alertLatitude, alertInfo.alertLongitude]);

  useEffect(()=>{
    setAlertRange(100);  
  },[alertInfo.open])

  const handleRange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlertRange(Number(e.target.value));
    setAlertInfo({...alertInfo, alertRadius: Number(e.target.value)});
  }

  const createHandeler = async () => {
    if (!confirm("알림을 생성하겠습니까?"))
    return;
    try {
      const postData = {
        alertCountryName: String(placeName.split(',')[1]),
        alertDistrictName: String(placeName.split(',')[0]),
        alertLatitude: alertInfo.alertLatitude,
        alertLongitude:alertInfo.alertLongitude,
        alertRadius: alertrange,
        alertLevelRed: alertLevelRed,
        alertLevelOrange: alertLevelOrange,
        alertLevelGreen: alertLevelGreen,
        // memo: alertInfo.memo,
      }
      if (!postData.alertLevelGreen && !postData.alertLevelOrange && !postData.alertLevelRed) {
        alert("Please select an alert level.")
        return;
      }
      const response = await axios.post(`https://worldisaster.com/api/emailAlerts/`, postData ,{
        headers: {Authorization: `Bearer ${token}`}
      })
      console.log(response.data);
      setAlertInfo(prevInfo => ({...prevInfo, newAlertData: response.data}));
    } catch(error) {
      console.log("error",error);
    } finally {
      getLocationName(String(alertInfo.alertLatitude),String(alertInfo.alertLongitude));
    }
  };


  return (
    <>
    {alertInfo.open && 
      <div className=" bg-slate-200 rounded-xl p-2 text-light-1 animate-slide-up">
        <div className=' bg-white text-black rounded-xl p-2'>
            <div className="flex justify-between">
              <div className="text-heading3-bold">Alert</div>
              <div className="text-heading3-bold cursor-pointer" onClick={() => setAlertInfo({...alertInfo, open: false})}>X</div>
            </div>
            <div className="mt-2 flex gap-6">
              <div className="text-heading5-bold">Latitude: {alertInfo.alertLatitude}</div>
              <div className="text-heading5-bold">Longitude: {alertInfo.alertLongitude}</div>
            </div>
            <div className="mt-2">Location
              <div className=" flex justify-center gap-6">
                <div className="text-heading5">{isLoaded ? "Searching...":placeName}</div>
              </div>
            </div>
            <div className="mt-2">Radius
              <div className=" flex justify-center gap-6 flex-col items-center">
              <Slider label="Select a Radius" color="foreground" size="sm" formatOptions={{style: "unit", unit:"kilometer"}} step={100} minValue={100} maxValue={2000} value={alertInfo.edit ? alertInfo.alertRadius:undefined} isDisabled={alertInfo.edit} marks={[
                    { value: 100, label: "100km"},{ value: 500, label: "500km"},{ value: 1000, label: "1000km"},{ value: 1500, label: "1500km"},{ value: 2000, label: "2000km"},]}
                  defaultValue={100}
                  className="max-w-md"
                />
              </div>
            </div>
            <div className="mt-2">Level
              <div className="flex justify-center gap-6">
                <div className='text-heading5'>
                  <span>Red: </span>
                  <button className="levelbtn" onClick={()=>{alertInfo.edit? null:setAlertLevelRed(!alertLevelRed)}} style={alertInfo.edit? {backgroundColor: alertInfo.alertlevelRed? '#006FEE' :'#eee', marginRight:alertLevelRed? '6.59px' :'0px'  }:{ backgroundColor: alertLevelRed? '#006FEE' :'#eee', marginRight:alertLevelRed? '6.59px' :'0px'  }}>{alertInfo.edit? alertInfo.alertlevelRed? "ON":"Off":alertLevelRed? "ON":"OFF"}</button>
                </div>
                <div className='text-heading5'>
                  <span>Orange: </span>
                  <button className="levelbtn" onClick={()=>{alertInfo.edit? null:setAlertLevelOrange(!alertLevelOrange)}} style={alertInfo.edit? {backgroundColor: alertInfo.alertlevelOrange? '#006FEE' :'#eee', marginRight:alertLevelOrange? '6.59px' :'0px'  }:{ backgroundColor: alertLevelOrange? '#006FEE' :'#eee', marginRight:alertLevelOrange? '6.59px' :'0px'  }}>{alertInfo.edit? alertInfo.alertlevelOrange? "ON":"Off":alertLevelOrange? "ON":"OFF"}</button>
                </div>
                <div className='text-heading5'>
                  <span>Green: </span>
                  <button className="levelbtn" onClick={()=>{alertInfo.edit? null:setAlertLevelGreen(!alertLevelGreen)}} style={alertInfo.edit? {backgroundColor: alertInfo.alertlevelRed? '#006FEE' :'#eee', marginRight:alertLevelGreen? '6.59px' :'0px'  }:{ backgroundColor: alertLevelGreen? '#006FEE' :'#eee', marginRight:alertLevelGreen? '6.59px' :'0px'  }}>{alertInfo.edit? alertInfo.alertlevelGreen? "ON":"Off":alertLevelGreen? "ON":"OFF"}</button>
                </div>
              </div>
            </div>
            {/* <div className="mt-2">
              <div className="text-heading5-bold">Memo</div>
              <textarea className="w-full h-full min-h-unit-20 max-h-40 border-1 border-dark-2 rounded-xl p-2 " placeholder="Please enter a memo."></textarea>
            </div> */}
            <button
              className="mt-2"
              color="primary"
              onClick={createHandeler}
              disabled={alertInfo.edit}>
              Create
            </button>
        </div>
        <MailAlertList />
      </div>}
    </>
  );

}

export default MailAlertModul;