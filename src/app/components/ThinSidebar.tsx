"use client"

import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { leftSidebarState, chatState, darkModeState, userLoginState } from '../recoil/dataRecoil';
import Tooltip from './etc/Tooltip';

const ThinSidebar: React.FC = () => {
  const [{ isOpen, activeIcon }, setLeftSidebar] = useRecoilState(leftSidebarState);
  const isDarkMode = useRecoilValue(darkModeState);
  const userLogin = useRecoilValue(userLoginState);

  interface TooltipProps {
    children: React.ReactNode;
    text: string;
  }

  const handleIconClick = (iconType: string): void => {
    // 로그인하지 않은 사용자가 'detail' 아이콘을 제외한 아이콘을 클릭할 경우
    if (!userLogin.isLoggedIn && iconType !== 'detail' && iconType !== 'list') {
      alert('Please log in to use our key features.');
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
    return activeIcon === iconType && isOpen ? isDarkMode ? '#ffffff' : '#000000' : isDarkMode ? '#898989' : '#b4b4b4';
  };

  return (
    <div className={`thinSidebar ${isDarkMode ? 'darkMode' : ''}`}>
      <div className='thinIconBox'>
        <div className=" group">
          <Tooltip type="left-side" text="List">
            <div className={`${isSelectedIcon('list')}`} onClick={() => handleIconClick('list')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill={`${isSelectedIcon('list')}`} className="bi bi-exclamation-triangle" viewBox="0 0 16 16">
                <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z" />
                <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
              </svg>
            </div>
          </Tooltip>
        </div>
        <div className=" group">
          <Tooltip type="left-side" text="Info">
            <div className={`${isSelectedIcon('detail')}`} onClick={() => handleIconClick('detail')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill={`${isSelectedIcon('detail')}`} className="bi bi-info-circle-fill" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
              </svg>
            </div>
          </Tooltip>
        </div>
        {userLogin.isLoggedIn && (
          <>
            <Tooltip type="left-side" text="Chat">
              <div onClick={() => handleIconClick('chat')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill={`${isSelectedIcon('chat')}`} viewBox="0 0 16 16">
                  <path d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                </svg>
              </div>
            </Tooltip>
            <Tooltip type="left-side" text="Subscribe">
              <div onClick={() => handleIconClick('subscribe')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill={`${isSelectedIcon('subscribe')}`} viewBox="0 0 16 16">
                  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z" />
                </svg>
              </div>
            </Tooltip>
            <Tooltip type="left-side" text="Support">
              <div onClick={() => handleIconClick('support')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill={`${isSelectedIcon('support')}`} viewBox="0 0 16 16">
                  <path d="M9 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h10s1 0 1-1-1-4-6-4-6 3-6 4m13.5-8.09c1.387-1.425 4.855 1.07 0 4.277-4.854-3.207-1.387-5.702 0-4.276Z" />
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
