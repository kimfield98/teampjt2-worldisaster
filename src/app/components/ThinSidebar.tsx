"use client"

import React from 'react';
import { useRecoilState } from 'recoil';
import { leftSidebarState } from '../recoil/dataRecoil';

const ThinSidebar: React.FC = () => {
  const [leftSidebar, setLeftSidebar] = useRecoilState(leftSidebarState);

  const handleLogoClick = (): void => {
    setLeftSidebar(false);
  };

  const handleIconClick = (): void => {
    setLeftSidebar(true);
  };

  return (
  <div className='thinSidebar'>
    <div onClick={handleLogoClick}>
      <img src="Thin/earth.png" alt="Logo" className='w-8 h-8'/>
    </div>

    <div className='thinIconBox' onClick={handleIconClick}>
      <div className='thinIcon'>
        <img src="/Thin/detail.svg" alt="File" className='w-5 h-5' style={{ fill: '#24292F' }}/>
      </div>
      <div className='thinIcon' onClick={handleIconClick}>
        <img src="/Thin/subscribe.svg" alt="Bell" className='w-5 h-5' style={{ fill: '#24292F' }}/>
      </div>
      <div className='thinIcon' onClick={handleIconClick}>
        <img src="/Thin/support.svg" alt="People" className='w-5 h-5' style={{ fill: '#24292F' }}/>
      </div>
      <div className='thinIcon' onClick={handleIconClick}>
        <img src="/Thin/upload.svg" alt="upload" className='w-5 h-5' style={{ fill: '#24292F' }}/>
      </div>
    </div>
  </div>
  );
}

export default ThinSidebar;
