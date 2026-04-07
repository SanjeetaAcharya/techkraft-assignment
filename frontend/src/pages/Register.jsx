import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL;

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.name.trim()) return 'Name is required';
    if (!form.email.includes('@')) return 'Please enter a valid email address';
    if (form.password.length < 8) return 'Password must be at least 8 characters';
    if (!/[a-zA-Z]/.test(form.password) || !/[0-9]/.test(form.password))
      return 'Password must contain at least one letter and one number';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const validationError = validate();
    if (validationError) return setError(validationError);
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/register`, form);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      {/* Logo — identical to Login */}
      <div style={s.logoRow}>
        <div style={s.logoDot}>
          <svg viewBox="0 0 24 24" style={{ width: '16px', height: '16px', fill: 'white' }}>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </div>
        <span style={s.logoText}>Buyer<span style={{ color: '#2dd4bf' }}>Portal</span></span>
      </div>

      {/* Centered card — same pattern as Login */}
      <div style={s.center}>
        <div style={s.card}>
          <h2 style={s.title}>Create your account</h2>
          <p style={s.sub}>Start finding your perfect property today</p>

          {error && <div style={s.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={s.field}>
              <label style={s.label}>FULL NAME</label>
              <div style={s.inputWrap}>
                <svg viewBox="0 0 24 24" style={s.inputIcon}>
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
                <input
                  name="name" type="text" placeholder="Sanjeeta Acharya"
                  value={form.name} onChange={handleChange}
                  required style={s.input}
                />
              </div>
            </div>

            <div style={s.field}>
              <label style={s.label}>EMAIL ADDRESS</label>
              <div style={s.inputWrap}>
                <svg viewBox="0 0 24 24" style={s.inputIcon}>
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <input
                  name="email" type="email" placeholder="you@email.com"
                  value={form.email} onChange={handleChange}
                  required style={s.input}
                />
              </div>
            </div>

            <div style={s.field}>
              <label style={s.label}>PASSWORD</label>
              <div style={s.inputWrap}>
                <svg viewBox="0 0 24 24" style={s.inputIcon}>
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
                <input
                  name="password" type="password"
                  placeholder="Min. 8 characters, include a number"
                  value={form.password} onChange={handleChange}
                  required style={s.input}
                />
              </div>
            </div>

            <button type="submit" style={s.btn} disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p style={s.linkText}>
            Already have an account?{' '}
            <Link to="/login" style={s.link}>Sign in</Link>
          </p>
        </div>

        <p style={s.tagline}>Trusted by buyers across Kathmandu Valley</p>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh', background: '#0f172a',
    display: 'flex', flexDirection: 'column', padding: '24px 32px',
  },
  logoRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoDot: {
    width: '34px', height: '34px', background: '#0f766e', borderRadius: '9px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  logoText: { fontSize: '18px', fontWeight: '800', color: 'white', letterSpacing: '-0.5px' },
  center: {
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', padding: '32px 16px',
  },
  card: {
    background: '#1e293b', border: '1px solid #334155',
    borderRadius: '20px', padding: '40px 36px', width: '100%', maxWidth: '420px',
  },
  title: { fontSize: '24px', fontWeight: '700', color: 'white', marginBottom: '6px' },
  sub: { fontSize: '13px', color: '#64748b', marginBottom: '28px' },
  errorBox: {
    background: '#450a0a', border: '1px solid #7f1d1d', color: '#fca5a5',
    borderRadius: '8px', padding: '10px 14px', fontSize: '13px', marginBottom: '20px',
  },
  field: { marginBottom: '18px' },
  label: {
    display: 'block', fontSize: '11px', fontWeight: '700',
    color: '#475569', letterSpacing: '0.07em', marginBottom: '7px',
  },
  inputWrap: { position: 'relative' },
  inputIcon: {
    position: 'absolute', left: '13px', top: '50%',
    transform: 'translateY(-50%)', width: '15px', height: '15px', fill: '#475569',
  },
  input: {
    width: '100%', padding: '12px 14px 12px 40px', background: '#0f172a',
    border: '1.5px solid #334155', borderRadius: '10px',
    fontSize: '14px', color: 'white', outline: 'none', boxSizing: 'border-box',
  },
  btn: {
    width: '100%', padding: '13px', background: '#0f766e', color: 'white',
    border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700',
    cursor: 'pointer', marginTop: '8px',
  },
  linkText: { textAlign: 'center', fontSize: '13px', color: '#475569', marginTop: '20px' },
  link: { color: '#2dd4bf', fontWeight: '700', textDecoration: 'none' },
  tagline: { marginTop: '24px', fontSize: '13px', color: '#334155', textAlign: 'center' },
};