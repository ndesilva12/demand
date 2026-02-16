'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Demand } from '@/types';

export default function VictoriesPage() {
  const [victories, setVictories] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVictories = async () => {
      try {
        const q = query(
          collection(db, 'demands'),
          where('status', '==', 'met'),
          orderBy('updatedAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const victoriesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as Demand[];
        setVictories(victoriesData);
      } catch (error) {
        console.error('Error fetching victories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVictories();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="text-5xl sm:text-7xl mb-4">🏆</div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">Victory Showcase</h1>
          <p className="text-xl text-[#a0a0a0] max-w-2xl mx-auto">
            Demands that won. People spoke, companies listened, change happened.
          </p>
        </div>

        {/* Stats Bar */}
        {!loading && victories.length > 0 && (
          <div className="bg-[#1a1a1a] p-8 rounded-xl border border-[#1e1e1e] mb-12">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-[#22c55e]">{victories.length}</div>
                <div className="text-[#666666] mt-2">Victories</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#00aaff]">
                  {victories.reduce((sum, v) => sum + (v.coSignCount || 0), 0)}
                </div>
                <div className="text-[#666666] mt-2">Total Co-Signers</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#00aaff]">
                  {new Set(victories.map((v) => v.targetCompany)).size}
                </div>
                <div className="text-[#666666] mt-2">Companies Engaged</div>
              </div>
            </div>
          </div>
        )}

        {/* Victories List */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[#1a1a1a] border border-[#1e1e1e] rounded-xl p-8 border-l-4 border-l-[#222222]">
                <div className="skeleton h-7 w-3/4 rounded mb-3" />
                <div className="skeleton h-4 w-1/4 rounded mb-4" />
                <div className="skeleton h-4 w-full rounded mb-2" />
                <div className="skeleton h-4 w-2/3 rounded" />
              </div>
            ))}
          </div>
        ) : victories.length === 0 ? (
          <div className="bg-[#1a1a1a] rounded-xl p-12 text-center border border-[#1e1e1e]">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-white mb-2">No victories yet</h3>
            <p className="text-[#666666] mb-6">
              Be the first to create a winning demand and make real change!
            </p>
            <Link
              href="/create"
              className="inline-block bg-[#00aaff] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#0088cc] transition"
            >
              Create a Demand
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {victories.map((victory) => (
              <Link
                key={victory.id}
                href={`/demands/${victory.id}`}
                className="bg-[#1a1a1a] p-4 sm:p-8 rounded-xl border border-[#1e1e1e] hover:border-[#22c55e] transition border-l-4 border-l-[#22c55e] card-hover"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">✅</span>
                      <h3 className="text-2xl font-bold text-white">{victory.title}</h3>
                    </div>
                    <p className="text-lg text-[#a0a0a0] mb-3">
                      Target:{' '}
                      <span className="font-semibold text-[#00aaff]">
                        {victory.targetCompany}
                      </span>
                    </p>
                  </div>
                </div>

                <p className="text-[#a0a0a0] mb-6 leading-relaxed">{victory.description}</p>

                <div className="bg-[#22c55e]/10 p-4 rounded-lg mb-6 border border-[#22c55e]/20">
                  <h4 className="font-semibold text-[#22c55e] mb-2">Success Achieved:</h4>
                  <p className="text-white">{victory.successCriteria}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-[#222222]">
                  <div className="flex items-center gap-4 text-sm flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-[#22c55e]">
                        {(victory.coSignCount || 0).toLocaleString()}
                      </span>
                      <span className="text-[#666666]">co-signers</span>
                    </div>
                    <div className="text-[#a0a0a0]">
                      By <span className="font-semibold">{victory.creatorName}</span>
                    </div>
                  </div>
                  <div className="text-xs text-[#666666]">
                    Won{' '}
                    {victory.updatedAt
                      ? new Date(victory.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : ''}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        {!loading && victories.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-[#666666] mb-4">Ready to create the next victory?</p>
            <Link
              href="/create"
              className="inline-block bg-[#00aaff] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#0088cc] transition"
            >
              Create a Demand
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
