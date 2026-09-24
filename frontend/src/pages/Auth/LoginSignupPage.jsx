import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/Card';
import { Trophy, ArrowRight, UserCheck } from 'lucide-react';

export default function LoginSignupPage() {
  const navigate = useNavigate();
  const { login, signup } = useContext(AuthContext);

  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        // Signup Flow
        await signup(name, email, password);
        // Redirect new signup to Profile first!
        navigate('/profile');
      } else {
        // Login Flow
        await login(email, password);
        // Redirect existing login to Dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-accent text-white font-bold flex items-center justify-center text-xl mx-auto shadow-md">
            AP
          </div>
          <h1 className="text-2xl font-bold text-brand-charcoal">Athlete Performance Tracker</h1>
          <p className="text-xs text-brand-muted">Performance Engine for Athletes</p>
        </div>

        <Card className="shadow-lg">
          <div className="flex border-b border-brand-border mb-6">
            <button
              onClick={() => setIsSignup(false)}
              className={`flex-1 py-2.5 text-xs font-bold transition-all ${
                !isSignup ? 'border-b-2 border-brand-accent text-brand-accent' : 'text-brand-muted hover:text-brand-charcoal'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignup(true)}
              className={`flex-1 py-2.5 text-xs font-bold transition-all ${
                isSignup ? 'border-b-2 border-brand-accent text-brand-accent' : 'text-brand-muted hover:text-brand-charcoal'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-xs font-semibold mb-4 border border-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label className="text-xs font-semibold text-brand-charcoal block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Athlete Name"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-xs text-brand-charcoal focus:outline-none focus:border-brand-accent"
                  required
                />
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-brand-charcoal block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="athlete@domain.com"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-xs text-brand-charcoal focus:outline-none focus:border-brand-accent"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-brand-charcoal block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-xs text-brand-charcoal focus:outline-none focus:border-brand-accent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md disabled:opacity-50 mt-2"
            >
              {loading ? 'Processing...' : isSignup ? 'Create Athlete Account' : 'Sign In to Dashboard'}
              <ArrowRight size={14} />
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
