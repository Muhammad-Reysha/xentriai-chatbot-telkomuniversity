"use client"

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const passwordStrength = (() => {
    if (!password) return { score: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { score, label: 'Lemah', color: 'bg-red-500' };
    if (score <= 3) return { score, label: 'Sedang', color: 'bg-yellow-500' };
    return { score, label: 'Kuat', color: 'bg-primary-teal' };
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !email.trim() || !password) {
      setError('Semua kolom wajib diisi');
      return;
    }
    if (password.length < 8) {
      setError('Password minimal 8 karakter');
      return;
    }
    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Format email tidak valid');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registrasi gagal');

      navigate('/login?registered=1');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-bg-deep text-text-bright font-sans p-4 overflow-auto">
      <div className="w-full max-w-md py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-teal/10 border border-primary-teal/30 mb-4">
            <svg className="w-8 h-8 text-primary-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Buat Akun</h1>
          <p className="text-text-dim mt-2">Daftar untuk memulai</p>
        </div>

        <div className="bg-bg-deep/60 backdrop-blur border border-white/10 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-dim mb-2">Username</label>
              <input
                type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading} autoComplete="username"
                className="w-full px-4 py-3 bg-bg-deep border border-white/10 rounded-xl text-text-bright placeholder-text-dim/50 focus:outline-none focus:border-primary-teal/60 focus:ring-2 focus:ring-primary-teal/20 transition disabled:opacity-50"
                placeholder="username_anda"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dim mb-2">Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading} autoComplete="email"
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
                  autoComplete="new-password"
                  className="w-full px-4 py-3 pr-12 bg-bg-deep border border-white/10 rounded-xl text-text-bright placeholder-text-dim/50 focus:outline-none focus:border-primary-teal/60 focus:ring-2 focus:ring-primary-teal/20 transition disabled:opacity-50"
                  placeholder="Minimal 8 karakter"
                />
                <button type="button" onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-bright transition" tabIndex={-1}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>

              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i}
                        className={`h-1 flex-1 rounded-full transition ${
                          i <= passwordStrength.score ? passwordStrength.color : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-text-dim">Kekuatan: {passwordStrength.label}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dim mb-2">Konfirmasi Password</label>
              <input
                type={showPassword ? 'text' : 'password'} value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading}
                autoComplete="new-password"
                className="w-full px-4 py-3 bg-bg-deep border border-white/10 rounded-xl text-text-bright placeholder-text-dim/50 focus:outline-none focus:border-primary-teal/60 focus:ring-2 focus:ring-primary-teal/20 transition disabled:opacity-50"
                placeholder="Ulangi password"
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-300 mt-1">Password tidak cocok</p>
              )}
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
                  Mendaftar...
                </span>
              ) : ('Daftar')}
            </button>
          </form>
        </div>

        <p className="text-center text-text-dim mt-6">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-primary-teal hover:underline font-medium">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}