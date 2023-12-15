"use client";
import React, { useEffect, useState } from 'react';
import { mailAlarmState, PostAlertInfo, leftSidebarState } from '../../recoil/dataRecoil';
import { useRecoilState } from "recoil";
import Cookies from 'js-cookie';
import axios from 'axios';
import MailAlertList from './MailAlertList';

export const MailAlertModule = () => {
  const [inputKey, setInputKey] = useState(Date.now());
  const [alertInfo, setAlertInfo] = useRecoilState(mailAlarmState);
  const [placeName, setPlaceName] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [alertData, setAlertData] = useState<PostAlertInfo[]>([]);
  const [alertrange, setAlertRange] = useState<number>(alertInfo.alertRadius); // 알람 범위
  const [alertLevelRed, setAlertLevelRed] = useState<boolean>(alertInfo.alertlevelRed); // 알람 레벨RED
  const [alertLevelOrange, setAlertLevelOrange] = useState<boolean>(alertInfo.alertlevelOrange); // 알람 레벨RED
  const [alertLevelGreen, setAlertLevelGreen] = useState<boolean>(alertInfo.alertlevelGreen); // 알람 레벨RED
  const [leftSidebarOpen, setLeftSidebarOpen] = useRecoilState(leftSidebarState);
  const [countryName, setCountryName] = useState<string>('');


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
        const city = address.city || address.town || address.village || ' ';
        const country = address.country || ' ';
        setCountryName(country)
        if (city!==" ") {
          return `${city}, ${country}`;
        } else {
          return `${country}`
        }
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

  useEffect(() => {
    const initializeScreen = () => {
      // 필요한 초기화 작업을 여기에 구현합니다.
      // 예를 들어, 입력 필드 초기화, 상태 초기화 등
      setPlaceName('');
      setAlertRange(100); // 기본 반경 값으로 초기화
      setAlertLevelRed(false);
      setAlertLevelOrange(false);
      setAlertLevelGreen(false);
      setInputKey(Date.now());
    }

    // 위도 또는 경도가 변경될 때마다 화면 초기화 실행
    initializeScreen();

    if (alertInfo.edit) {
      setPlaceName(`${alertInfo.alertDistrictName},${alertInfo.alertCountryName}`)
      setAlertRange(alertInfo.alertRadius)
      setAlertLevelRed(alertInfo.alertlevelRed)
      setAlertLevelOrange(alertInfo.alertlevelOrange)
      setAlertLevelGreen(alertInfo.alertlevelGreen)
    }

  }, [alertInfo.alertLatitude, alertInfo.alertLongitude]);

  const createHandeler = async () => {
    if (!confirm("Would you like to create a new alert subscription?"))
      return;
    try {
      const postData = {
        alertCountryName: countryName,
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
      setAlertInfo({ ...alertInfo, delete: true});
    }
  };

  return (
    <>
      <div className='card2 flex-col'>
        <div className="cardTitle">Existing Subscriptions</div>
        <MailAlertList />
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
                {alertInfo.edit ? <input className='w-[80%] ' type='range' min={100} max={2000} step={100} defaultValue={100} onChange={handleRange} key={inputKey} value={alertInfo.alertRadius} disabled={true} /> : <input className='w-[80%] ' type='range' min={100} max={2000} step={100} defaultValue={100} onChange={handleRange} key={inputKey} disabled={false} />}
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
              <button className="btn disabled:hidden" onClick={createHandeler} disabled={alertInfo.edit ? true : false}>
                Create
              </button>
            </div>
          </div>
        }
      </div>

    </>
  );

}

export default MailAlertModule;