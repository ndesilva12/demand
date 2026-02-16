'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Demand } from '@/types';

const categories = [
  { name: 'Technology', icon: '💻', color: '#00aaff' },
  { name: 'Healthcare', icon: '🏥', color: '#22c55e' },
  { name: 'Finance', icon: '💰', color: '#f59e0b' },
  { name: 'Environment', icon: '🌍', color: '#14b8a6' },
  { name: 'Labor Rights', icon: '✊', color: '#ef4444' },
  { name: 'Food & Agriculture', icon: '🌾', color: '#f97316' },
  { name: 'Telecom', icon: '📡', color: '#8b5cf6' },
  { name: 'Entertainment', icon: '🎬', color: '#ec4899' },
];

const nearYou = [
  { city: 'New York', demands: 12, topDemand: 'MTA Fare Transparency' },
  { city: 'San Francisco', demands: 8, topDemand: 'Tech Worker Housing Fund' },
  { city: 'Chicago', demands: 6, topDemand: 'Utility Rate Cap' },
  { city: 'Austin', demands: 5, topDemand: 'Water Infrastructure Update' },
];

export default function ExplorePage() {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDemands = async () => {
      try {
        const q = query(collection(db, 'demands'), orderBy('coSignCount', 'desc'), limit(20));
        const snap = await getDocs(q);
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Demand));
        setDemands(data);
      } catch {
        // Will use empty state
      } finally {
        setLoading(false);
      }
    };
    fetchDemands();
  }, []);

  const trending = demands.slice(0, 6);
  const newDemands = [...demands].reverse().slice(0, 4);
  const almostThere = demands.filter(d => (d.coSignCount || 0) >= 50 && (d.coSignCount || 0) < 200).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">
            Explore <span className="text-[#00aaff]">Demands</span>
          </h1>
          <p className="text-[#a0a0a0] text-lg">Discover demands that matter to you</p>
        </div>

        {/* Categories */}
        <section className="mb-16">
          <h2 className="text-xl font-bold mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map(cat => (
              <Link
                key={cat.name}
                href={`/demands?category=${encodeURIComponent(cat.name)}`}
                className="bg-[#1a1a1a] border border-[#1e1e1e] rounded-xl p-5 text-center hover:border-[#00aaff]/30 transition-all hover:-translate-y-1 group"
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <div className="font-semibold text-sm text-white group-hover:text-[#00aaff] transition-colors">{cat.name}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending This Week */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">🔥 Trending This Week</h2>
            <Link href="/demands" className="text-[#00aaff] text-sm hover:underline">View all →</Link>
          </div>
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3].map(i => <div key={i} className="skeleton h-40 rounded-xl" />)}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trending.map(d => (
                <Link key={d.id} href={`/demands/${d.id}`} className="bg-[#1a1a1a] border border-[#1e1e1e] rounded-xl p-5 hover:border-[#00aaff]/30 transition-all group card-hover">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#00aaff]/10 text-[#00aaff] border border-[#00aaff]/20">{d.targetCompany}</span>
                    <span className="text-xs text-[#666666]">🔥 Trending</span>
                  </div>
                  <h3 className="font-bold text-white mb-2 group-hover:text-[#00aaff] transition-colors line-clamp-2">{d.title}</h3>
                  <div className="flex items-center justify-between text-xs text-[#666666]">
                    <span>vs {d.targetCompany}</span>
                    <span className="text-[#00aaff] font-semibold">{(d.coSignCount || 0).toLocaleString()} co-signers</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Near You */}
        <section className="mb-16">
          <h2 className="text-xl font-bold mb-6">📍 Near You</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {nearYou.map(loc => (
              <div key={loc.city} className="bg-[#1a1a1a] border border-[#1e1e1e] rounded-xl p-5">
                <div className="font-bold text-white mb-1">{loc.city}</div>
                <div className="text-xs text-[#666666] mb-3">{loc.demands} active demands</div>
                <div className="text-xs text-[#a0a0a0]">
                  Top: <span className="text-[#00aaff]">{loc.topDemand}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* New & Noteworthy */}
        <section className="mb-16">
          <h2 className="text-xl font-bold mb-6">✨ New & Noteworthy</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {(newDemands.length > 0 ? newDemands : demands.slice(0, 4)).map(d => (
              <Link key={d.id} href={`/demands/${d.id}`} className="bg-[#1a1a1a] border border-[#1e1e1e] rounded-xl p-5 hover:border-[#00aaff]/30 transition-all group card-hover">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                  <span className="text-xs text-[#22c55e]">New</span>
                </div>
                <h3 className="font-bold text-white mb-2 group-hover:text-[#00aaff] transition-colors">{d.title}</h3>
                <p className="text-xs text-[#666666] line-clamp-2 mb-3">{d.description}</p>
                <div className="text-xs text-[#a0a0a0]">vs {d.targetCompany} · {(d.coSignCount || 0).toLocaleString()} co-signers</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Almost at Next Stage */}
        <section className="mb-16">
          <h2 className="text-xl font-bold mb-6">⚡ Almost at Next Stage</h2>
          <p className="text-[#a0a0a0] text-sm mb-6">These demands are close to hitting their next escalation threshold. Your co-sign could tip the scale.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {(almostThere.length > 0 ? almostThere : demands.slice(0, 4)).map(d => {
              const count = d.coSignCount || 0;
              const nextThreshold = count < 100 ? 100 : count < 500 ? 500 : count < 1000 ? 1000 : 5000;
              const progress = (count / nextThreshold) * 100;
              return (
                <Link key={d.id} href={`/demands/${d.id}`} className="bg-[#1a1a1a] border border-[#f59e0b]/20 rounded-xl p-5 hover:border-[#f59e0b]/40 transition-all group">
                  <h3 className="font-bold text-white mb-2 group-hover:text-[#00aaff] transition-colors">{d.title}</h3>
                  <div className="flex items-center justify-between text-xs text-[#666666] mb-2">
                    <span>{count.toLocaleString()} co-signers</span>
                    <span className="text-[#f59e0b]">{nextThreshold.toLocaleString()} needed</span>
                  </div>
                  <div className="h-2 bg-[#222222] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#f59e0b] to-[#ef4444] rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Don&apos;t see what you&apos;re looking for?</h2>
          <p className="text-[#a0a0a0] mb-8">Create your own demand and rally support.</p>
          <Link href="/create" className="bg-[#00aaff] hover:bg-[#0088cc] text-white px-8 py-4 rounded-xl font-bold transition-all hover:shadow-xl hover:shadow-[#00aaff]/30">
            Start a Demand
          </Link>
        </section>
      </div>
    </div>
  );
}
