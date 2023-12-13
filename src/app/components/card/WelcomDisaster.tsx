import React, { useState, ReactNode } from 'react';

interface FeatureSectionProps {
  title: string;
  children: ReactNode;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false); // 초기 상태를 true로 설정

  return (
    <div className="mb-4 bg-white p-4 rounded-md shadow-md">
      <button 
        className="flex items-center font-semibold text-lg w-full text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={isOpen ? 'mr-2 transform rotate-90' : 'mr-2'}>▶</span>
        <span >{title}</span>
      </button>
      {isOpen && <div className="mt-2 text-gray-700 pl-8">{children}</div>}
    </div>
  );
};

const Welcome = () => {
  return (
    <div className="font-sans bg-gray-200 text-gray-800 p-5">
      <p className=" text-large text-center text-gray-700 mb-2 font-bold font-serif">🌐 Welcome to Worldisaster 🌐</p>
      <div className="mb-2 p-4">
        <p>Welcome to Worldisaster, a comprehensive platform dedicated to global disaster awareness and response. Our goal is to provide you with real-time updates, historical data, and interactive tools to understand and respond to various disasters around the globe. Join our community and make a difference today!</p>
      </div>
      <FeatureSection title="Explore the Disaster Archive">
        Delve into historical disasters using our interactive globe. Filter by year to discover disasters from specific periods.
      </FeatureSection>
      <FeatureSection title="Real-Time Disaster Tracking">
        Stay updated with current disasters. Effortlessly switch between the historical archive and live updates using our toggle feature.
      </FeatureSection>
      <FeatureSection title="Personalized Alerts for Users">
        As a registered user, customize alerts for specific areas. Set up real-time notifications with a simple right-click on your area of interest.
      </FeatureSection>
      <FeatureSection title="Interactive Disaster Points">
        Click on disaster markers for in-depth information about affected countries and details about the disasters. Access related articles and videos for a comprehensive understanding.
      </FeatureSection>
      <FeatureSection title="Community Engagement">
        Connect and share insights with our global chat feature, fostering a community of informed and active users.
      </FeatureSection>
      <FeatureSection title="Support and Donate">
        Contribute to disaster-stricken areas through our platform. Every act of support makes a difference.
      </FeatureSection>
    </div>
  );
};

export default Welcome;
