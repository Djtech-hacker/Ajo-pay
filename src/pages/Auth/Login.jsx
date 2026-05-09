import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';
import './AuthSteps.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      const res = await login(form.email, form.password);
      if (res.success) navigate('/dashboard');
    } catch { setError('Invalid credentials. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand__icon">
            <svg viewBox="0 0 20 20" fill="none" width="20" height="20">
              <circle cx="10" cy="10" r="8" stroke="#b5f23d" strokeWidth="1.5"/>
              <path d="M6.5 10c0-1.93 1.57-3.5 3.5-3.5" stroke="#b5f23d" strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx="10" cy="10" r="1.5" fill="#b5f23d"/>
            </svg>
          </div>
          <span className="auth-brand__name">Ajo Manager</span>
        </div>

        <p className="auth-eyebrow">Savings Circle OS</p>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to manage your savings circle and track contributions.</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="email">Email address</label>
            <input id="email" name="email" type="email"
              placeholder="adaeze@email.com"
              value={form.email} onChange={handleChange}
              autoComplete="email" required />
          </div>
          <div className="auth-field">
            <label htmlFor="password">
              Password
              <a href="#" className="auth-field__link">Forgot password?</a>
            </label>
            <input id="password" name="password" type="password"
              placeholder="••••••••"
              value={form.password} onChange={handleChange}
              autoComplete="current-password" required />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in →'}
          </button>
        </form>

        <p className="auth-footer">
          No account? <Link to="/register">Request access</Link>
        </p>
        <div className="auth-demo">
          <strong>Demo:</strong> any email + password works
        </div>
      </div>

      <div className="auth-panel" aria-hidden="true">
        <div className="auth-panel__bg-grid" />
        <div className="auth-panel__content">
          <div>
            <div className="auth-panel__stat-val">₦2.84M</div>
            <div className="auth-panel__stat-label">Total Contributed</div>
          </div>
          <div>
            <div className="auth-panel__stat-val">20</div>
            <div className="auth-panel__stat-label">Active Members</div>
          </div>
          <div>
            <div className="auth-panel__stat-val">Cycle 3</div>
            <div className="auth-panel__stat-label">Current Rotation</div>
          </div>
          <div className="auth-panel__quote">
            "Community savings that build individual wealth — the Ajo way."
          </div>
        </div>
      </div>
    </div>
  );
}