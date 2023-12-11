import React from 'react';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../recoil/dataRecoil';

const OngoingList: React.FC = () => {
  const isDarkMode = useRecoilValue(darkModeState);

  return (
    <div className={`card ${isDarkMode ? 'darkMode' : ''}`}>
      <div className='cardTitle'>Ongoing Disasters List</div>
    </div>
  );
};

export default OngoingList;
