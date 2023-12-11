import React, { useState } from 'react';
import Article from '../etc/Article';
import Video from '../etc/Video';
import { useRecoilValue } from 'recoil';
import { darkModeState, dataState } from '../../recoil/dataRecoil';
import Link from 'next/link';


interface DisasterComponentProps {
  dID: string;
}

const DisasterComponent: React.FC<DisasterComponentProps> = ({ dID }) => {
  const [activeTab, setActiveTab] = useState(1);
  const detailData = useRecoilValue(dataState).find((item) => item.dID === dID);
  const isDarkMode = useRecoilValue(darkModeState);

  const selectTab = (tabNumber: number) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className={`card ${isDarkMode ? 'darkMode' : ''}`}>
      <div className='cardTitle'>재난 상세 정보</div>
      <div className="tabList">
        <div className={`tab ${activeTab === 1 ? 'active tabBold' : ''}`} onClick={() => selectTab(1)}>상세정보</div>
        <div className={`tab ${activeTab === 2 ? 'active tabBold' : ''}`} onClick={() => selectTab(2)}>기사</div>
        <div className={`tab ${activeTab === 3 ? 'active tabBold' : ''}`} onClick={() => selectTab(3)}>동영상</div>
      </div>
      <div className='tabContentBox'>
        {activeTab === 1 &&
          <div className='tabContent'>
            <div className='cardTitle'>재난 상세 정보</div>
            {dID && detailData? (
              <table>
              <tbody>
                <tr>
                  <td className="min-w-auto bold text-black mb-2">Country:</td>
                  <td>{detailData.dCountry}</td>
                </tr>
                <tr>
                  <td className="min-w-auto bold text-black mb-2">Date:</td>
                  <td>{detailData.dDate}</td>
                </tr>
                <tr>
                  <td className=" align-top start text min-w-auto bold text-black mb-2">Description: </td>
                  <td className=" nowrap overflow-hidden text-ellipsis line-clamp-3 width:300px">{detailData.dDescription}</td>
                </tr>
                <tr>
                  <td className="min-w-auto bold text-black mb-2"></td>
                  <td>{detailData.dUrl==null? null:<Link target='_blank' href={detailData.dUrl} className='hover:text-gray-500 active:text-gray-300'> ...more</Link>}</td>
                </tr>
                {detailData.dAlertLevel && 
                <tr>
                  <td className="min-w-auto bold text-black mb-2">Alert Level:</td>
                  <td>{detailData.dAlertLevel}<span style={{margin: '20px', paddingLeft: '20px', height: '10px', width: '10px', borderRadius: '50%', backgroundColor: detailData.dAlertLevel }}></span></td>
                </tr>}
                <tr>
                  <td className="min-w-auto bold text-black">Latitude:</td>
                  <td>{detailData.dLatitude.toFixed(4)}</td>
                </tr>
                <tr>
                  <td className="min-w-auto bold text-black">Longitude:</td>
                  <td>{detailData.dLongitude.toFixed(4)}</td>
                </tr>
              </tbody>
            </table>
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