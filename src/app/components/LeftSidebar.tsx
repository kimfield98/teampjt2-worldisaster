"use client"

import React from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { leftSidebarState, selectedDisasterIdState } from '../recoil/dataRecoil';
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
  if (dID === null) return null;

  const handleUploadComplete = (videoUrl: string) => {
    console.log("Uploaded video URL:", videoUrl);
  };

  return (
    <div className={`leftSidebar ${leftSidebar.isOpen ? 'block' : 'hidden'}`}>
      <div className='leftLogoBox'>
        <div className='leftLogo'>WorlDisaster</div>
        <div className='leftIcon' onClick={() => setLeftSidebar({ isOpen: false, activeIcon: 'none' })}>
          <img src="/Left/x.svg" alt="X"/>
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
