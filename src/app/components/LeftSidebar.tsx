"use client"

import React, { useState } from 'react';

const LeftSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div style={{ width: '500px' }} className={`bg-white h-screen transition-transform duration-300 ${isOpen ? 'block' : 'hidden'}`}>
      <button onClick={() => setIsOpen(false)}>X</button>
      LeftSidebar Content
    </div>
  );
};

export default LeftSidebar;
