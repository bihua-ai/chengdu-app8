import React from 'react';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="h-screen overflow-hidden">
      <div className="h-full">
        <Outlet />
      </div>
    </div>
  );
}