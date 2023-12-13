import React, { useState } from 'react';
import Article from '../etc/Article';
import { useRecoilValue } from 'recoil';
import { darkModeState, dataState, userLoginState } from '../../recoil/dataRecoil';
import Video from '../etc/Video';
import Upload from '../etc/Upload';
import { useRouter } from 'next/navigation';

interface DisasterComponentProps {
  dID: string;
}

const DisasterComponent: React.FC<DisasterComponentProps> = ({ dID }) => {
  const [activeTab, setActiveTab] = useState(1);
  const detailData = useRecoilValue(dataState).find((item) => item.dID === dID);
  const isDarkMode = useRecoilValue(darkModeState);
  const isLogin = useRecoilValue(userLoginState).isLoggedIn;
  const router = useRouter();

  const selectTab = (tabNumber: number) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className={`card ${isDarkMode ? 'darkMode' : ''}`}>
      <div className='cardTitle'>Disaster Information</div>
      <div className="tabList">
        <div className={`tab ${activeTab === 1 ? 'active tabActive' : ''}`} onClick={() => selectTab(1)}>Details</div>
        {detailData && (
          <>
            <div className={`tab ${activeTab === 2 ? 'active tabActive' : ''}`} onClick={() => selectTab(2)}>News</div>
            <div className={`tab ${activeTab === 3 ? 'active tabActive' : ''}`} onClick={() => selectTab(3)}>Videos</div>
            <div className={`tab ${activeTab === 4 ? 'active tabActive' : ''}`} onClick={() => selectTab(4)}>Upload</div>
          </>)
        }
      </div>
      <div className='tabContentBox'>
        {activeTab === 1 &&
          <div className='tabContent'>
            {dID && detailData ? (
              <table>
                <tbody className='px-3'>
                  <tr>
                    <td style={{ paddingRight: '8px', paddingBottom: '10px' }} className="min-w-auto bold text-black mb-2">Type:</td>
                    <td style={{ fontStyle: 'italic', paddingBottom: '10px' }}>{detailData.dType}</td>
                  </tr>
                  {detailData.dAlertLevel &&
                    <tr>
                      <td style={{ paddingRight: '8px', paddingBottom: '10px' }} className="min-w-auto bold text-black mb-2">Alert Level:</td>
                      <td style={{ fontStyle: 'italic', paddingBottom: '10px' }}>{detailData.dAlertLevel}<span style={{ margin: '10px', paddingLeft: '20px', height: '10px', width: '10px', borderRadius: '50%', backgroundColor: detailData.dAlertLevel }}></span></td>
                    </tr>}
                  <tr>
                    <td style={{ paddingRight: '8px', paddingBottom: '10px' }} className="min-w-auto bold text-black">Location:</td>
                    <td style={{ fontStyle: 'italic', paddingBottom: '10px' }}>Lat: {detailData.dLatitude.toFixed(4)}, Lon: {detailData.dLongitude.toFixed(4)}</td>
                  </tr>
                  <tr>
                    <td style={{ paddingRight: '8px', paddingBottom: '10px' }} className="min-w-auto bold text-black mb-2">Date:</td>
                    <td style={{ fontStyle: 'italic', paddingBottom: '10px' }}>{detailData.dDate}</td>
                  </tr>
                  <tr>
                    <td style={{ paddingRight: '8px', paddingBottom: '10px' }} className=" align-top start text min-w-auto bold text-black mb-2">Description: </td>
                    <td style={{ fontStyle: 'italic', paddingBottom: '10px' }}>
                      {detailData.dDescription} {' '}
                      {detailData.dUrl == null ? null :
                        <button
                          onClick={() => { router.push(detailData.dUrl) }}
                          style={{ color: 'blue', fontStyle: 'italic' }}
                          className='hover:text-gray-500 active:text-gray-300'
                        >
                          (GDACS)
                        </button>
                      }
                    </td>                  </tr>
                </tbody>
              </table>
            ) : (
              <p className='cardContent'>Select a disaster from the world map.</p>
            )}
          </div>
        }
        {activeTab === 2 && dID &&
          <div className='tabContent'>
            <Article dID={dID} />
          </div>
        }
        {activeTab === 3 && dID &&
          <div className='tabContent flex items-center justify-center'>
            <Video />
          </div>
        }
        {isLogin && activeTab === 4 && dID &&
          <div className='tabContent flex items-center justify-center ml-[20px]'>
            <Upload dID={dID} />
          </div>
        }
      </div>
    </div>
  );
};

export default DisasterComponent;