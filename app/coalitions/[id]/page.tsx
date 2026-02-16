'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Coalition, Demand } from '@/types';
import { formatNumber, calculatePressureScore } from '@/lib/pressure';

export default function CoalitionDetailPage() {
  const params = useParams();
  const [coalition, setCoalition] = useState<Coalition | null>(null);
  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cSnap = await getDoc(doc(db, 'coalitions', params.id as string));
        if (!cSnap.exists()) { setLoading(false); return; }
        const c = { id: cSnap.id, ...cSnap.data(), createdAt: cSnap.data().createdAt?.toDate() } as Coalition;
        setCoalition(c);

        const demandData = await Promise.all((c.demandIds || []).map(async (did) => {
          const dSnap = await getDoc(doc(db, 'demands', did));
          return dSnap.exists() ? { id: dSnap.id, ...dSnap.data(), createdAt: dSnap.data().createdAt?.toDate() } as Demand : null;
        }));
        setDemands(demandData.filter(Boolean) as Demand[]);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [params.id]);

  if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><div className="animate-pulse text-[#666666]">Loading...</div></div>;
  if (!coalition) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><div className="text-[#a0a0a0]">Coalition not found</div></div>;

  const totalCoSigners = demands.reduce((sum, d) => sum + (d.coSignCount || 0), 0);
  const pressureScore = calculatePressureScore(demands);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex justify-between items-center mb-8">
          <Link href="/" className="text-2xl font-bold text-[#00aaff]">demand</Link>
          <Link href="/coalitions" className="text-[#a0a0a0] hover:text-white text-sm">← All Coalitions</Link>
        </nav>

        <div className="mb-2">
          <span className="inline-block px-3 py-1 rounded-full bg-[#00aaff]/10 text-[#00aaff] border border-[#00aaff]/20 text-xs font-medium uppercase tracking-wider">
            ⚡ Coalition
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{coalition.name}</h1>
        <p className="text-[#a0a0a0] mb-8 text-lg">{coalition.description}</p>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Combined Power', value: formatNumber(totalCoSigners), color: 'text-[#00aaff]' },
            { label: 'Demands', value: demands.length.toString(), color: 'text-white' },
            { label: 'Companies', value: (coalition.targetCompanies?.length || 0).toString(), color: 'text-[#ef4444]' },
            { label: 'Pressure Score', value: formatNumber(pressureScore), color: 'text-[#f59e0b]' },
          ].map(s => (
            <div key={s.label} className="bg-[#1a1a1a] border border-[#222222] rounded-xl p-4 text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-[#666666] mt-1 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Target Companies */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-[#666666] uppercase tracking-wider mb-3">Target Companies</h2>
          <div className="flex flex-wrap gap-2">
            {coalition.targetCompanies?.map(c => (
              <Link key={c} href={`/companies/${encodeURIComponent(c)}`}
                className="px-4 py-2 bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#ef4444] rounded-lg text-sm font-medium hover:bg-[#ef4444]/20 transition-all">
                🎯 {c}
              </Link>
            ))}
          </div>
        </div>

        {/* Demands in this coalition */}
        <h2 className="text-xl font-bold text-white mb-4">Coalition Demands</h2>
        <div className="space-y-3">
          {demands.map(d => (
            <Link key={d.id} href={`/demands/${d.id}`}
              className="block bg-[#1a1a1a] border border-[#222222] rounded-xl p-5 hover:border-[#00aaff]/30 transition-all group">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-white group-hover:text-[#00aaff] transition-colors">{d.title}</h3>
                  <div className="text-sm text-[#666666] mt-1">vs {d.targetCompany}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-[#00aaff]">{formatNumber(d.coSignCount || 0)}</div>
                  <div className="text-xs text-[#666666]">co-signers</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
