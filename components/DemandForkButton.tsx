'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Demand } from '@/types';

interface Props {
  demand: Demand;
}

export default function DemandForkButton({ demand }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState('');
  const [newTitle, setNewTitle] = useState(`${demand.title} (Fork)`);
  const [newDescription, setNewDescription] = useState(demand.description);
  const [submitting, setSubmitting] = useState(false);

  const handleFork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      // Create forked demand
      const forkedRef = await addDoc(collection(db, 'demands'), {
        title: newTitle,
        description: newDescription,
        targetCompany: demand.targetCompany,
        successCriteria: demand.successCriteria,
        creatorId: user.uid,
        creatorName: user.displayName || user.email || 'Anonymous',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        currentSpokespersonId: user.uid,
        spokespersonVotes: [],
        spokespersonVotingOpen: false,
        status: 'active',
        visibility: 'public',
        coSigners: [user.uid],
        coSignCount: 1,
        activeNegotiations: [],
        tags: demand.tags || [],
        forkedFrom: demand.id,
      });

      // Record the fork
      await addDoc(collection(db, 'demandForks'), {
        originalDemandId: demand.id,
        forkedDemandId: forkedRef.id,
        reason,
        creatorId: user.uid,
        creatorName: user.displayName || user.email || 'Anonymous',
        createdAt: serverTimestamp(),
      });

      router.push(`/demands/${forkedRef.id}`);
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  if (!user) return null;

  return (
    <div className="bg-[#1a1a1a] border border-[#222222] rounded-xl p-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-[#666666] uppercase tracking-wider">🔀 Fork This Demand</h3>
        <button onClick={() => setShowForm(!showForm)} className="text-xs text-[#00aaff] hover:underline">
          {showForm ? 'Cancel' : 'Fork'}
        </button>
      </div>
      <p className="text-[#666666] text-xs mb-3">Disagree with the direction? Fork it — like GitHub for activism.</p>

      {showForm && (
        <form onSubmit={handleFork} className="space-y-3">
          <div>
            <label className="text-xs text-[#666666] block mb-1">Why are you forking?</label>
            <input value={reason} onChange={e => setReason(e.target.value)} required
              placeholder="e.g., Want to focus on pricing specifically"
              className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-4 py-2 text-white text-sm placeholder-[#666666] focus:border-[#00aaff] focus:outline-none" />
          </div>
          <div>
            <label className="text-xs text-[#666666] block mb-1">New Title</label>
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} required
              className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-4 py-2 text-white text-sm focus:border-[#00aaff] focus:outline-none" />
          </div>
          <div>
            <label className="text-xs text-[#666666] block mb-1">Updated Description</label>
            <textarea value={newDescription} onChange={e => setNewDescription(e.target.value)} required rows={3}
              className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-4 py-2 text-white text-sm focus:border-[#00aaff] focus:outline-none resize-none" />
          </div>
          <button type="submit" disabled={submitting}
            className="bg-[#00aaff] hover:bg-[#0088cc] text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
            {submitting ? 'Forking...' : '🔀 Create Fork'}
          </button>
        </form>
      )}
    </div>
  );
}
