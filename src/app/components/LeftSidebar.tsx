"use client"

import React from 'react';
import { useRecoilState } from 'recoil';
import { leftSidebarState } from '../recoil/dataRecoil';
import NationComponent from './card/NationComponent';
import DisasterComponent from './card/DisasterComponent';

const LeftSidebar: React.FC = () => {
  const [leftSidebar, setLeftSidebar] = useRecoilState(leftSidebarState);

  return (
    <div className={`leftSidebar ${leftSidebar ? 'block' : 'hidden'}`}>
      <div className='leftLogoBox'>
        <div className='leftLogo'>WorlDisaster</div>
        <div className='leftIcon' onClick={() => setLeftSidebar(false)}>
          <img src="/Left/x.svg" alt="X"/>
        </div>
      </div>
      <NationComponent />
      <DisasterComponent />
    </div>
  );
};

export default LeftSidebar;
