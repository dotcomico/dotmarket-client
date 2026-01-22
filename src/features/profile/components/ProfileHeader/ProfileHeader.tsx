import './ProfileHeader.css';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'customer';
}

interface ProfileHeaderProps {
  user: User;
}

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'profile-header__badge--admin';
      case 'manager':
        return 'profile-header__badge--manager';
      default:
        return 'profile-header__badge--customer';
    }
  };

  const getRoleDisplay = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <div className="profile-header">
      <div className="profile-header__avatar">
        <div className="profile-header__avatar-circle">
          {user.username.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="profile-header__info">
        <h1 className="profile-header__name">{user.username}</h1>
        <p className="profile-header__email">{user.email}</p>
        <span className={`profile-header__badge ${getRoleBadgeClass(user.role)}`}>
          {getRoleDisplay(user.role)}
        </span>
      </div>
    </div>
  );
};