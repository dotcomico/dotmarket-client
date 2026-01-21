import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PATHS } from '../../../routes/paths';
import { UI_STRINGS } from '../../../constants/uiStrings';
import './LoginForm.css';

export const LoginForm = () => {
  const { login, isLoading, error } = useAuth();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page reload
    
    // Call login function from our hook
    await login({ email, password });
  };

  return (
    <div className="login-form-container">
      <div className="login-form-card">
        <h1>{UI_STRINGS.AUTH.LOGIN}</h1>
        <p className="login-subtitle">{UI_STRINGS.AUTH.WELCOME_BACK}</p>
        
        {/* Error Message */}
        {error && (
          <div className="error-message" role="alert">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              autoComplete="email"
              disabled={isLoading}
            />
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <Link to="/forgot-password" className="forgot-password">
            {UI_STRINGS.AUTH.FORGOT_PASSWORD}
          </Link>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : UI_STRINGS.AUTH.LOGIN}
          </button>
        </form>

        {/* Register Link */}
        <p className="register-prompt">
          Don't have an account?{' '}
          <Link to={PATHS.REGISTER}>
            {UI_STRINGS.AUTH.SIGNUP}
          </Link>
        </p>
      </div>
    </div>
  );
};