"use client"
import React, { useState, useEffect } from 'react';
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
  
  interface DetailProps {
    color?: string;
    imageSrc?: string;
    description: string;
  }

  const Pin:React.FC<DetailProps> = ({ color, imageSrc, description }) => {
    const renderPin = () => {
      if (imageSrc) {
        // imageSrc가 있을 때의 스타일
        return (
          <div className="w-8 h-8" style={{ backgroundImage: `url('../${imageSrc}')`, backgroundSize: 'cover' }}></div>
        );
      } else if (color) {
        // color가 있을 때의 원 스타일
        return (
          <div style={{backgroundColor: `${color}`}} className={`min-w-4 w-4 min-h-4 h-4 mx-2 rounded-full border-2 border-white`}></div>
        );
      }
    };
  
    return (
      <div className="flex items-center space-x-2 px-2">
        {renderPin()}
        <span className="text-sm">{description}</span>
      </div>
    );
  };

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
    <div className={`rightSidebar pl-[20px] custom-scrollbar h-screen overflow-auto ${rightSidebar.isOpen ? 'block' : 'hidden'} ${isDarkMode ? 'darkMode' : ''}`}>
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
          <div className=' font-bold'>Real-time Pin</div>
            <Pin color="#A374DB" description="Indicates events currently in progress." />
            <Pin imageSrc="/pin.png" description="Provides real-time information." />
          <div className=' font-bold'>Archive</div>
            <Pin color="#5CFFD1" description="Archive Pin: Displays past events." />
          <div className="Notification">
            <div className=' font-bold'>Notification</div>
              <div className="relative flex items-center ">
                <div className="min-w-11 w-11 min-h-8 h-8 mx-2 bg-[#FF0000] rounded-full opacity-20"></div>
                <div className="min-w-4 w-4 min-h-4 h-4 mx-4 bg-[#FF0000] rounded-full border-2 border-white absolute"></div>
                <span className="text-sm">Shows subscriber-set notification location and range.</span>
              </div>
          </div>
        </div>
      )}
      <Toggle />
      {!filter.selectedLive && <Dragbar />}
      <Tag />
    </div>
  );
};

export default RightSidebar;
