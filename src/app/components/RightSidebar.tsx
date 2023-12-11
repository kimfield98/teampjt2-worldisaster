"use client"

import React from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { rightSidebarState, darkModeState, filterState } from '../recoil/dataRecoil';
import Toggle from './Filter/Toggle';

const RightSidebar: React.FC = () => {
  const [rightSidebar, setrightSidebar] = useRecoilState(rightSidebarState);
  const isDarkMode = useRecoilValue(darkModeState);
  const filter = useRecoilValue(filterState);
  
  const toggleRightSidebar = () => {
    setrightSidebar(prevState => ({
      ...prevState,
      isOpen: !prevState.isOpen
    }));
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
      <div>
      <Toggle />
      </div>
      {filter.selectedLive ? (
        <div className='card2'>ongoing</div>
      ) : (
        <div className='card2'>past</div>
      )}
    </div>
  );
};

export default RightSidebar;
