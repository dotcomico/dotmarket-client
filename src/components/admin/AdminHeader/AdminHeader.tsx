import { useAdminAccess } from '../../../features/admin/hooks/useAdminAccess';
import './AdminHeader.css';

interface AdminHeaderProps {
  title: string;
}

export const AdminHeader = ({ title }: AdminHeaderProps) => {
  const { user } = useAdminAccess();

  if (!user) return null;

  return (
    <div className="admin-header">
      <h1 className="admin-header__title">{title}</h1>

      <div className="admin-header__actions">
        {/* Notifications */}
        <button className="admin-header__notification">
          🔔
          <span className="admin-header__badge" />
        </button>

        {/* User profile */}
        <div className="admin-header__user">
          <div className="admin-header__avatar">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="admin-header__info">
            <div className="admin-header__username">{user.username}</div>
            <div className="admin-header__role">{user.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
};