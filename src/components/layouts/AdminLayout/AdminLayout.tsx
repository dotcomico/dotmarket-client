import { Outlet } from 'react-router-dom';
import { AdminHeader } from '../../../components/admin/AdminHeader/AdminHeader';
import { AdminSidebar } from '../../../components/admin/AdminSidebar/AdminSidebar';
import './AdminLayout.css';

/**
 * Admin Layout Component
 * Provides consistent layout structure for all admin pages
 * Features:
 * - Fixed sidebar navigation
 * - Sticky header with page title
 * - Main content area with proper spacing
 * - Responsive design
 */
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