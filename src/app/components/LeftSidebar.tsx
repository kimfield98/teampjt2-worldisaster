"use client"

import React, { useEffect } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { leftSidebarState, selectedDisasterIdState, darkModeState, mailAlarmState, deletAlertPoint } from '../recoil/dataRecoil';
import NationComponent from './card/NationComponent';
import DisasterComponent from './card/DisasterComponent';
import Support from './etc/Donate';
import Upload from './etc/Upload';
import MailAlertModule from './socket/MailAlertModule';
import ChatModule from '../components/socket/ChatModule';
import TenDisaster from './etc/Tendisaster';
import Welcome from './card/WelcomDisaster';

interface DetailProps {
  dID: string;
}

const LeftSidebar: React.FC<DetailProps> = ({ dID }) => {
  const [leftSidebar, setLeftSidebar] = useRecoilState(leftSidebarState);
  const selectedDisasterId = useRecoilValue(selectedDisasterIdState);
  const isDarkMode = useRecoilValue(darkModeState);
  const [alertInfo, setAlertInfo] = useRecoilState(mailAlarmState);
  const [AlertPoint, setAlertPoint] = useRecoilState(deletAlertPoint)
  if (dID === null) return null;

  const handleUploadComplete = (videoUrl: string) => {
    console.log("Uploaded video URL:", videoUrl);
  };

  useEffect(()=>{
    setAlertPoint(leftSidebar.activeIcon)
  },[leftSidebar.activeIcon])

  return (
    <div className={`w-full pt-20 md:pt-5 md:w-[500px] leftSidebar custom-scrollbar h-screen overflow-auto ${leftSidebar.isOpen ? 'block' : 'hidden'} ${isDarkMode ? 'darkMode' : ''}`}>
      <div className='hidden md:block leftIcon' onClick={() => { setLeftSidebar({ isOpen: false, activeIcon: 'none' }); setAlertInfo({ ...alertInfo, open: false }) }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
        </svg>
      </div>
      {leftSidebar.activeIcon === 'detail' && (
        <div>
          <NationComponent dID={selectedDisasterId} />
          <DisasterComponent dID={selectedDisasterId} />
        </div>
      )}
      {leftSidebar.activeIcon === 'list' && (
        <div>
          <TenDisaster />
        </div>
      )}
      {leftSidebar.activeIcon === 'subscribe' && (
        <div>
          <MailAlertModule />
        </div>
      )}
      {leftSidebar.activeIcon === 'support' && (
        <div>
          <Support />
        </div>
      )}
      {leftSidebar.activeIcon === 'chat' && (
        <div>
          <ChatModule />
        </div>
      )}
      {leftSidebar.activeIcon === 'none' && (
        <div>
          <div className='card2 flex flex-col items-center'>
            <Welcome />
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;
