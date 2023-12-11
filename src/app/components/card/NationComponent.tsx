import React from 'react';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../recoil/dataRecoil';


const NationComponent: React.FC = () => {
  const isDarkMode = useRecoilValue(darkModeState);

  return (
    <div className={`card ${isDarkMode ? 'darkMode' : ''}`}>
      <div className='cardTitle'>
        국가정보
      </div>
      <div className='cardContentBox'>
        <div className='cardContent'>
          여기에 정보가 들어갑니다.
        </div>
      </div>
    </div>
  );
};

export default NationComponent;
