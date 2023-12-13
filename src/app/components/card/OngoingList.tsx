import React from 'react';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../recoil/dataRecoil';
import TenDisaster from '../etc/Tendisaster';

const OngoingList: React.FC = () => {
  const isDarkMode = useRecoilValue(darkModeState);

  return (
    <div className={`card ${isDarkMode ? 'darkMode' : ''}`}>
      <div className='cardTitle'>List of Ongoing Disasters</div>
      <TenDisaster />
    </div>
  );
};

export default OngoingList;
