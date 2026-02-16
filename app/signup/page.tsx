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

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create account');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 animate-fadeIn">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700 hover-lift">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#00aaff]">Create Account</h1>
          <p className="text-gray-400 mt-2">Join Demand and start making change</p>
        </div>

        {error && (
          <div className="bg-red-900 bg-opacity-20 text-red-400 p-4 rounded-lg mb-6 border border-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg"
              placeholder="••••••••"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              At least 6 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 rounded-lg text-lg font-semibold"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="text-[#00aaff] hover:underline font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700 text-center">
          <Link
            href="/"
            className="text-gray-500 hover:text-[#00aaff] text-sm flex items-center justify-center"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}