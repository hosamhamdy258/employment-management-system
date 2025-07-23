import React from 'react';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <main className="container-fluid py-4">
      <Outlet />
    </main>
  );
}
