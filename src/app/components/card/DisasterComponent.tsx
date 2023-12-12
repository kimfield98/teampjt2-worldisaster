import React, { useState } from 'react';
import Article from '../etc/Article';
import { useRecoilValue } from 'recoil';
import { darkModeState, dataState } from '../../recoil/dataRecoil';
import Link from 'next/link';
import Video from '../etc/Video';


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
      <div className='cardTitle'>Disaster Detail Info</div>
      <div className="tabList">
        <div className={`tab ${activeTab === 1 ? 'active tabActive' : ''}`} onClick={() => selectTab(1)}>Detail</div>
        <div className={`tab ${activeTab === 2 ? 'active tabActive' : ''}`} onClick={() => selectTab(2)}>Article</div>
        <div className={`tab ${activeTab === 3 ? 'active tabActive' : ''}`} onClick={() => selectTab(3)}>Video</div>
      </div>
      <div className='tabContentBox'>
        {activeTab === 1 &&
          <div className='tabContent'>
            <div className='cardTitle'>Disaster Detail Information</div>
            {dID && detailData? (
            <table>
              <tbody className='px-3'>
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
              <p className='cardContent'>Click the Pin. Can see More Info</p>
            )}
          </div>
        }
        {activeTab === 2 && dID &&
          <div className='tabContent'>
            <Article dID={dID} />
          </div>
        }

        {activeTab === 3 && dID &&
          <div className='tabContent'>
            <Video dID={dID}/>
          </div>
        }
      </div>
    </div>
  );
};

export default DisasterComponent;