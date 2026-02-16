'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Demand } from '@/types';

export default function CreateCoalitionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [demands, setDemands] = useState<Demand[]>([]);
  const [selectedDemandIds, setSelectedDemandIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDemands = async () => {
      const snap = await getDocs(query(collection(db, 'demands'), where('status', '==', 'active')));
      setDemands(snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate() } as Demand)));
    };
    fetchDemands();
  }, []);

  const filteredDemands = demands.filter(d =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.targetCompany.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDemand = (id: string) => {
    setSelectedDemandIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectedDemands = demands.filter(d => selectedDemandIds.includes(d.id));
  const targetCompanies = [...new Set(selectedDemands.map(d => d.targetCompany))];
  const totalCoSigners = selectedDemands.reduce((sum, d) => sum + (d.coSignCount || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || selectedDemandIds.length < 2) return;
    setSubmitting(true);
    try {
      const docRef = await addDoc(collection(db, 'coalitions'), {
        name,
        description,
        demandIds: selectedDemandIds,
        targetCompanies,
        creatorId: user.uid,
        creatorName: user.displayName || user.email || 'Anonymous',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        totalCoSigners,
        pressureScore: 0,
        tags: [],
      });
      router.push(`/coalitions/${docRef.id}`);
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#a0a0a0] mb-4">You need to be logged in to form a coalition.</p>
          <Link href="/login" className="bg-[#00aaff] text-white px-6 py-3 rounded-lg font-medium">Log In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex justify-between items-center mb-12">
          <Link href="/" className="text-2xl font-bold text-[#00aaff]">demand</Link>
          <Link href="/coalitions" className="text-[#a0a0a0] hover:text-white text-sm">← Back to Coalitions</Link>
        </nav>

        <h1 className="text-3xl font-bold mb-2">Form a <span className="text-[#00aaff]">Coalition</span></h1>
        <p className="text-[#a0a0a0] mb-8">Unite related demands into an unstoppable force. Select at least 2 demands.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#a0a0a0] mb-2">Coalition Name</label>
            <input value={name} onChange={e => setName(e.target.value)} required
              placeholder="e.g., Anti-Monopoly Alliance"
              className="w-full bg-[#1a1a1a] border border-[#222222] rounded-lg px-4 py-3 text-white placeholder-[#666666] focus:border-[#00aaff] focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#a0a0a0] mb-2">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={3}
              placeholder="Why are these demands stronger together?"
              className="w-full bg-[#1a1a1a] border border-[#222222] rounded-lg px-4 py-3 text-white placeholder-[#666666] focus:border-[#00aaff] focus:outline-none resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a0a0a0] mb-2">Select Demands ({selectedDemandIds.length} selected)</label>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search demands..."
              className="w-full bg-[#1a1a1a] border border-[#222222] rounded-lg px-4 py-3 text-white placeholder-[#666666] focus:border-[#00aaff] focus:outline-none mb-3" />
            <div className="max-h-64 overflow-y-auto space-y-2 border border-[#222222] rounded-lg p-2">
              {filteredDemands.map(d => (
                <button key={d.id} type="button" onClick={() => toggleDemand(d.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    selectedDemandIds.includes(d.id)
                      ? 'bg-[#00aaff]/10 border border-[#00aaff]/30 text-white'
                      : 'bg-[#1a1a1a] border border-transparent text-[#a0a0a0] hover:text-white hover:bg-[#222222]'
                  }`}>
                  <div className="font-medium text-sm">{d.title}</div>
                  <div className="text-xs mt-1 opacity-60">vs {d.targetCompany} · {d.coSignCount || 0} co-signers</div>
                </button>
              ))}
              {filteredDemands.length === 0 && <div className="text-center text-[#666666] py-4 text-sm">No demands found</div>}
            </div>
          </div>

          {selectedDemandIds.length >= 2 && (
            <div className="bg-[#00aaff]/5 border border-[#00aaff]/20 rounded-xl p-5">
              <h3 className="text-sm font-medium text-[#00aaff] uppercase tracking-wider mb-3">Coalition Preview</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">{selectedDemandIds.length}</div>
                  <div className="text-xs text-[#666666]">Demands</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#00aaff]">{totalCoSigners}</div>
                  <div className="text-xs text-[#666666]">Combined Co-Signers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#ef4444]">{targetCompanies.length}</div>
                  <div className="text-xs text-[#666666]">Companies Targeted</div>
                </div>
              </div>
            </div>
          )}

          <button type="submit" disabled={submitting || selectedDemandIds.length < 2 || !name}
            className="w-full bg-[#00aaff] hover:bg-[#0088cc] text-white py-4 rounded-xl font-semibold text-lg transition-all disabled:opacity-50 hover:shadow-xl hover:shadow-[#00aaff]/30">
            {submitting ? 'Forming Coalition...' : '⚡ Form Coalition'}
          </button>
        </form>
      </div>
    </div>
  );
}
