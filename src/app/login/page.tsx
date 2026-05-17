"use client"
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password) {
      setError('Username/email dan password wajib diisi');
      return;
    }

    setIsLoading(true);
    try {
      const isEmail = identifier.includes('@');
      const body = isEmail
        ? { email: identifier.trim(), password }
        : { username: identifier.trim(), password };

      const res = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login gagal');

      login(data.token, data.user);
      navigate('/user');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-bg-deep text-text-bright font-sans p-4 overflow-auto">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-teal/10 border border-primary-teal/30 mb-4">
            <svg className="w-8 h-8 text-primary-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Selamat Datang</h1>
          <p className="text-text-dim mt-2">Masuk ke akun Anda</p>
        </div>

        <div className="bg-bg-deep/60 backdrop-blur border border-white/10 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-dim mb-2">Username atau Email</label>
              <input
                type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)}
                disabled={isLoading} autoComplete="username"
                className="w-full px-4 py-3 bg-bg-deep border border-white/10 rounded-xl text-text-bright placeholder-text-dim/50 focus:outline-none focus:border-primary-teal/60 focus:ring-2 focus:ring-primary-teal/20 transition disabled:opacity-50"
                placeholder="user@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dim mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)} disabled={isLoading}
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-12 bg-bg-deep border border-white/10 rounded-xl text-text-bright placeholder-text-dim/50 focus:outline-none focus:border-primary-teal/60 focus:ring-2 focus:ring-primary-teal/20 transition disabled:opacity-50"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-bright transition" tabIndex={-1}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-300">
                {error}
              </div>
            )}

            <button type="submit" disabled={isLoading}
              className="w-full py-3 bg-primary-teal hover:bg-primary-teal/90 disabled:opacity-50 disabled:cursor-not-allowed text-bg-deep font-semibold rounded-xl transition flex items-center justify-center">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Masuk...
                </span>
              ) : ('Masuk')}
            </button>
          </form>
        </div>

        <p className="text-center text-text-dim mt-6">
          Belum punya akun?{' '}
          <Link to="/register" className="text-primary-teal hover:underline font-medium">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}