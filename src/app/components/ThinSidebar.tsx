"use client"

import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { leftSidebarState, chatState, darkModeState, userLoginState } from '../recoil/dataRecoil';

const ThinSidebar: React.FC = () => {
  const [{ isOpen, activeIcon }, setLeftSidebar] = useRecoilState(leftSidebarState);
  const isDarkMode = useRecoilValue(darkModeState);
  const userLogin = useRecoilValue(userLoginState);

  interface TooltipProps {
    children: React.ReactNode;
    text: string;
  }

  const Tooltip: React.FC<TooltipProps> = ({ children, text }) => (
    <div className="relative flex items-center group">
      <div className="absolute left-full top-1/2 transform -translate-y-1/2 hidden group-hover:block pl-[8px]" style={{zIndex:1000}}>
        <div className="bg-gray-400 text-white text-xs rounded py-1 px-3">
          {text}
          <div className="absolute top-1/2 left-3 transform -translate-y-1/2 -translate-x-full">
            <svg className="h-2 w-2 text-gray-400" viewBox="0 0 255 255">
              <polygon className="fill-current" points="0,127.5 127.5,255 127.5,0" />
            </svg>
          </div>
        </div>
      </div>
      {children}
    </div>
  );

  const handleIconClick = (iconType: string): void => {
    // 로그인하지 않은 사용자가 'detail' 아이콘을 제외한 아이콘을 클릭할 경우
    if (!userLogin.isLoggedIn && iconType !== 'detail' && iconType !== 'list') {
      alert('로그인하세요!');
      return;
    }

    // 'detail' 아이콘이 이미 선택된 상태에서 다시 클릭할 경우 'none'으로 변경
    if (iconType === activeIcon) {
      setLeftSidebar({ isOpen: true, activeIcon: 'none' });
    } else {
      setLeftSidebar({ isOpen: true, activeIcon: iconType });
    }
  };

  const isSelectedIcon = (iconType: string) => {
    return activeIcon === iconType && isOpen ? isDarkMode? '#ffffff':'#000000' : isDarkMode? '#898989':'#b4b4b4';
  };

  return (
  <div className={`thinSidebar ${isDarkMode ? 'darkMode' : ''}`}>
    <div className='thinIconBox'>
      <div className=" group">
        <Tooltip text="Info">
          <div className={`${isSelectedIcon('detail')}`} onClick={() => handleIconClick('detail')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill={`${isSelectedIcon('detail')}`} className="bi bi-info-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
              <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
            </svg>
          </div>
        </Tooltip>
      </div>
      <div className=" group">
      <Tooltip text="List">
        <div className={`${isSelectedIcon('list')}`} onClick={() => handleIconClick('list')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill={`${isSelectedIcon('list')}`} className="bi bi-list-columns-reverse" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M0 .5A.5.5 0 0 1 .5 0h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 .5m4 0a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10A.5.5 0 0 1 4 .5m-4 2A.5.5 0 0 1 .5 2h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m4 0a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m-4 2A.5.5 0 0 1 .5 4h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m4 0a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m-4 2A.5.5 0 0 1 .5 6h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m4 0a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5m-4 2A.5.5 0 0 1 .5 8h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m4 0a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5m-4 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m4 0a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10a.5.5 0 0 1-.5-.5m-4 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m4 0a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m-4 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m4 0a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>
          </svg>
        </div>
      </Tooltip>
      </div>
      {userLogin.isLoggedIn && (
      <>
        <Tooltip text="Chat">
          <div onClick={() => handleIconClick('chat')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill={`${isSelectedIcon('chat')}`} viewBox="0 0 16 16">
              <path d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
            </svg>
          </div>
        </Tooltip>
        <Tooltip text="Subscribe">
          <div onClick={() => handleIconClick('subscribe')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill={`${isSelectedIcon('subscribe')}`} viewBox="0 0 16 16">
            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
            </svg>
          </div>
        </Tooltip>
        <Tooltip text="Support">
          <div onClick={() => handleIconClick('support')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill={`${isSelectedIcon('support')}`} viewBox="0 0 16 16">
            <path d="M9 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h10s1 0 1-1-1-4-6-4-6 3-6 4m13.5-8.09c1.387-1.425 4.855 1.07 0 4.277-4.854-3.207-1.387-5.702 0-4.276Z"/>
            </svg>
          </div>
        </Tooltip>
      </>
      )}
    </div>
  </div>
  );
}

export default ThinSidebar;
