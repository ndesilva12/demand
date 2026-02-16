'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Demand } from '@/types';
import { formatNumber } from '@/lib/pressure';

export default function DemandOfTheDay() {
  const [demand, setDemand] = useState<Demand | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const snap = await getDocs(query(collection(db, 'demands'), where('status', '==', 'active')));
        const demands = snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate() } as Demand));
        if (demands.length === 0) return;
        
        // Algorithm: score by momentum (co-signers / days old) + recency bonus
        const scored = demands.map(d => {
          const daysOld = Math.max(1, d.createdAt ? (Date.now() - new Date(d.createdAt).getTime()) / (1000 * 60 * 60 * 24) : 30);
          const momentum = (d.coSignCount || 0) / daysOld;
          const recencyBonus = daysOld < 7 ? 2 : daysOld < 30 ? 1 : 0;
          // Use day of year as seed for daily rotation
          const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
          const hashBonus = ((dayOfYear * 31 + d.id.charCodeAt(0)) % 10) / 10;
          return { demand: d, score: momentum + recencyBonus + hashBonus };
        });
        scored.sort((a, b) => b.score - a.score);
        setDemand(scored[0].demand);
      } catch (e) { console.error(e); }
    };
    fetchFeatured();
  }, []);

  if (!demand) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm font-bold text-[#f59e0b] uppercase tracking-wider">⭐ Demand of the Day</span>
        <div className="h-px flex-1 bg-[#222222]" />
      </div>
      <Link href={`/demands/${demand.id}`}
        className="block bg-gradient-to-br from-[#f59e0b]/10 via-[#1a1a1a] to-[#00aaff]/10 border border-[#f59e0b]/20 rounded-2xl p-5 sm:p-8 hover:border-[#f59e0b]/40 transition-all group card-hover">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#f59e0b] transition-colors mb-2">
              {demand.title}
            </h3>
            <p className="text-[#a0a0a0] mb-4 line-clamp-2">{demand.description}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-[#00aaff] font-medium">vs {demand.targetCompany}</span>
              <span className="text-[#666666]">·</span>
              <span className="text-[#a0a0a0]">{(demand.coSignCount || 0).toLocaleString()} co-signers</span>
            </div>
          </div>
          <div className="text-4xl sm:text-6xl opacity-20 group-hover:opacity-40 transition-opacity ml-4 sm:ml-6 hidden sm:block">⭐</div>
        </div>
      </Link>
    </div>
  );
}
