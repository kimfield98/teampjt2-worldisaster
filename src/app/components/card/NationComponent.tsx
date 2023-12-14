import React, { useState, useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { darkModeState, countryState, ContryDataType, DataType, dataState } from '../../recoil/dataRecoil';

interface DisasterComponentProps {
  dID: string;
}

const NationComponent: React.FC<DisasterComponentProps> = ({ dID }) => {
  const isDarkMode = useRecoilValue(darkModeState);
  const countryData = useRecoilValue<ContryDataType[]>(countryState);
  const disasterData = useRecoilValue<DataType[]>(dataState).find((item) => item.dID === dID);
  const [currentCountry, setCurrentCountry] = useState<ContryDataType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number>(0); // 0: Collapsed, 1: Partially Expanded, 2: Fully Expanded

  useEffect(() => {
    setIsLoading(true);

    try {
      if (disasterData && disasterData.dCountryCode && disasterData) {
        const countryInfo = countryData.find(country => country.cCode === disasterData.dCountryCode);
        if (countryInfo) {
          setCurrentCountry(countryInfo);
        }
      }
      setIsLoading(false);
    } catch (error) {
      setError('An error occurred while fetching data.');
      setIsLoading(false);
    }
  }, [dID, disasterData, countryData]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!currentCountry) {
    return (<div className='card'>
      <div className='cardTitle'>Geographical Context</div>
      <div className='cardContent'>Select a disaster from the world map.</div>
    </div>
    )
  }

  const handleExpansion = () => {
    if (expanded < 2) {
      setExpanded(expanded + 1);
    } else {
      setExpanded(0);
    }
  };

  const renderData = (data: string | undefined) => {
    return data ? data : 'Not Found Data';
  };

  return (
    <div className={`card ${isDarkMode ? 'darkMode' : ''}`}>
      <div className=' flex justify-between items-center'>
        <div className='cardTitle'>
          Geographical Context
        </div>
      </div>
      <div className='p-3 overflow-auto' style={{ maxHeight: expanded === 1 ? '300px' : expanded === 2 ? 'none' : '500px' }}>
        <table>
          <tbody>
            {currentCountry && currentCountry.cCountry ? (
              <tr>
                <td className="min-w-auto bold text-black mb-2" style={{ paddingRight: '8px', paddingBottom: '10px' }}>
                  {currentCountry.cCountry && (currentCountry.cCountry.toLowerCase().includes('ocean') || currentCountry.cCountry.toLowerCase().includes('sea')) ? 'Location:' : 'Country:'}
                </td>
                <td style={{ fontStyle: 'italic', paddingBottom: '10px' }}>{currentCountry.cCountry}</td>
              </tr>
            ) : null}
            {currentCountry && currentCountry.cCapitalName ? (
              <tr>
                <td className="min-w-auto bold text-black mb-2" style={{ paddingRight: '8px', paddingBottom: '10px' }}>Capital:</td>
                <td style={{ fontStyle: 'italic', paddingBottom: '10px' }}>{currentCountry.cCapitalName} {' ('} {currentCountry.cCapitalCoordinates} {') '}</td>
              </tr>
            ) : null}
            {currentCountry && currentCountry.cTimeDifference ? (
              <tr>
                <td className="min-w-auto bold text-black mb-2" style={{ paddingRight: '8px', paddingBottom: '10px' }}>Timezone:</td>
                <td style={{ fontStyle: 'italic', paddingBottom: '10px' }}>{currentCountry.cTimeDifference}</td>
              </tr>
            ) : null}
            {expanded > 0 && (
              <>
                {currentCountry && currentCountry.cGovernmentType ? (
                  <tr>
                    <td className="min-w-auto bold text-black mb-2" style={{ paddingRight: '8px', paddingBottom: '10px' }}>Gov. Type:</td>
                    <td style={{ fontStyle: 'italic', paddingBottom: '10px' }}>{currentCountry.cGovernmentType}</td>
                  </tr>
                ) : null}
                {currentCountry && currentCountry.cEconomicOverview ? (
                  <tr>
                    <td className="min-w-auto bold text-black mb-2" style={{ paddingRight: '8px', paddingBottom: '10px' }}>Economy:</td>
                    <td style={{ fontStyle: 'italic', paddingBottom: '10px' }}>{currentCountry.cEconomicOverview}</td>
                  </tr>
                ) : null}
                {currentCountry && currentCountry.cGDP ? (
                  <tr>
                    <td className="min-w-auto bold text-black mb-2" style={{ paddingRight: '8px', paddingBottom: '10px' }}>GDP:</td>
                    <td style={{ fontStyle: 'italic', paddingBottom: '10px' }}>{currentCountry.cGDP}</td>
                  </tr>
                ) : null}
                {currentCountry && currentCountry.cRealGDPPerCapita ? (
                  <tr>
                    <td className="min-w-auto bold text-black mb-2" style={{ paddingRight: '8px', paddingBottom: '10px' }}>GDP per Capita:</td>
                    <td style={{ fontStyle: 'italic', paddingBottom: '10px' }}>{currentCountry.cRealGDPPerCapita}</td>
                  </tr>
                ) : null}
                {currentCountry && currentCountry.cPopulation ? (
                  <tr>
                    <td className="min-w-auto bold text-black mb-2" style={{ paddingRight: '8px', paddingBottom: '10px' }}>Population:</td>
                    <td style={{ fontStyle: 'italic', paddingBottom: '10px' }}>{currentCountry.cPopulation}</td>
                  </tr>
                ) : null}
                {currentCountry && currentCountry.cUrbanPopulation ? (
                  <tr>
                    <td className="min-w-auto bold text-black mb-2" style={{ paddingRight: '8px', paddingBottom: '10px' }}>Urban Population:</td>
                    <td style={{ fontStyle: 'italic', paddingBottom: '10px' }}>{currentCountry.cUrbanPopulation}</td>
                  </tr>
                ) : null}
                {currentCountry && currentCountry.cMajorUrbanPopulation ? (
                  <tr>
                    <td className="min-w-auto bold text-black mb-2" style={{ paddingRight: '8px', paddingBottom: '10px' }}>Major Urban Population:</td>
                    <td style={{ fontStyle: 'italic', paddingBottom: '10px' }}>{currentCountry.cMajorUrbanPopulation}</td>
                  </tr>
                ) : null}
                {currentCountry && currentCountry.cPopulationDistribution ? (
                  <tr>
                    <td className="min-w-auto bold text-black mb-2" style={{ paddingRight: '8px', paddingBottom: '10px' }}>Population Distribution:</td>
                    <td style={{ fontStyle: 'italic', paddingBottom: '10px' }}>{currentCountry.cPopulationDistribution}</td>
                  </tr>
                ) : null}
                {currentCountry && currentCountry.cClimate ? (
                  <tr>
                    <td className="min-w-auto bold text-black mb-2" style={{ paddingRight: '8px', paddingBottom: '10px' }}>Climate:</td>
                    <td style={{ fontStyle: 'italic', paddingBottom: '10px' }} > {currentCountry.cClimate}</td>
                  </tr>
                ) : null}
                {currentCountry && currentCountry.cNaturalHazards ? (
                  <tr>
                    <td className="min-w-auto bold text-black mb-2" style={{ paddingRight: '8px', paddingBottom: '10px' }}>Natural Hazards:</td>
                    <td style={{ fontStyle: 'italic', paddingBottom: '10px' }}>{currentCountry.cNaturalHazards}</td>
                  </tr>
                ) : null}
                {currentCountry && currentCountry.cEnvironmentalIssues ? (
                  <tr>
                    <td className="min-w-auto bold text-black mb-2" style={{ paddingRight: '8px', paddingBottom: '10px' }}>Environment (Issues):</td>
                    <td style={{ fontStyle: 'italic', paddingBottom: '10px' }}>{currentCountry.cEnvironmentalIssues}</td>
                  </tr>
                ) : null}
              </>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleExpansion}
          className="inline-flex items-center text-white bg-[#023f56] border-0 py-1 px-40 focus:outline-none hover:bg-indigo-600 rounded text-lg"
        >
          {expanded < 1 ? (
            <span onClick={() => setExpanded(1)}>
              Show More
            </span>
          ) : expanded < 2 ? (
            <span onClick={() => setExpanded(2)}>
              Extend Fully
            </span>
          ) : (
            <span onClick={() => setExpanded(0)}>
              Show Less
            </span>
          )}
        </button>
      </div>
    </div >
  );
};

export default NationComponent;
