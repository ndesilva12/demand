'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Demand } from '@/types';

export default function DemandsPage() {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'trending'>('newest');

  useEffect(() => {
    const fetchDemands = async () => {
      try {
        const q = query(collection(db, 'demands'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const demandsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as Demand[];
        setDemands(demandsData);
      } catch (error) {
        console.error('Error fetching demands:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDemands();
  }, []);

  const filteredDemands = demands.filter((demand) => {
    const matchesFilter = filter === 'all' || demand.status === filter;
    const matchesSearch = searchQuery === '' || 
      demand.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      demand.targetCompany.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch && demand.visibility === 'public';
  }).sort((a, b) => {
    if (sortBy === 'popular') return (b.coSignCount || 0) - (a.coSignCount || 0);
    if (sortBy === 'trending') {
      // Trending = most co-signs in recent time (weighted by recency)
      const ageA = Date.now() - (a.createdAt ? new Date(a.createdAt).getTime() : 0);
      const ageB = Date.now() - (b.createdAt ? new Date(b.createdAt).getTime() : 0);
      const scoreA = (a.coSignCount || 0) / Math.max(ageA / 86400000, 1);
      const scoreB = (b.coSignCount || 0) / Math.max(ageB / 86400000, 1);
      return scoreB - scoreA;
    }
    // newest
    return (b.createdAt ? new Date(b.createdAt).getTime() : 0) - (a.createdAt ? new Date(a.createdAt).getTime() : 0);
  });

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'met', label: 'Won' },
    { key: 'closed', label: 'Closed' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title & Search */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Demands</h1>
          <p className="text-[#a0a0a0] text-sm mb-6">Explore active demands and co-sign those you support.</p>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md"
            placeholder="Search demands or companies..."
          />
        </div>

        {/* Filters & Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === f.key
                    ? 'bg-[#00aaff] text-white'
                    : 'bg-[#1a1a1a] text-[#a0a0a0] hover:text-white border border-[#1e1e1e] hover:border-[#222222]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 sm:ml-auto">
            <span className="text-[#666666] text-xs mr-2">Sort:</span>
            {([['newest', 'Newest'], ['popular', 'Popular'], ['trending', 'Trending']] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  sortBy === key
                    ? 'bg-[#222222] text-white'
                    : 'text-[#666666] hover:text-[#a0a0a0]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Demands List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#1a1a1a] border border-[#1e1e1e] rounded-xl p-6 animate-pulse">
                <div className="h-5 bg-[#222222] rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-[#222222] rounded w-1/4 mb-4"></div>
                <div className="h-3 bg-[#222222] rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : filteredDemands.length === 0 ? (
          <div className="bg-[#1a1a1a] border border-[#1e1e1e] rounded-xl p-12 text-center">
            <div className="text-4xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-white mb-2">No demands found</h3>
            <p className="text-[#a0a0a0] mb-6 text-sm">Be the first to create one.</p>
            <Link href="/create" className="bg-[#00aaff] hover:bg-[#0088cc] text-white px-6 py-3 rounded-lg font-semibold transition-all inline-block">
              Create Demand
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDemands.map((demand) => (
              <Link
                key={demand.id}
                href={`/demands/${demand.id}`}
                className="block bg-[#1a1a1a] border border-[#1e1e1e] rounded-xl p-4 sm:p-6 hover:border-[#00aaff]/30 transition-all group card-hover animate-fade-in"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 mr-3">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {(demand as any).category && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#222222] text-[#a0a0a0] font-medium">
                          {(demand as any).category}
                        </span>
                      )}
                      {(demand as any).escalationStage && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          (demand as any).escalationStage === 'crisis' ? 'bg-[#00aaff]/15 text-[#00aaff]' :
                          (demand as any).escalationStage === 'movement' ? 'bg-[#ef4444]/15 text-[#ef4444]' :
                          (demand as any).escalationStage === 'campaign' ? 'bg-[#f59e0b]/15 text-[#f59e0b]' :
                          'bg-[#222222] text-[#a0a0a0]'
                        }`}>
                          {(demand as any).escalationStage === 'crisis' ? '⚡ Crisis' :
                           (demand as any).escalationStage === 'movement' ? '🔥 Movement' :
                           (demand as any).escalationStage === 'campaign' ? '📢 Campaign' : '📋 Petition'}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#00aaff] transition-colors leading-snug">
                      {demand.title}
                    </h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium shrink-0 mt-1 ${
                    demand.status === 'active' ? 'bg-[#00aaff]/10 text-[#00aaff] border border-[#00aaff]/20'
                    : demand.status === 'met' ? 'bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20'
                    : 'bg-[#222222] text-[#666666] border border-[#222222]'
                  }`}>
                    {demand.status === 'active' ? 'Active' : demand.status === 'met' ? '✓ Won' : 'Closed'}
                  </span>
                </div>
                <p className="text-xs text-[#666666] mb-2">
                  Target: <span className="text-[#00aaff] font-medium">{demand.targetCompany}</span>
                </p>
                <p className="text-[#a0a0a0] text-sm line-clamp-2 mb-3">{demand.description}</p>
                {/* Co-signer bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[#00aaff] font-bold">{(demand.coSignCount || 0).toLocaleString()}</span>
                    <span className="text-[#666666]">co-signers</span>
                  </div>
                  <div className="h-1.5 bg-[#222222] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#00aaff] to-[#0066cc] progress-bar"
                      style={{ width: `${Math.min(100, ((demand.coSignCount || 0) / 60000) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-[#666666]">
                  <span>By {demand.creatorName}</span>
                  <span>{demand.createdAt ? new Date(demand.createdAt).toLocaleDateString() : ''}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
