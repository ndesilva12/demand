'use client';

import { useState, useEffect } from 'react';
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

  // Load template from localStorage if present
  useEffect(() => {
    const templateData = localStorage.getItem('demandTemplate');
    if (templateData) {
      try {
        const template = JSON.parse(templateData);
        setTitle(template.title || '');
        setDescription(template.description || '');
        setSuccessCriteria(template.successCriteria || '');
        localStorage.removeItem('demandTemplate'); // Clear after loading
      } catch (e) {
        console.error('Error loading template:', e);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!user) { router.push('/login'); return; }
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'demands'), {
        title, description, targetCompany, successCriteria,
        creatorId: user.uid, creatorName: user.email || 'Anonymous',
        createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
        status: 'active', coSigners: [], coSignCount: 0, visibility,
        currentSpokespersonId: user.uid,
        spokespersonVotes: [], spokespersonVotingOpen: false,
      });
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
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-4">Sign in to create a demand</h2>
          <Link href="/login" className="bg-[#00aaff] hover:bg-[#0088cc] text-white px-6 py-3 rounded-lg font-semibold transition-all inline-block">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-2xl font-bold text-[#00aaff]">demand</Link>
          <Link href="/demands" className="text-[#a0a0a0] hover:text-white text-sm transition-colors">← Back</Link>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Create a Demand</h1>
        <p className="text-[#a0a0a0] text-sm mb-8">Define clear success criteria. Rally supporters. Force change.</p>

        {error && (
          <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#ef4444] rounded-lg p-3 mb-6 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-[#a0a0a0] mb-1.5 uppercase tracking-wider">Demand Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full" placeholder="e.g., Stop using child labor in cobalt mining" required />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#a0a0a0] mb-1.5 uppercase tracking-wider">Target Company</label>
            <input type="text" value={targetCompany} onChange={(e) => setTargetCompany(e.target.value)} className="w-full" placeholder="e.g., Tesla, Amazon, Coca-Cola" required />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#a0a0a0] mb-1.5 uppercase tracking-wider">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full h-40 resize-y" placeholder="Explain the issue, why it matters, and what needs to change..." required />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#a0a0a0] mb-1.5 uppercase tracking-wider">Success Criteria</label>
            <textarea value={successCriteria} onChange={(e) => setSuccessCriteria(e.target.value)} className="w-full h-32 resize-y" placeholder="Define measurable outcomes..." required />
            <p className="text-[#666666] text-xs mt-1.5">Be specific. Measurable criteria are what make Demand different from a petition.</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#a0a0a0] mb-1.5 uppercase tracking-wider">Visibility</label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer text-sm text-[#a0a0a0]">
                <input type="radio" value="public" checked={visibility === 'public'} onChange={(e) => setVisibility(e.target.value as 'public' | 'private')} className="mr-2 accent-[#00aaff]" />
                Public
              </label>
              <label className="flex items-center cursor-pointer text-sm text-[#a0a0a0]">
                <input type="radio" value="private" checked={visibility === 'private'} onChange={(e) => setVisibility(e.target.value as 'public' | 'private')} className="mr-2 accent-[#00aaff]" />
                Private (draft)
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00aaff] hover:bg-[#0088cc] text-white py-4 rounded-xl font-semibold text-lg transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-[#00aaff]/30"
          >
            {loading ? 'Creating...' : 'Create Demand'}
          </button>
        </form>
      </div>
    </div>
  );
}
