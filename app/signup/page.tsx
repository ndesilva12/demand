'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await signUp(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold gradient-text">demand</Link>
          <h1 className="text-xl font-bold text-white mt-6">Create your account</h1>
          <p className="text-[#a0a0a0] text-sm mt-2">Join the movement</p>
        </div>

        {error && (
          <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#ef4444] rounded-lg p-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#a0a0a0] mb-1.5 uppercase tracking-wider">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#a0a0a0] mb-1.5 uppercase tracking-wider">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full" placeholder="••••••••" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#a0a0a0] mb-1.5 uppercase tracking-wider">Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full" placeholder="••••••••" required />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00aaff] hover:bg-[#0088cc] text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-[#a0a0a0] text-sm mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#00aaff] hover:text-[#33bbff] font-medium">Sign in</Link>
        </p>
        <div className="text-center mt-4">
          <Link href="/" className="text-[#666666] hover:text-[#a0a0a0] text-xs">← Home</Link>
        </div>
      </div>
    </div>
  );
}
