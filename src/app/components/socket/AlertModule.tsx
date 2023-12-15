"use client"

import Link from 'next/link';
import React, { useEffect, useRef } from 'react';

import { io, Socket } from 'socket.io-client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AlertModule = () => {

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {

    /* 소켓 연결이 없어야만 연결 시도 */
    if (!socketRef.current) {
      socketRef.current = io('https://worldisaster.com/alerts', {
        withCredentials: true, // CORS 문제를 해결하기 위한 옵션
        path: '/socket.io', // Sockets.io 라이브러리의 표준값
        transports: ['websocket'], // 트랜스포트 방식을 "websocket"으로 지정
      });
    }

    /* 소켓 연결이 있을 때만 사용 */
    if (socketRef.current) {
      socketRef.current.on('connect', () => {
        console.log('Log: Alerts websocket connection successful');
      });

      socketRef.current.on('disaster-alert', (message) => {
        const data = JSON.parse(message);
        const result = {
          dID: data.dID, // "EQ1403291"
          dSource: data.dSource, // "GDACS"
          dStatus: data.dStatus, // "real-time"
          dAlertLevel: data.dAlertLevel, // "Green"
          dCountry: data.dCountry, // "United States"
          dType: data.dType, // "Earthquake"
          dDate: data.dDate, // "Fri, 01 Dec 2023 17:54:39 GMT"
          dLatitude: data.dLatitude, // "52.0898"
          dLongitude: data.dLongitude, // "173.2261"
          dTitle: data.dTitle, // "Green earthquake alert (Magnitude 4.5M, Depth:28.843km) in United States 01/12/2023 17:54 UTC, Few people affected in 100km."
          dDescription: data.dDescription, // "On 12/1/2023 5:54:39 PM, an earthquake occurred in United States potentially affecting Few people affected in 100km. The earthquake had Magnitude 4.5M, Depth:28.843km."
          dUrl: data.dUrl, // "https://www.gdacs.org/report.aspx?eventtype=EQ&eventid=1403291"
        }

        const earthURL = `https://worldisaster.com/earth?lon=${result.dLongitude}&lat=${result.dLatitude}&height=500000&did=${result.dID}`

        interface CustomToastProps {
          dType: string;
          dCountry: string;
          dAlertLevel: string;
          earthURL: string;
        }

        const CustomToastWithLink: React.FC<CustomToastProps> = (
          { dType, dCountry, dAlertLevel, earthURL } // 여기서 dUrl 값을 추후 바꿔줘야 함 @@@@@@@
        ) => {

          const alertLevelColor =
            dAlertLevel === 'Green' ? 'green' :
              dAlertLevel === 'Orange' ? 'orange' :
                dAlertLevel === 'Red' ? 'red' :
                  'blue'; // 기본색상

          return (
            <div>
              <Link href={earthURL}>
                {dCountry}: new {dType}
                <span style={{ color: alertLevelColor }}> ({dAlertLevel})</span>.
                {' '}
                Click <span style={{ color: 'yellow' }}>here</span> for details.
              </Link>
            </div>
          );
        };

        toast.warn(<CustomToastWithLink dType={result.dType} dCountry={result.dCountry} dAlertLevel={result.dAlertLevel} earthURL={earthURL} />, {
          position: "top-right",
          autoClose: 20000, // "false", integer
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark", // "light", "dark", "colored"
        });
      });

      socketRef.current.on('disconnect', () => {
        console.log('Log: Alerts websocket disconnected from server'); // Debug-only
      });
    }

    return () => {
      if (socketRef.current?.connected) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <>
      <ToastContainer limit={5} />
    </>
  )
}

export default AlertModule;