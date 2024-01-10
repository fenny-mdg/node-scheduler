import {Link, Outlet} from '@remix-run/react';

export default function TasksLayout() {
  return (
    <div>
      <div>Tasks </div>

      <Link to="./new">Create new</Link>
      <Outlet />
    </div>
  );
}
