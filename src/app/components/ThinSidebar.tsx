"use client"

import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { leftSidebarState, chatState, darkModeState, userLoginState } from '../recoil/dataRecoil';

const ThinSidebar: React.FC = () => {
  const [{ isOpen, activeIcon }, setLeftSidebar] = useRecoilState(leftSidebarState);
  const [isChatOpen, setIsChatOpen] = useRecoilState(chatState);
  const isDarkMode = useRecoilValue(darkModeState);
  const userLogin = useRecoilValue(userLoginState);

  const handleIconClick = (iconType: string): void => {
    if (!userLogin.isLoggedIn && iconType !== 'detail') {
      alert('로그인하세요!');
      return;
    }
    setLeftSidebar({ isOpen: true, activeIcon: iconType });
  };

  const isSelectedIcon = (iconType: string) => {
    return activeIcon === iconType ? 'thinSelectedIcon' : '';
  };

  return (
  <div className={`thinSidebar ${isDarkMode ? 'darkMode' : ''}`}>

    <div className='thinIconBox'>
      <div className={`thinIcon ${isSelectedIcon('detail')}`} onClick={() => handleIconClick('detail')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#24292F" viewBox="0 0 16 16">
          <path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1M.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8H.8z"/>
        </svg>
      </div>
      <div className={`thinIcon ${isSelectedIcon('subscribe')}`} onClick={() => handleIconClick('subscribe')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#24292F" viewBox="0 0 16 16">
        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
        </svg>
      </div>
      <div className={`thinIcon ${isSelectedIcon('support')}`} onClick={() => handleIconClick('support')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#24292F" viewBox="0 0 16 16">
        <path d="M9 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h10s1 0 1-1-1-4-6-4-6 3-6 4m13.5-8.09c1.387-1.425 4.855 1.07 0 4.277-4.854-3.207-1.387-5.702 0-4.276Z"/>
        </svg>
      </div>
      <div className={`thinIcon ${isSelectedIcon('upload')}`} onClick={() => handleIconClick('upload')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#24292F" viewBox="0 0 16 16">
        <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2m2.354 5.146a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0z"/>
        </svg>
      </div>
      <div className={`thinIcon ${isSelectedIcon('chat')}`} onClick={() => handleIconClick('chat')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#24292F" viewBox="0 0 16 16">
          <path d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
        </svg>
      </div>
    </div>
  </div>
  );
}

export default ThinSidebar;
