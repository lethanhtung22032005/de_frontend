import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <header className="app-header">
        <span className="brand">OfficeMart Admin</span>
      </header>
      <Outlet />
    </>
  );
}
