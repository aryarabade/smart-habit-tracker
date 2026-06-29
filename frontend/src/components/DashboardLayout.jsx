import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  return (
    <div class="dashboard-shell">
      <Sidebar />
      <main class="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}
