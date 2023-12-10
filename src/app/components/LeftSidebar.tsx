"use client"

import React from 'react';
import { useRecoilState } from 'recoil';
import { leftSidebarState } from '../recoil/dataRecoil';

const LeftSidebar: React.FC = () => {
  const [leftSidebar, setLeftSidebar] = useRecoilState(leftSidebarState);

  return (
    <div style={{ width: '500px' }} className={`bg-white h-screen transition-transform duration-300 ${leftSidebar ? 'block' : 'hidden'}`}>
      <button onClick={() => setLeftSidebar(false)}>X</button>
      LeftSidebar Content
    </div>
  );
};

export default LeftSidebar;
