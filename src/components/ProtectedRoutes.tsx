import { useEffect, useState, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { fetchMe } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireRole?: 'ADMIN' | 'USER' | 'SUPERADMIN'; // optional role requirement
}

export function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
  const [status, setStatus] = useState<'loading' | 'allowed' | 'unauthorized' | 'wrong-role'>('loading');

  useEffect(() => {
    let cancelled = false;
    (async () => {
    const user = await fetchMe();
    console.log('[ProtectedRoute] fetchMe result:', user);
    console.log('[ProtectedRoute] requireRole:', requireRole);
    console.log('[ProtectedRoute] user.role:', user?.role);

    if (cancelled) return;

    if (!user) {
        console.log('[ProtectedRoute] → unauthorized');
        setStatus('unauthorized');
        return;
    }

    if (requireRole && user.role !== requireRole) {
        console.log('[ProtectedRoute] → wrong-role');
        setStatus('wrong-role');
        return;
    }

    console.log('[ProtectedRoute] → allowed');
    setStatus('allowed');
    })();

    return () => {
      cancelled = true;
    };
  }, [requireRole]);

  if (status === 'loading') {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-bg-deep text-text-dim">
        <div className="flex items-center gap-3">
          <svg className="animate-spin w-5 h-5 text-primary-teal" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          Memverifikasi akses...
        </div>
      </div>
    );
  }

  if (status === 'unauthorized') {
    return <Navigate to="/login" replace />;
  }

  if (status === 'wrong-role') {
    // Non-admin trying to access admin → send to user page
    return <Navigate to="/user" replace />;
  }

  return <>{children}</>;
}