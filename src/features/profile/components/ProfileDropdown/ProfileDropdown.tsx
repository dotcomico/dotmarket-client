import './ProfileDropdown.css';

interface User{
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'customer';
}
interface ProfileHeaderProps {
  user: User;
}
export const ProfileDropdown = ({user}:ProfileHeaderProps) => {


  return (
    <div className="profile-dropdown">
      <button className="profile-dropdown__trigger">
        <div className="profile-dropdown__avatar">
          {user.username.substring(0, 2).toUpperCase()}
        </div>
        <svg 
          className="profile-dropdown__icon"
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    </div>
  );
};