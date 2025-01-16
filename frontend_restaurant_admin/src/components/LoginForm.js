// LoginForm.js
import React, { useState } from 'react';
import { login } from '../api';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'; // Import icons
import '../styles/LoginForm.css';

const LoginForm = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await login(username, password);
      if (response.success) {
        onLoginSuccess(response.restaurantName);
      } else {
        setError('Invalid username or password');
      }
    } catch {
      setError('Invalid username or password');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
        <label className="form-label">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="form-input"
        />
      </div>
      <div className="form-group">
  <label className="form-label">Password</label>
  <div className="password-container" style={{ position: 'relative' }}>
    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="form-input-1"
      style={{ padding: '12px 40px 10px 10px', fontSize: '1rem' }}
    />
    <span
      className="password-toggle"
      onClick={() => setShowPassword(!showPassword)}
      style={{
        position: 'absolute',
        right: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        cursor: 'pointer',
        fontSize: '1.2rem'
      }}
    >
      {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
    </span>
  </div>
</div>


      {error && <div className="error-message">{error}</div>}
      <button type="submit" className="login-button">Login</button>
    </form>
  );
};

export default LoginForm;
