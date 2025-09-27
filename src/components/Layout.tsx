import React from 'react';
import NavBar from './NavBar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
};

export default Layout;