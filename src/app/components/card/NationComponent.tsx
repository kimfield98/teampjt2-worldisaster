import React, { useState, useEffect } from 'react';
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
  const [showMore, setShowMore] = useState(false);

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
  if (!currentCountry) return <div>No country data found.</div>;

  return (
    <div className={`card ${isDarkMode ? 'darkMode' : ''}`}>
      <div className='cardTitle'>
        Country Information
      </div>
      <div className='cardContentBox'>
        <table>
          <tbody>
            <tr>
              <td className="min-w-auto bold text-black mb-2">Country:</td>
              <td>{currentCountry.cCountry}</td>
            </tr>
            <tr>
              <td className="min-w-auto bold text-black mb-2">Capital:</td>
              <td>{currentCountry.cCapitalName}</td>
            </tr>
            <tr>
              <td className="min-w-auto bold text-black mb-2">Population:</td>
              <td>{currentCountry.cPopulation}</td>
            </tr>
            {showMore && (
              <>
                <tr>
                  <td className="min-w-auto bold text-black mb-2">Geographic Coordinates:</td>
                  <td>{currentCountry.cGeoCoordinates}</td>
                </tr>
                <tr>
                  <td className="min-w-auto bold text-black mb-2">Climate:</td>
                  <td>{currentCountry.cClimate}</td>
                </tr>
                <tr>
                  <td className="min-w-auto bold text-black mb-2">Natural Hazards:</td>
                  <td>{currentCountry.cNaturalHazards}</td>
                </tr>
                <tr>
                  <td className="min-w-auto bold text-black mb-2">Government Type:</td>
                  <td>{currentCountry.cGovernmentType}</td>
                </tr>
                <tr>
                  <td className="min-w-auto bold text-black mb-2">Economic Overview:</td>
                  <td>{currentCountry.cEconomicOverview}</td>
                </tr>
                <tr>
                  <td className="min-w-auto bold text-black mb-2">GDP:</td>
                  <td>{currentCountry.cGDP}</td>
                </tr>
                <tr>
                  <td className="min-w-auto bold text-black mb-2">GDP per Capita:</td>
                  <td>{currentCountry.cRealGDPPerCapita}</td>
                </tr>
                <tr>
                  <td className="min-w-auto bold text-black mb-2">Environmental Issues:</td>
                  <td>{currentCountry.cEnvironmentalIssues}</td>
                </tr>
                <tr>
                  <td className="min-w-auto bold text-black mb-2">Population Distribution:</td>
                  <td>{currentCountry.cPopulationDistribution}</td>
                </tr>
                <tr>
                  <td className="min-w-auto bold text-black mb-2">Urban Population:</td>
                  <td>{currentCountry.cUrbanPopulation}</td>
                </tr>
                <tr>
                  <td className="min-w-auto bold text-black mb-2">Urbanization Rate:</td>
                  <td>{currentCountry.cUrbanRate}</td>
                </tr>
                <tr>
                  <td className="min-w-auto bold text-black mb-2">Major Urban Population:</td>
                  <td>{currentCountry.cMajorUrbanPopulation}</td>
                </tr>
                <tr>
                  <td className="min-w-auto bold text-black mb-2">Official Country Name:</td>
                  <td>{currentCountry.cCountryOfficialName}</td>
                </tr>
                <tr>
                  <td className="min-w-auto bold text-black mb-2">Capital Coordinates:</td>
                  <td>{currentCountry.cCapitalCoordinates}</td>
                </tr>
                <tr>
                  <td className="min-w-auto bold text-black mb-2">Time Difference:</td>
                  <td>{currentCountry.cTimeDifference}</td>
                </tr>
                <tr>
                  <td className="min-w-auto bold text-black mb-2">Location:</td>
                  <td>{currentCountry.cLocation}</td>
                </tr>
                <tr>
                  <td className="min-w-auto bold text-black mb-2">Continent:</td>
                  <td>{currentCountry.cContinent}</td>
                </tr>
                <tr>
                  <td className="min-w-auto bold text-black mb-2">Country Code:</td>
                  <td>{currentCountry.cCode}</td>
                </tr>
                <tr>
                  <td className="min-w-auto bold text-black mb-2">Country Name (Romanized):</td>
                  <td>{currentCountry.cCountry_rw}</td>
                </tr>
                <tr>
                  <td className="min-w-auto bold text-black mb-2">Other Country Names:</td>
                  <td>{currentCountry.cCountry_other}</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
        <button onClick={() => setShowMore(!showMore)} className="moreButton">
          {showMore ? 'Show Less' : 'Show More'}
        </button>
      </div>
    </div>
  );
};

export default NationComponent;
