'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Demand } from '@/types';
import { formatNumber, calculatePressureScore } from '@/lib/pressure';

export default function WeeklyDigestPage() {
  const [data, setData] = useState<{
    newDemands: Demand[];
    trending: Demand[];
    topCompanies: { name: string; score: number; demands: number }[];
    totalCoSigners: number;
    victories: Demand[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        // Fetch all active demands
        const allSnap = await getDocs(query(collection(db, 'demands'), where('status', 'in', ['active', 'negotiation', 'met'])));
        const allDemands = allSnap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate() } as Demand));

        // New demands this week
        const newDemands = allDemands.filter(d => d.createdAt && new Date(d.createdAt) >= oneWeekAgo);

        // Trending: highest co-sign count active demands
        const trending = [...allDemands].filter(d => d.status === 'active').sort((a, b) => (b.coSignCount || 0) - (a.coSignCount || 0)).slice(0, 5);

        // Victories
        const victories = allDemands.filter(d => d.status === 'met');

        // Top companies by pressure
        const byCompany: Record<string, Demand[]> = {};
        allDemands.filter(d => d.status === 'active').forEach(d => {
          if (!byCompany[d.targetCompany]) byCompany[d.targetCompany] = [];
          byCompany[d.targetCompany].push(d);
        });
        const topCompanies = Object.entries(byCompany)
          .map(([name, demands]) => ({ name, score: calculatePressureScore(demands), demands: demands.length }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);

        const totalCoSigners = allDemands.reduce((sum, d) => sum + (d.coSignCount || 0), 0);

        setData({ newDemands, trending, topCompanies, totalCoSigners, victories });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  const weekLabel = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex justify-between items-center mb-12">
          <Link href="/" className="text-2xl font-bold text-[#00aaff]">demand</Link>
          <div className="flex items-center gap-6">
            <Link href="/demands" className="text-[#a0a0a0] hover:text-white text-sm">Browse</Link>
            <Link href="/pressure-board" className="text-[#a0a0a0] hover:text-white text-sm">Pressure Board</Link>
          </div>
        </nav>

        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-[#00aaff]/20 bg-[#00aaff]/5 text-[#00aaff] text-xs tracking-wide uppercase font-medium">
            📰 Weekly Digest
          </div>
          <h1 className="text-4xl font-bold mb-2">Week in <span className="text-[#00aaff]">Review</span></h1>
          <p className="text-[#a0a0a0]">{weekLabel}</p>
        </div>

        {loading ? (
          <div className="text-center text-[#666666] py-20 animate-pulse">Compiling digest...</div>
        ) : data && (
          <div className="space-y-8">
            {/* Stats banner */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'New Demands', value: data.newDemands.length, icon: '📋' },
                { label: 'Total Co-Signers', value: formatNumber(data.totalCoSigners), icon: '✊' },
                { label: 'Trending', value: data.trending.length, icon: '🔥' },
                { label: 'Victories', value: data.victories.length, icon: '🏆' },
              ].map(s => (
                <div key={s.label} className="bg-[#1a1a1a] border border-[#222222] rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-[#666666]">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Trending demands */}
            {data.trending.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">🔥 Trending Demands</h2>
                <div className="space-y-2">
                  {data.trending.map((d, i) => (
                    <Link key={d.id} href={`/demands/${d.id}`}
                      className="flex items-center gap-4 bg-[#1a1a1a] border border-[#222222] rounded-xl p-4 hover:border-[#00aaff]/30 transition-all group">
                      <span className="text-2xl font-black text-[#333333] w-8 text-center">{i + 1}</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-white group-hover:text-[#00aaff] transition-colors text-sm">{d.title}</h3>
                        <span className="text-xs text-[#666666]">vs {d.targetCompany}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[#00aaff]">{formatNumber(d.coSignCount || 0)}</div>
                        <div className="text-[10px] text-[#666666]">co-signers</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Most pressured companies */}
            {data.topCompanies.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">🎯 Most Pressured This Week</h2>
                <div className="space-y-2">
                  {data.topCompanies.map(c => (
                    <Link key={c.name} href={`/companies/${encodeURIComponent(c.name)}`}
                      className="flex items-center justify-between bg-[#1a1a1a] border border-[#222222] rounded-xl p-4 hover:border-[#ef4444]/30 transition-all">
                      <div>
                        <span className="font-bold text-white">{c.name}</span>
                        <span className="text-xs text-[#666666] ml-2">{c.demands} demand{c.demands !== 1 ? 's' : ''}</span>
                      </div>
                      <span className="text-[#ef4444] font-bold">{formatNumber(c.score)} pressure</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* New demands */}
            {data.newDemands.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">📋 New This Week</h2>
                <div className="space-y-2">
                  {data.newDemands.map(d => (
                    <Link key={d.id} href={`/demands/${d.id}`}
                      className="block bg-[#1a1a1a] border border-[#222222] rounded-xl p-4 hover:border-[#00aaff]/30 transition-all">
                      <h3 className="font-bold text-white text-sm">{d.title}</h3>
                      <span className="text-xs text-[#666666]">vs {d.targetCompany} · {d.coSignCount || 0} co-signers</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Victories */}
            {data.victories.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">🏆 Victories</h2>
                <div className="space-y-2">
                  {data.victories.map(d => (
                    <Link key={d.id} href={`/demands/${d.id}`}
                      className="block bg-gradient-to-r from-[#22c55e]/10 to-transparent border border-[#22c55e]/20 rounded-xl p-4">
                      <h3 className="font-bold text-[#22c55e] text-sm">✅ {d.title}</h3>
                      <span className="text-xs text-[#666666]">{d.targetCompany} · {formatNumber(d.coSignCount || 0)} co-signers</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="text-center py-6">
              <button onClick={() => navigator.clipboard?.writeText(window.location.href)}
                className="bg-[#00aaff] hover:bg-[#0088cc] text-white px-6 py-3 rounded-xl font-medium text-sm">
                📋 Copy Link to Share This Digest
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
