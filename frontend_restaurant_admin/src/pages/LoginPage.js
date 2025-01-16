// LoginPage.js
import React from 'react';
import LoginForm from '../components/LoginForm';
import '../styles/LoginPage.css';

const LoginPage = ({ onLoginSuccess }) => {
  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Welcome Back</h1>
        <LoginForm onLoginSuccess={onLoginSuccess} />
      </div>
    </div>
  );
};

export default LoginPage;