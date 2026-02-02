import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../../../components/admin/AdminSidebar/AdminSidebar';
import './AdminLayout.css';


export const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-layout__content">
        <div className="admin-layout__main">
          {/* Outlet renders child routes */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};