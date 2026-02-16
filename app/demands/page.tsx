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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-2xl font-bold text-[#00aaff]">demand</Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-[#a0a0a0] hover:text-white text-sm transition-colors">Dashboard</Link>
            <Link href="/create" className="bg-[#00aaff] hover:bg-[#0088cc] text-white px-5 py-2 rounded-lg text-sm font-medium transition-all">
              + New Demand
            </Link>
          </div>
        </div>

        {/* Title & Search */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Demands</h1>
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
        <div className="flex flex-wrap items-center gap-2 mb-8">
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
          <div className="ml-auto flex items-center gap-1">
            <span className="text-[#666666] text-xs mr-2">Sort:</span>
            {([['newest', 'Newest'], ['popular', 'Most Supported'], ['trending', 'Trending']] as const).map(([key, label]) => (
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
                className="block bg-[#1a1a1a] border border-[#1e1e1e] rounded-xl p-6 hover:border-[#00aaff]/30 transition-all group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 mr-4">
                    <h3 className="text-lg font-bold text-white group-hover:text-[#00aaff] transition-colors">
                      {demand.title}
                    </h3>
                    <p className="text-xs text-[#666666] mt-1">
                      Target: <span className="text-[#00aaff] font-medium">{demand.targetCompany}</span>
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ${
                    demand.status === 'active' ? 'bg-[#00aaff]/10 text-[#00aaff] border border-[#00aaff]/20'
                    : demand.status === 'met' ? 'bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20'
                    : 'bg-[#222222] text-[#666666] border border-[#222222]'
                  }`}>
                    {demand.status === 'active' ? 'Active' : demand.status === 'met' ? 'Won' : 'Closed'}
                  </span>
                </div>
                <p className="text-[#a0a0a0] text-sm line-clamp-2 mb-4">{demand.description}</p>
                <div className="flex items-center justify-between text-xs text-[#666666]">
                  <div className="flex items-center gap-4">
                    <span><span className="text-[#00aaff] font-semibold">{demand.coSignCount || 0}</span> co-signers</span>
                    <span>By {demand.creatorName}</span>
                  </div>
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
