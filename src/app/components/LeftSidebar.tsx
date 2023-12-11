"use client"

import React from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { leftSidebarState, selectedDisasterIdState, darkModeState } from '../recoil/dataRecoil';
import NationComponent from './card/NationComponent';
import DisasterComponent from './card/DisasterComponent';
import Support from './etc/Suppot';
import Upload from './etc/Upload';
import MailAlertModule from './socket/MailAlertModule';

interface DetailProps {
  dID: string;
}

const LeftSidebar: React.FC<DetailProps> = ({ dID }) => {
  const [leftSidebar, setLeftSidebar] = useRecoilState(leftSidebarState);
  const selectedDisasterId = useRecoilValue(selectedDisasterIdState);
  const isDarkMode = useRecoilValue(darkModeState);
  if (dID === null) return null;

  const handleUploadComplete = (videoUrl: string) => {
    console.log("Uploaded video URL:", videoUrl);
  };

  return (
    <div className={`leftSidebar ${leftSidebar.isOpen ? 'block' : 'hidden'} ${isDarkMode ? 'darkMode' : ''}`}>
      <div className='leftLogoBox'>
        <div className='leftLogo'>WorlDisaster</div>
        <div className='leftIcon' onClick={() => setLeftSidebar({ isOpen: false, activeIcon: 'none' })}>
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-x leftIconSvg mr-3" viewBox="0 0 16 16">
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>
        </div>
      </div>
      {leftSidebar.activeIcon === 'detail' && (
        <div>
          <NationComponent />
          <DisasterComponent dID={selectedDisasterId} />
        </div>
      )}
      {leftSidebar.activeIcon === 'subscribe' && (
        <div>
          <MailAlertModule/>
        </div>
      )}
      {leftSidebar.activeIcon === 'support' && (
        <div>
          <Support />
        </div>
      )}
      {leftSidebar.activeIcon === 'upload' && (
        <div>
          <Upload dID={dID} onUploadComplete={handleUploadComplete} />
        </div>
      )}
      {leftSidebar.activeIcon === 'none' && (
        <div>
          <p className='flex flex-col justify-center items-center h-[70vh]'>
            Click a disaster pin to continue.
          </p>
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;
