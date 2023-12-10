"use client"

import React from 'react';
import { useRecoilState } from 'recoil';
import { leftSidebarState, chatState } from '../recoil/dataRecoil';

const ThinSidebar: React.FC = () => {
  const [{ isOpen, activeIcon }, setLeftSidebar] = useRecoilState(leftSidebarState);
  const [isChatOpen, setIsChatOpen] = useRecoilState(chatState);

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
  <div className='thinSidebar'>
    <div onClick={handleLogoClick}>
      <img src="Thin/earth.png" alt="Logo" className='w-8 h-8'/>
    </div>

    <div className='thinIconBox'>
      <div className={`thinIcon ${isSelectedIcon('detail')}`} onClick={() => handleIconClick('detail')}>
        <img src="/Thin/detail.svg" alt="detail" className='w-5 h-5' style={{ fill: '#24292F' }}/>
      </div>
      <div className={`thinIcon ${isSelectedIcon('subscribe')}`} onClick={() => handleIconClick('subscribe')}>
        <img src="/Thin/subscribe.svg" alt="subscribe" className='w-5 h-5' style={{ fill: '#24292F' }}/>
      </div>
      <div className={`thinIcon ${isSelectedIcon('support')}`} onClick={() => handleIconClick('support')}>
        <img src="/Thin/support.svg" alt="support" className='w-5 h-5' style={{ fill: '#24292F' }}/>
      </div>
      <div className={`thinIcon ${isSelectedIcon('upload')}`} onClick={() => handleIconClick('upload')}>
        <img src="/Thin/upload.svg" alt="upload" className='w-5 h-5' style={{ fill: '#24292F' }}/>
      </div>
      <div className='thinIcon' onClick={toggleChat}>
        <img src="/Thin/chat.svg" alt="Chat" className='w-5 h-5' style={{ fill: '#24292F' }}/>
      </div>
    </div>
  </div>
  );
}

export default ThinSidebar;
