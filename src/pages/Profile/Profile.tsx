import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useEffect } from "react";
import { PATHS } from "../../routes/paths";
import { ProfileHeader } from "../../features/profile/components/ProfileHeader/ProfileHeader";
import { ProfileSettings } from "../../features/profile/components/ProfileSettings/ProfileSettings";
import { AccountActions } from "../../features/profile/components/AccountActions/AccountActions";
import "./Profile.css";


const Profile = () => {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  // Redirect to login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(PATHS.LOGIN);
    }
  }, [isAuthenticated, navigate]);

  // Don't render while checking auth
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <ProfileHeader user={user} />
        <ProfileSettings user={user} />
        <AccountActions />
      </div>
    </div>
  );
};

export default Profile;