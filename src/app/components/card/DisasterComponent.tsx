import React, { useState } from 'react';

const DisasterComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState(1);

  const selectTab = (tabNumber: React.SetStateAction<number>) => {
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
        {activeTab === 1 && <div className='tabContent'>Content of Card 1</div>}
        {activeTab === 2 && <div className='tabContent'>Content of Card 2</div>}
        {activeTab === 3 && <div className='tabContent'>Content of Card 3</div>}
      </div>
    </div>
  );
};

export default DisasterComponent;