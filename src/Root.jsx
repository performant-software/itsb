import { Outlet } from 'react-router-dom';
import { Header } from './components';

export function Root() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
