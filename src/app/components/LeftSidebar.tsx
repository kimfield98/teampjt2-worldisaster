"use client"

import React from 'react';
import { useRecoilState } from 'recoil';
import { leftSidebarState } from '../recoil/dataRecoil';
import NationComponent from './card/NationComponent';
import DisasterComponent from './card/DisasterComponent';
import Support from './etc/Suppot';
import Upload from './etc/Upload';

const LeftSidebar: React.FC = () => {
  const [leftSidebar, setLeftSidebar] = useRecoilState(leftSidebarState);

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
          <DisasterComponent />
        </div>
      )}
      {leftSidebar.activeIcon === 'subscribe' && (
        <div>
          구독 페이지 입니다.
        </div>
      )}
      {leftSidebar.activeIcon === 'support' && (
        <div>
          <Support />
        </div>
      )}
      {leftSidebar.activeIcon === 'upload' && (
        <div>
          <Upload dID={''} onUploadComplete={function (videoUrl: string): void {
            throw new Error('Function not implemented.');
          } } />
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;
