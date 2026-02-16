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
    // Filter by visibility
    if (demand.visibility !== 'public') return false;

    // Filter by status
    if (filter !== 'all' && demand.status !== filter) return false;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        demand.title.toLowerCase().includes(query) ||
        demand.description.toLowerCase().includes(query) ||
        demand.targetCompany.toLowerCase().includes(query)
      );
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/" className="text-3xl font-bold text-[#00aaff]">
              Demand
            </Link>
          </div>
          <div className="space-x-4">
            <Link href="/dashboard" className="text-gray-300 hover:text-[#00aaff]">
              Dashboard
            </Link>
            <Link
              href="/create"
              className="bg-[#00aaff] text-white px-6 py-2 rounded-lg hover:bg-[#0088cc] transition"
            >
              Create Demand
            </Link>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-100 mb-4">Browse Demands</h1>
        <p className="text-gray-400 mb-8">
          Explore active demands and co-sign those you support.
        </p>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search demands by title, company, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-3 border-2 border-gray-800 rounded-lg focus:border-purple-500 focus:outline-none transition text-lg"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              filter === 'all'
                ? 'bg-[#00aaff] text-white'
                : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#0a0a0a] border border-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              filter === 'active'
                ? 'bg-[#00aaff] text-white'
                : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#0a0a0a] border border-gray-700'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('met')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              filter === 'met'
                ? 'bg-[#00aaff] text-white'
                : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#0a0a0a] border border-gray-700'
            }`}
          >
            Won
          </button>
        </div>

        {/* Demands List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-400">Loading demands...</p>
          </div>
        ) : filteredDemands.length === 0 ? (
          <div className="bg-[#1a1a1a] rounded-xl p-12 text-center shadow-md">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-100 mb-2">No demands yet</h3>
            <p className="text-gray-400 mb-6">Be the first to create a demand!</p>
            <Link
              href="/create"
              className="inline-block bg-[#00aaff] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#0088cc] transition"
            >
              Create First Demand
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredDemands.map((demand) => (
              <Link
                key={demand.id}
                href={`/demands/${demand.id}`}
                className="bg-[#1a1a1a] p-6 rounded-xl shadow-md hover:shadow-lg transition block"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-100 mb-2">
                      {demand.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Target:{' '}
                      <Link
                        href={`/companies/${encodeURIComponent(demand.targetCompany)}`}
                        className="font-semibold text-[#00aaff] hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {demand.targetCompany}
                      </Link>
                    </p>
                  </div>
                  <div
                    className={`px-4 py-1 rounded-full text-sm font-semibold ${
                      demand.status === 'active'
                        ? 'bg-blue-100 text-blue-700'
                        : demand.status === 'met'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-[#1e1e1e] text-gray-300'
                    }`}
                  >
                    {demand.status === 'active'
                      ? 'Active'
                      : demand.status === 'met'
                      ? 'Won ✓'
                      : 'Closed'}
                  </div>
                </div>

                <p className="text-gray-400 mb-4 line-clamp-2">{demand.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div>
                      <span className="font-semibold text-[#00aaff]">
                        {demand.coSignCount || 0}
                      </span>{' '}
                      co-signers
                    </div>
                    <div>
                      By <span className="font-semibold">{demand.creatorName}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {demand.createdAt
                      ? new Date(demand.createdAt).toLocaleDateString()
                      : 'Unknown date'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
