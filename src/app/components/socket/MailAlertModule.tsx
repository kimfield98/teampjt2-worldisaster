"use client";
import React, { useEffect, useState } from 'react';
import { mailAlarmState, PostAlertInfo, leftSidebarState } from '../../recoil/dataRecoil';
import { useRecoilState } from "recoil";
import Cookies from 'js-cookie';
import axios from 'axios';
import MailAlertList from './MailAlertList';

export const MailAlertModule = () => {
  const [alertInfo, setAlertInfo] = useRecoilState(mailAlarmState);
  const [placeName, setPlaceName] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [alertData, setAlertData] = useState<PostAlertInfo[]>([]);
  const [alertrange, setAlertRange] = useState<number>(alertInfo.alertRadius); // 알람 범위
  const [alertLevelRed, setAlertLevelRed] = useState<boolean>(alertInfo.alertlevelRed); // 알람 레벨RED
  const [alertLevelOrange, setAlertLevelOrange] = useState<boolean>(alertInfo.alertlevelOrange); // 알람 레벨RED
  const [alertLevelGreen, setAlertLevelGreen] = useState<boolean>(alertInfo.alertlevelGreen); // 알람 레벨RED
  const [leftSidebarOpen, setLeftSidebarOpen] = useRecoilState(leftSidebarState);

  const token = Cookies.get('access-token');

  async function getLocationName(latitude: string, longitude: string) {
    try {
      // 육지에 대한 정보 조회
      const response = await axios(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        {
          headers: {
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
      return 'ocean'; // 위치를 찾을 수 없음
    } catch (error) {
      return 'Unknown Location';
    }
  }

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
  }, [alertInfo.alertLatitude, alertInfo.alertLongitude]);
  const handleRange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlertRange(Number(e.target.value));
    setAlertInfo({ ...alertInfo, alertRadius: Number(e.target.value) });
  }

  const createHandeler = async () => {
    if (!confirm("알림을 생성하겠습니까?"))
      return;
    try {
      const postData = {
        alertCountryName: String(placeName.split(',')[1]),
        alertDistrictName: String(placeName.split(',')[0]),
        alertLatitude: alertInfo.alertLatitude,
        alertLongitude: alertInfo.alertLongitude,
        alertRadius: alertrange,
        alertLevelRed: alertLevelRed,
        alertLevelOrange: alertLevelOrange,
        alertLevelGreen: alertLevelGreen,
        // memo: alertInfo.memo,
      }
      const response = await axios.post(`https://worldisaster.com/api/emailAlerts/`, postData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log(response.data);
      setAlertInfo(prevInfo => ({ ...prevInfo, newAlertData: response.data }));
    } catch (error) {
      console.log("error", error);
    } finally {
      getLocationName(String(alertInfo.alertLatitude), String(alertInfo.alertLongitude));
      setLeftSidebarOpen({ isOpen: false, activeIcon: 'none' });
      setAlertInfo({ ...alertInfo, open: false });
    }
  };


  return (
    <>
      <div className='card2 flex flex-col items-center'>
        <p className='cardTitle'>🌐 Customized Alerts Subscription 🌐</p>
        <div className='cardContent flex flex-col items-center'>
          <p>Take a look at the interactive globe on the right.</p>
          <p>Feel free to browse to a custom location.</p>
          <p>A simple right-click will get you started on your journey.</p>
        </div>
      </div>
      <div className=''>
        {alertInfo.open &&
          <div className='card2'>
            <div className="flex justify-between">
              <div className="cardTitle">New Subscription</div>
            </div>
            <div>
              <p className='font-bold mt-3 ml-3'>You have selected:</p>
              <div className="card2" style={{ marginLeft: '10px' }}>
                <div>{isLoaded ? "Searching..." : placeName}</div>
              </div>
              <div className="flex gap-1 ml-3">
                <div className='flex items-center' style={{ marginLeft: '10px', marginRight: '0px' }}><p className='mr-1'>... of Latitude</p><p>{alertInfo.alertLatitude}</p></div>
                <div className='flex items-center'><p className='mr-1'>and Longitude</p><p>{alertInfo.alertLongitude}</p></div>
              </div>
            </div>
            <br />
            <div>
              <p className='font-bold my-3 ml-3'>Select an alert radius.</p>
              <div className="flex justify-center gap-6 flex-col items-center">
                <input className='w-[80%] ' type='range' min={100} max={2000} step={100} defaultValue={100} onChange={handleRange} />
                <label>{alertrange}km</label>
              </div>
            </div>
            <div className="mt-2">
              <p className='font-bold my-3 ml-3'>Choose one or more alert levels.</p>
              <div className="flex justify-center gap-6">
                <div>
                  <span className='font-bold'>Red: </span>
                  <button className="levelbtn" onClick={() => { setAlertLevelRed(!alertLevelRed) }} style={{ backgroundColor: alertLevelRed ? '#ff0000' : '#eee', marginRight: alertLevelRed ? '6.59px' : '0px' }}>{alertLevelRed ? "ON" : "OFF"}</button>
                </div>
                <div>
                  <span className='font-bold'>Orange: </span>
                  <button className="levelbtn" onClick={() => { setAlertLevelOrange(!alertLevelOrange) }} style={{ backgroundColor: alertLevelOrange ? '#ff8f46' : '#eee', marginRight: alertLevelOrange ? '6.59px' : '0px' }}>{alertLevelOrange ? "ON" : "OFF"}</button>
                </div>
                <div>
                  <span className='font-bold'>Green: </span>
                  <button className="levelbtn" onClick={() => { setAlertLevelGreen(!alertLevelGreen) }} style={{ backgroundColor: alertLevelGreen ? '#35d100' : '#eee', marginRight: alertLevelGreen ? '6.59px' : '0px' }}>{alertLevelGreen ? "ON" : "OFF"}</button>
                </div>
              </div>
            </div>
            <div className="btnBox">
              <button className="btn" onClick={createHandeler}>
                Create
              </button>
            </div>
            <div className='mt-5'>
              <MailAlertList />
            </div>
          </div>
        }
      </div>

    </>
  );

}

export default MailAlertModule;