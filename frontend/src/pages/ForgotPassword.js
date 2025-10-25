import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import localLogo from '../assets/logo.svg';
const LOGO_URL = 'https://iili.io/KrEPWoF.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgotpassword', { email });
      setMessage(res.data.msg + ' Token: ' + res.data.token); // Since no email
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#0b0b0b',
        color: '#e5e7eb',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid #333'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src={LOGO_URL} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = localLogo; }} alt="Fight Wisdom logo" style={{ width: '96px', height: '96px', objectFit: 'contain', display: 'block', margin: '0 auto 20px', background: '#0b0b0b', padding: '8px', borderRadius: '12px' }} />
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '8px'
          }}>Forgot Password?</h2>
          <p style={{ color: '#cbd5e1', fontSize: '16px' }}>Enter your email to reset your password</p>
        </div>

        {message && (
          <div style={{
            padding: '12px 16px',
            background: message.includes('Token') ? '#022c22' : '#3f1d1d',
            color: message.includes('Token') ? '#a7f3d0' : '#fecaca',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#ffffff',
              marginBottom: '8px'
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '8px',
                border: '1px solid #333',
                background: '#111',
                color: '#e5e7eb',
                fontSize: '16px',
                transition: 'all 0.2s ease'
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '16px'
            }}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px' }}>
            <span style={{ color: '#cbd5e1' }}>
              Remember your password? <Link to="/login" style={{ color: '#fff', fontWeight: '600', textDecoration: 'none' }}>Sign in</Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;