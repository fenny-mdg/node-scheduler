import {Outlet} from '@remix-run/react';

export default function AppLayout() {
  return (
    <div>
      <div>App here</div>
      <Outlet />
    </div>
  );
}
