import React, { useState } from 'react';
import Article from '../etc/Article';
import Video from '../etc/Video';

interface DisasterComponentProps {
  dID: string;
}

const DisasterComponent: React.FC<DisasterComponentProps> = ({ dID }) => {
  const [activeTab, setActiveTab] = useState(1);

  const selectTab = (tabNumber: number) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className="card">
      <div className='cardTitle'>재난 상세 정보</div>
      <div className="tabList">
        <div className={`tab ${activeTab === 1 ? 'active' : ''}`} onClick={() => selectTab(1)}>상세정보</div>
        <div className={`tab ${activeTab === 2 ? 'active' : ''}`} onClick={() => selectTab(2)}>기사</div>
        <div className={`tab ${activeTab === 3 ? 'active' : ''}`} onClick={() => selectTab(3)}>동영상</div>
      </div>
      <div className='tabContentBox'>
        {activeTab === 1 &&
          <div className='tabContent'>
            <div className='cardTitle'>재난 상세 정보</div>
            {dID ? (
              <div className='cardContent'>
                <p>재난 ID: {dID}</p>
              </div>
            ) : (
              <p className='cardContent'>재난 정보를 불러오는 중...</p>
            )}
          </div>
        }
        {activeTab === 2 && dID &&
          <div className='tabContent'>
            <div className='cardTitle'>기사&뉴스</div>
            <Article dID={dID} />
          </div>
        }

        {activeTab === 3 && dID &&
          <div className='tabContent'>
            <div className='cardTitle'>동영상</div>
            <Video dID={dID} />
          </div>
        }
      </div>
    </div>
  );
};

export default DisasterComponent;