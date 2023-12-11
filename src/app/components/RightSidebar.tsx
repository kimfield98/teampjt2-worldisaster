"use client"

import React, { useState } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { rightSidebarState, darkModeState, filterState } from '../recoil/dataRecoil';
import Toggle from './Filter/Toggle';
import Tag from './Filter/Tag';
import Dragbar from './Filter/Dragbar';

const RightSidebar: React.FC = () => {
  const [rightSidebar, setrightSidebar] = useRecoilState(rightSidebarState);
  const isDarkMode = useRecoilValue(darkModeState);
  const filter = useRecoilValue(filterState);
  const [isCardVisible, setIsCardVisible] = useState(false);
  
  const toggleRightSidebar = () => {
    setrightSidebar(prevState => ({
      ...prevState,
      isOpen: !prevState.isOpen
    }));
  };

  const toggleCardVisibility = () => {
    setIsCardVisible(prevState => !prevState);
  };

  return (
    <div className={`rightSidebar custom-scrollbar h-screen overflow-auto ${rightSidebar.isOpen ? 'block' : 'hidden'} ${isDarkMode ? 'darkMode' : ''}`}>
      <div className='rightLogoBox'>
        <div className='rightLogo'>Filter</div>
        <div className='rightIcon' onClick={toggleRightSidebar}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </div>
      </div>
      <div className='card2'>
      <p className='font-bold mb-3'>Find information with our filters! 🔍</p>
      <p>We offer:</p>
      <p className='my-1'>
        <p>1 Ongoing/Past disaster data</p>
        <p>2 Data by disaster type</p>
        <p>3 Annual disaster trends</p>
      </p>
      <p>
        <span>Click below for details.</span>
        <span className='font-bold underline ml-1 cursor-pointer' onClick={toggleCardVisibility}>Button</span>
      </p>
      </div>
      {isCardVisible && (
        <div className='card2'>
          여기 핀 정보 보여줄게
        </div>
      )}
      <Toggle />
      <Tag />
      <Dragbar />
    </div>
  );
};

export default RightSidebar;
