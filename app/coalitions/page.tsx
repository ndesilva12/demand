'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Coalition, Demand } from '@/types';
import { formatNumber } from '@/lib/pressure';

export default function CoalitionsPage() {
  const [coalitions, setCoalitions] = useState<(Coalition & { demands: Demand[] })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDocs(query(collection(db, 'coalitions'), orderBy('totalCoSigners', 'desc')));
        const coalitionData = snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate() } as Coalition));
        
        // Fetch demands for each coalition
        const enriched = await Promise.all(coalitionData.map(async (c) => {
          const demands = await Promise.all((c.demandIds || []).slice(0, 5).map(async (did) => {
            const dSnap = await getDoc(doc(db, 'demands', did));
            return dSnap.exists() ? { id: dSnap.id, ...dSnap.data(), createdAt: dSnap.data().createdAt?.toDate() } as Demand : null;
          }));
          return { ...c, demands: demands.filter(Boolean) as Demand[] };
        }));
        setCoalitions(enriched);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        

        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            ⚡ <span className="text-[#00aaff]">Coalitions</span>
          </h1>
          <p className="text-[#a0a0a0] text-lg max-w-2xl mx-auto">
            Related demands banding together for amplified pressure. United fronts that corporations can&apos;t ignore.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-[#666666] py-20 animate-pulse">Loading coalitions...</div>
        ) : coalitions.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-white mb-2">No coalitions yet</h3>
            <p className="text-[#a0a0a0] mb-6">Form the first coalition by linking related demands together.</p>
            <Link href="/coalitions/create" className="bg-[#00aaff] hover:bg-[#0088cc] text-white px-6 py-3 rounded-lg font-medium">
              Form a Coalition
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {coalitions.map(coalition => (
              <Link key={coalition.id} href={`/coalitions/${coalition.id}`}
                className="block bg-[#1a1a1a] border border-[#222222] rounded-xl p-6 hover:border-[#00aaff]/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white group-hover:text-[#00aaff] transition-colors">
                      {coalition.name}
                    </h2>
                    <p className="text-[#a0a0a0] mt-1">{coalition.description}</p>
                  </div>
                  <div className="text-right shrink-0 ml-6">
                    <div className="text-2xl font-black text-[#00aaff]">{formatNumber(coalition.totalCoSigners)}</div>
                    <div className="text-xs text-[#666666] uppercase tracking-wider">Combined Power</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {coalition.targetCompanies?.map(c => (
                    <span key={c} className="px-3 py-1 bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#ef4444] rounded-full text-xs font-medium">
                      vs {c}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm text-[#666666]">
                  <span>{coalition.demandIds?.length || 0} demands</span>
                  <span>·</span>
                  <span>Pressure Score: {formatNumber(coalition.pressureScore || 0)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
