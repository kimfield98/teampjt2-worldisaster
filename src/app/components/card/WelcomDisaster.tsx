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
      <p className=" text-large text-center text-gray-700 mb-2 font-bold font-serif">🌐 Welcome to Worldisaster! 🌐</p>
      <div className="mb-2 p-4" style={{ fontSize: '0.9rem' }}>
        <p>Our mission at WorlDisaster is to elevate global awareness and readiness in the face of catastrophes that may affect us and the ones we love.</p>
        <br />
        <p>We strive to provide you with up-to-the-minute alerts, comprehensive updates, and a wealth of historical data, complemented by interactive resources designed to deepen your understanding. </p>
        <br />
        <p>Join us today, and step into a collective effort to forge a proactive stance against the unpredictable —making a tangible impact, together.</p>
      </div>
      <FeatureSection title="Explore Ongoing & Historical Disasters">
        Delve into historical disasters and track current events in real-time with our interactive globe.
        Toggle between different periods and stay updated with live updates.
        Click the top-right button of this screen for more details.
      </FeatureSection>
      <FeatureSection title="In-Depth Disaster Insights">
        Click on disaster markers to access detailed information,
        including affected countries, related articles, and videos for a holistic understanding.
      </FeatureSection>
      <FeatureSection title="Set Custom Alerts and Track Updates">
        Customize alerts for specific regions and set up real-time notifications.
        Monitor disaster developments with a simple right-click on areas of interest on the globe.
      </FeatureSection>
      <FeatureSection title="Community and Support">
        Engage with a global community through our chat feature
        and contribute to relief efforts directly through the platform.
      </FeatureSection>
    </div>
  );
};

export default Welcome;
