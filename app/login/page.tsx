'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to sign in');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 animate-fadeIn">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700 hover-lift">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#00aaff]">Welcome Back</h1>
          <p className="text-gray-400 mt-2">Sign in to your Demand account</p>
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
            <div className="flex justify-between items-center mt-2">
              <Link 
                href="/forgot-password" 
                className="text-xs text-[#00aaff] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 rounded-lg text-lg font-semibold"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="px-4 text-gray-500 text-sm">Or continue with</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <button className="btn-secondary py-2 flex items-center justify-center">
              <img 
                src="/icons/google.svg" 
                alt="Google" 
                className="w-5 h-5 mr-2" 
              />
              Google
            </button>
            <button className="btn-secondary py-2 flex items-center justify-center">
              <img 
                src="/icons/github.svg" 
                alt="GitHub" 
                className="w-5 h-5 mr-2" 
              />
              GitHub
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link 
              href="/signup" 
              className="text-[#00aaff] hover:underline font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}