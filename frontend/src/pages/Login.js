import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import api from '../Services/api';
import ErrorMessage from '../components/ErrorMessage';
import localLogo from '../assets/logo.svg';
const LOGO_URL = 'https://iili.io/KrEPWoF.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const history = useHistory();
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      const res = await api.post('/auth/login', { email, password });
      if (isMounted.current) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        history.push('/');
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err?.response?.data?.msg || 'Login failed');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
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
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src={LOGO_URL} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = localLogo; }} alt="Fight Wisdom logo" style={{ width: '120px', height: '120px', objectFit: 'contain', display: 'block', margin: '0 auto 20px', background: '#0b0b0b', padding: '8px', borderRadius: '12px' }} />
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '8px'
          }}>Welcome back</h2>
          <p style={{ color: '#64748b', fontSize: '16px' }}>Sign in to your Fight Wisdom account</p>
        </div>
        
        {error && <ErrorMessage msg={error} />}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="Enter your email" 
              className="form-input"
              required 
              style={{ fontSize: '16px', padding: '14px 16px' }}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Enter your password" 
              className="form-input"
              required 
              style={{ fontSize: '16px', padding: '14px 16px' }}
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#64748b' }}>
              <input type="checkbox" style={{ marginRight: '8px' }} />
              Remember me
            </label>
            <Link to="/forgotpassword" style={{ color: '#667eea', fontSize: '14px', textDecoration: 'none' }}>
              Forgot password?
            </Link>
          </div>
          
          <button type="submit" disabled={loading} className="btn-primary" style={{ fontSize: '16px', padding: '16px', background: '#000', color: '#fff' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px' }}>
            <span style={{ color: '#64748b' }}>
              Don't have an account? <Link to="/register" style={{ color: '#667eea', fontWeight: '600', textDecoration: 'none' }}>Sign up</Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;