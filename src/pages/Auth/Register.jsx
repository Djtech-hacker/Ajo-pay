// =============================================
// REGISTER PAGE
// TODO: Wire up to POST /api/auth/register
// New members require admin approval before activation.
// =============================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { nigerianBanks } from '../../data/mockData';
import './Auth.css';

const initialForm = {
  firstName: '', lastName: '', email: '', phone: '',
  password: '', confirmPassword: '',
  bank: '', accountNumber: '', accountName: '',
  referredBy: '',
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(1); // 1 = personal, 2 = bank, 3 = done
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const validateStep1 = () => {
    if (!form.firstName || !form.lastName || !form.email || !form.phone)
      return 'Please fill in all personal details.';
    if (!form.password || form.password.length < 6)
      return 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword)
      return 'Passwords do not match.';
    return '';
  };

  const validateStep2 = () => {
    if (!form.bank || !form.accountNumber || !form.accountName)
      return 'Please fill in your bank details.';
    if (form.accountNumber.length !== 10)
      return 'Account number must be 10 digits.';
    return '';
  };

  const handleNextStep = () => {
    const err = step === 1 ? validateStep1() : validateStep2();
    if (err) { setError(err); return; }
    setError('');
    setStep(prev => prev + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Replace with real API call → POST /api/auth/register
    setTimeout(() => {
      setLoading(false);
      setStep(3); // success state
    }, 1000);
  };

  if (step === 3) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ width: 64, height: 64, background: 'var(--success-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28, color: 'var(--success)' }}>✓</div>
            <h1 className="auth-title">Application submitted!</h1>
            <p className="auth-subtitle" style={{ marginTop: 10 }}>
              Your registration is pending admin approval. You'll receive an email once approved.
            </p>
          </div>
          <Link to="/login" className="auth-btn" style={{ display: 'block', lineHeight: '44px', textDecoration: 'none', textAlign: 'center' }}>
            Back to Login
          </Link>
        </div>
        <div className="auth-panel" aria-hidden="true">
          <div className="auth-panel__content">
            <div className="auth-panel__quote">Welcome to the circle. Together we grow.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand__icon">
            <svg viewBox="0 0 20 20" fill="none" width="22" height="22">
              <circle cx="10" cy="10" r="9" stroke="#c8f54a" strokeWidth="1.5"/>
              <circle cx="10" cy="10" r="1.5" fill="#c8f54a"/>
            </svg>
          </div>
          <span className="auth-brand__name">Ajo Manager</span>
        </div>

        <h1 className="auth-title">Request access</h1>
        <p className="auth-subtitle">Step {step} of 2 — {step === 1 ? 'Personal details' : 'Bank information'}</p>

        {/* Step indicator */}
        <div className="auth-steps">
          <div className={`auth-step ${step >= 1 ? 'auth-step--done' : ''} ${step === 1 ? 'auth-step--active' : ''}`}>1</div>
          <div className="auth-step-line" />
          <div className={`auth-step ${step >= 2 ? 'auth-step--done' : ''} ${step === 2 ? 'auth-step--active' : ''}`}>2</div>
        </div>

        {error && <div className="auth-error" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <>
              <div className="auth-field auth-field--row">
                <div className="auth-field">
                  <label>First Name</label>
                  <input name="firstName" placeholder="Adaeze" value={form.firstName} onChange={handleChange} />
                </div>
                <div className="auth-field">
                  <label>Last Name</label>
                  <input name="lastName" placeholder="Kalu" value={form.lastName} onChange={handleChange} />
                </div>
              </div>
              <div className="auth-field">
                <label>Email</label>
                <input name="email" type="email" placeholder="adaeze@email.com" value={form.email} onChange={handleChange} />
              </div>
              <div className="auth-field">
                <label>Phone Number</label>
                <input name="phone" type="tel" placeholder="+234 803 456 7890" value={form.phone} onChange={handleChange} />
              </div>
              <div className="auth-field">
                <label>Password</label>
                <input name="password" type="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} />
              </div>
              <div className="auth-field">
                <label>Confirm Password</label>
                <input name="confirmPassword" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} />
              </div>
              <div className="auth-field">
                <label>Referred By (optional)</label>
                <input name="referredBy" placeholder="Name of existing member" value={form.referredBy} onChange={handleChange} />
              </div>
              <button type="button" className="auth-btn" onClick={handleNextStep}>Continue →</button>
            </>
          )}

          {/* Step 2: Bank Info */}
          {step === 2 && (
            <>
              <div className="auth-field">
                <label>Bank</label>
                <select name="bank" value={form.bank} onChange={handleChange}>
                  <option value="">Select your bank</option>
                  {nigerianBanks.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="auth-field">
                <label>Account Number</label>
                <input name="accountNumber" placeholder="10-digit NUBAN" maxLength={10} value={form.accountNumber} onChange={handleChange} />
              </div>
              <div className="auth-field">
                <label>Account Name</label>
                <input name="accountName" placeholder="As it appears on bank record" value={form.accountName} onChange={handleChange} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="button" className="auth-btn" style={{ background: 'var(--surface)', color: 'var(--ink)', border: '0.5px solid var(--border)' }} onClick={() => setStep(1)}>← Back</button>
                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? 'Submitting…' : 'Submit Application'}
                </button>
              </div>
            </>
          )}
        </form>

        <p className="auth-footer">
          Already a member? <Link to="/login">Sign in</Link>
        </p>
      </div>

      <div className="auth-panel" aria-hidden="true">
        <div className="auth-panel__content">
          <div className="auth-panel__stat">
            <div className="auth-panel__stat-val">₦1M</div>
            <div className="auth-panel__stat-label">Payout per Cycle</div>
          </div>
          <div className="auth-panel__stat">
            <div className="auth-panel__stat-val">₦50K</div>
            <div className="auth-panel__stat-label">Weekly Contribution</div>
          </div>
          <div className="auth-panel__quote">
            "The Ajo tradition — modern, transparent, and trustworthy."
          </div>
        </div>
      </div>
    </div>
  );
}
