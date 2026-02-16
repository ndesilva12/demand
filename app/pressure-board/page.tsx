'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Demand, PressureEntry } from '@/types';
import { buildPressureBoard, formatNumber } from '@/lib/pressure';

export default function PressureBoardPage() {
  const [entries, setEntries] = useState<PressureEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDocs(query(collection(db, 'demands'), where('status', 'in', ['active', 'negotiation'])));
        const demands = snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate() } as Demand));
        const byCompany: Record<string, Demand[]> = {};
        demands.forEach(d => {
          if (!byCompany[d.targetCompany]) byCompany[d.targetCompany] = [];
          byCompany[d.targetCompany].push(d);
        });
        setEntries(buildPressureBoard(byCompany));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const getMedalColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-500/20 to-yellow-600/5 border-yellow-500/30';
    if (rank === 2) return 'from-gray-400/20 to-gray-500/5 border-gray-400/30';
    if (rank === 3) return 'from-amber-700/20 to-amber-800/5 border-amber-700/30';
    return 'from-transparent to-transparent border-[#222222]';
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        

        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-[#ef4444]/20 bg-[#ef4444]/5 text-[#ef4444] text-xs tracking-wide uppercase font-medium">
            🔥 Live Rankings
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            America&apos;s Most <span className="text-[#00aaff]">Pressured</span> Companies
          </h1>
          <p className="text-[#a0a0a0] text-lg max-w-2xl mx-auto">
            Real-time corporate pressure scores based on active demands, co-signers, and growth velocity.
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="bg-[#1a1a1a] border border-[#1e1e1e] rounded-xl p-5">
                <div className="flex items-center gap-5">
                  <div className="skeleton h-10 w-10 rounded" />
                  <div className="flex-1">
                    <div className="skeleton h-6 w-48 rounded mb-2" />
                    <div className="skeleton h-3 w-32 rounded" />
                  </div>
                  <div className="skeleton h-8 w-20 rounded" />
                </div>
                <div className="skeleton h-1.5 w-full rounded-full mt-3" />
              </div>
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-2">No pressure data yet</h3>
            <p className="text-[#a0a0a0] mb-6">Create demands to start building pressure scores.</p>
            <Link href="/create" className="bg-[#00aaff] hover:bg-[#0088cc] text-white px-6 py-3 rounded-lg font-medium">Create a Demand</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, i) => (
              <Link key={entry.companyName} href={`/companies/${encodeURIComponent(entry.companyName)}`}
                className={`block bg-gradient-to-r ${getMedalColor(entry.rank)} border rounded-xl p-5 hover:scale-[1.01] transition-all group`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-5 flex-1 min-w-0">
                    <div className="text-2xl sm:text-3xl font-black text-[#333333] w-8 sm:w-12 text-center shrink-0">
                      {entry.rank <= 3 ? ['🥇','🥈','🥉'][entry.rank - 1] : `#${entry.rank}`}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-xl font-bold text-white group-hover:text-[#00aaff] transition-colors truncate">
                        {entry.companyName}
                      </h3>
                      <div className="flex items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-[#a0a0a0]">
                        <span>{entry.activeDemands} demand{entry.activeDemands !== 1 ? 's' : ''}</span>
                        <span className="hidden sm:inline">·</span>
                        <span className="hidden sm:inline">{formatNumber(entry.totalCoSigners)} co-signers</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <div className="text-xl sm:text-2xl font-black text-[#00aaff]">{formatNumber(entry.pressureScore)}</div>
                    <div className="text-[10px] sm:text-xs text-[#666666] uppercase tracking-wider">Score</div>
                  </div>
                </div>
                {/* Pressure bar */}
                <div className="mt-3 h-1.5 bg-[#222222] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#00aaff] to-[#ef4444] rounded-full transition-all"
                    style={{ width: `${Math.min(100, (entry.pressureScore / (entries[0]?.pressureScore || 1)) * 100)}%` }} />
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 text-center text-[#666666] text-sm">
          Pressure scores update in real-time based on demand activity, co-signer growth, and momentum.
        </div>
      </div>
    </div>
  );
}
