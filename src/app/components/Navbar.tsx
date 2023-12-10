import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => (
  <div className="absolute top-0 left-0 right-0 p-4 z-10 text-white bg-black">
    <Link href="/">Home</Link>
  </div>
);

export default Navbar;
