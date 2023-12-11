"use client"

import React from 'react';
import dynamic from 'next/dynamic';
import ThinSidebar from '../components/ThinSidebar';
import LeftSidebar from '../components/LeftSidebar';
import Navbar from '../components/Navbar';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../recoil/dataRecoil';

const LoadingComponent = () => (
  <div className="flex justify-center items-center h-screen bg-black">
    <p>Loading...</p>
  </div>
);

const DynamicEarthCanvas = dynamic(
  () => import('../components/EarthCesium'),
  { loading: () => <LoadingComponent /> }
);

const Earth: React.FC = () => {
  const isDarkMode = useRecoilValue(darkModeState);

  return (
    <>
      <div className={`flex ${isDarkMode ? 'darkMode' : ''}`}>
        <ThinSidebar />
        <LeftSidebar dID={''} />
        <div className="flex-1 h-screen relative">
          <Navbar />
          <DynamicEarthCanvas />
        </div>
      </div>
    </>
    
  );
};

export default Earth;
