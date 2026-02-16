'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export default function CreateDemandPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [successCriteria, setSuccessCriteria] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);

    try {
      const demandData = {
        title,
        description,
        targetCompany,
        successCriteria,
        creatorId: user.uid,
        creatorName: user.email || 'Anonymous',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'active',
        coSigners: [],
        coSignCount: 0,
        visibility,
      };

      const docRef = await addDoc(collection(db, 'demands'), demandData);
      router.push(`/demands/${docRef.id}`);
    } catch (err) {
      console.error('Error creating demand:', err);
      setError('Failed to create demand. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className="bg-[#1a1a1a] p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Sign in to create a demand</h2>
          <Link
            href="/login"
            className="inline-block bg-[#00aaff] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#0088cc] transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-3xl font-bold text-[#00aaff]">
            Demand
          </Link>
          <Link href="/demands" className="text-gray-300 hover:text-[#00aaff]">
            ← Back to Demands
          </Link>
        </div>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-100 mb-4">Create a Demand</h1>
          <p className="text-gray-400 mb-8">
            Build a structured demand with clear success criteria. Rally supporters. Force
            change.
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="bg-[#1a1a1a] p-8 rounded-2xl shadow-lg">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Demand Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="e.g., Stop using child labor in cobalt mining"
                  required
                />
              </div>

              {/* Target Company */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Target Company *
                </label>
                <input
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="e.g., Tesla, Amazon, Coca-Cola"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent h-40"
                  placeholder="Explain the issue, why it matters, and what needs to change..."
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  Include evidence, sources, and context. Be specific.
                </p>
              </div>

              {/* Success Criteria */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Success Criteria *
                </label>
                <textarea
                  value={successCriteria}
                  onChange={(e) => setSuccessCriteria(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent h-32"
                  placeholder="Define measurable outcomes that would satisfy this demand..."
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  Examples: "Third-party audit showing 100% conflict-free supply chain by Q4
                  2026" or "Public commitment with timeline to phase out single-use plastics"
                </p>
              </div>

              {/* Visibility */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Visibility
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="public"
                      checked={visibility === 'public'}
                      onChange={(e) =>
                        setVisibility(e.target.value as 'public' | 'private')
                      }
                      className="mr-2"
                    />
                    <span>Public (anyone can see and co-sign)</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="private"
                      checked={visibility === 'private'}
                      onChange={(e) =>
                        setVisibility(e.target.value as 'public' | 'private')
                      }
                      className="mr-2"
                    />
                    <span>Private (only you can see)</span>
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  You can change this later. Use private to refine before publishing.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00aaff] text-white py-4 rounded-lg font-semibold text-lg hover:bg-[#0088cc] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Demand...' : 'Create Demand'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
