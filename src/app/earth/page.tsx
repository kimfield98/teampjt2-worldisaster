"use client";
import React from 'react';
import dynamic from 'next/dynamic';

const LoadingComponent = () => (
  <div className="flex justify-center items-center h-screen bg-black">
    <p>Loading...</p>
  </div>
);

const DynamicEarthCanvas = dynamic(
  () => import('../components/EarthCesium'),
  { loading: () => <LoadingComponent /> }
);

///////////// Earth /////////////
export default function Earth() {
  return (
    <div>
      <DynamicEarthCanvas/>
    </div>
  )
}