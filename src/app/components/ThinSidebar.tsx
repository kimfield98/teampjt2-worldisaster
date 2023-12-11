"use client"

import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { leftSidebarState, chatState, darkModeState } from '../recoil/dataRecoil';

const ThinSidebar: React.FC = () => {
  const [{ isOpen, activeIcon }, setLeftSidebar] = useRecoilState(leftSidebarState);
  const [isChatOpen, setIsChatOpen] = useRecoilState(chatState);
  const isDarkMode = useRecoilValue(darkModeState);

  const handleLogoClick = (): void => {
    setLeftSidebar({ isOpen: false, activeIcon: 'none' });
  };

  const handleIconClick = (iconType: string): void => {
    setLeftSidebar({ isOpen: true, activeIcon: iconType });
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    setLeftSidebar({ isOpen: false, activeIcon: 'chat' });
  };

  const isSelectedIcon = (iconType: string) => {
    return activeIcon === iconType ? 'thinSelectedIcon' : '';
  };

  return (
  <div className={`thinSidebar ${isDarkMode ? 'darkMode' : ''}`}>
    <div className='thinLogo' onClick={handleLogoClick}>
      <img
        src={isDarkMode ? "/Thin/darklogo.svg" : "/Thin/earth.png"}
        alt="Logo"
        className='w-8 h-8'/>
    </div>``

    <div className='thinIconBox'>
      <div className={`thinIcon ${isSelectedIcon('detail')}`} onClick={() => handleIconClick('detail')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#24292F" viewBox="0 0 16 16">
          <path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1M.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8H.8z"/>
        </svg>
      </div>
      <div className={`thinIcon ${isSelectedIcon('subscribe')}`} onClick={() => handleIconClick('subscribe')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#24292F" viewBox="0 0 16 16">
          <path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1M.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8H.8z"/>
        </svg>
      </div>
      <div className={`thinIcon ${isSelectedIcon('support')}`} onClick={() => handleIconClick('support')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#24292F" viewBox="0 0 16 16">
          <path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1M.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8H.8z"/>
        </svg>
      </div>
      <div className={`thinIcon ${isSelectedIcon('upload')}`} onClick={() => handleIconClick('upload')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#24292F" viewBox="0 0 16 16">
          <path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1M.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8H.8z"/>
        </svg>
      </div>
      <div className={`thinIcon ${isSelectedIcon('chat')}`} onClick={toggleChat}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#24292F" viewBox="0 0 16 16">
          <path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1M.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8H.8z"/>
        </svg>
      </div>
    </div>
  </div>
  );
}

export default ThinSidebar;
