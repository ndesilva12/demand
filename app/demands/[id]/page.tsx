'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { showToast } from '@/components/Layout';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Demand } from '@/types';
import { SpokespersonNomination } from '@/components/SpokespersonNomination';
import MessageBoard from '@/components/MessageBoard';
import DemandEditProposals from '@/components/DemandEditProposals';
import ImpactCalculator from '@/components/ImpactCalculator';
import EscalationLadder from '@/components/EscalationLadder';
import DemandAnalytics from '@/components/DemandAnalytics';
import CorporateResponseSection from '@/components/CorporateResponseSection';
import DemandForkButton from '@/components/DemandForkButton';
import WhatIfCalculator from '@/components/WhatIfCalculator';

export default function DemandDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [demand, setDemand] = useState<Demand | null>(null);
  const [loading, setLoading] = useState(true);
  const [coSigning, setCoSigning] = useState(false);
  const demandId = params.id as string;

  useEffect(() => {
    const fetchDemand = async () => {
      try {
        const demandRef = doc(db, 'demands', demandId);
        const demandSnap = await getDoc(demandRef);
        if (demandSnap.exists()) {
          setDemand({ id: demandSnap.id, ...demandSnap.data(), createdAt: demandSnap.data().createdAt?.toDate(), updatedAt: demandSnap.data().updatedAt?.toDate() } as Demand);
        } else {
          router.push('/demands');
        }
      } catch (error) {
        console.error('Error fetching demand:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDemand();
  }, [demandId, router]);

  const handleCoSign = async () => {
    if (!user || !demand) { router.push('/login'); return; }
    setCoSigning(true);
    try {
      const demandRef = doc(db, 'demands', demandId);
      const hasCoSigned = demand.coSigners?.includes(user.uid);
      if (hasCoSigned) {
        await updateDoc(demandRef, { coSigners: arrayRemove(user.uid), coSignCount: increment(-1) });
        setDemand({ ...demand, coSigners: demand.coSigners.filter((id) => id !== user.uid), coSignCount: (demand.coSignCount || 0) - 1 });
        showToast('Co-signature removed', 'info');
      } else {
        await updateDoc(demandRef, { coSigners: arrayUnion(user.uid), coSignCount: increment(1) });
        setDemand({ ...demand, coSigners: [...(demand.coSigners || []), user.uid], coSignCount: (demand.coSignCount || 0) + 1 });
        showToast('✊ Co-signed! You\'re making a difference.', 'success');
      }
    } catch (error) {
      console.error('Error co-signing:', error);
      showToast('Failed to co-sign. Please try again.', 'error');
    } finally {
      setCoSigning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="skeleton h-4 w-48 rounded mb-6" />
          <div className="skeleton h-6 w-24 rounded-full mb-4" />
          <div className="skeleton h-10 w-3/4 rounded mb-3" />
          <div className="skeleton h-4 w-48 rounded mb-8" />
          <div className="skeleton h-12 w-48 rounded-xl mb-8" />
          <div className="bg-[#1a1a1a] border border-[#1e1e1e] rounded-xl p-6 mb-6">
            <div className="skeleton h-4 w-full rounded mb-2" />
            <div className="skeleton h-4 w-full rounded mb-2" />
            <div className="skeleton h-4 w-3/4 rounded mb-2" />
            <div className="skeleton h-4 w-full rounded mb-2" />
            <div className="skeleton h-4 w-2/3 rounded" />
          </div>
        </div>
      </div>
    );
  }
  if (!demand) return null;

  const hasCoSigned = user && demand.coSigners?.includes(user.uid);
  const isCreator = user && demand.creatorId === user.uid;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#666666] mb-6">
          <Link href="/demands" className="hover:text-[#00aaff] transition-colors">Demands</Link>
          <span>›</span>
          <span className="text-[#a0a0a0] truncate">{demand?.title?.slice(0, 40)}...</span>
        </div>

        {/* Status */}
        <div className="mb-6">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            demand.status === 'active' ? 'bg-[#00aaff]/10 text-[#00aaff] border border-[#00aaff]/20'
            : demand.status === 'met' ? 'bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20'
            : 'bg-[#222222] text-[#666666] border border-[#222222]'
          }`}>
            {demand.status === 'active' ? 'Active Demand' : demand.status === 'met' ? 'Demand Won ✓' : 'Closed'}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{demand.title}</h1>
        <p className="text-[#a0a0a0] mb-8">
          Target: <span className="text-[#00aaff] font-semibold">{demand.targetCompany}</span>
        </p>

        {/* Co-Sign Button */}
        {!isCreator && (
          <button
            onClick={handleCoSign}
            disabled={coSigning || !user}
            className={`mb-8 px-8 py-3 rounded-xl font-semibold text-base transition-all disabled:opacity-50 ${
              hasCoSigned
                ? 'bg-[#1a1a1a] border border-[#222222] text-[#a0a0a0] hover:border-[#ef4444] hover:text-[#ef4444]'
                : 'bg-[#00aaff] hover:bg-[#0088cc] text-white hover:shadow-lg hover:shadow-[#00aaff]/30'
            }`}
          >
            {coSigning ? 'Processing...' : hasCoSigned ? 'Remove Co-Signature' : '✊ Co-Sign This Demand'}
          </button>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1a1a1a] border border-[#1e1e1e] rounded-xl p-5 text-center">
            <div className="text-3xl font-bold text-[#00aaff]">{demand.coSignCount || 0}</div>
            <div className="text-[#666666] text-xs mt-1 uppercase tracking-wider">Co-Signers</div>
          </div>
          <div className="bg-[#1a1a1a] border border-[#1e1e1e] rounded-xl p-5 text-center">
            <div className="text-3xl font-bold text-white">
              {demand.createdAt ? Math.floor((Date.now() - demand.createdAt.getTime()) / (1000 * 60 * 60 * 24)) : 0}
            </div>
            <div className="text-[#666666] text-xs mt-1 uppercase tracking-wider">Days Active</div>
          </div>
          <div className="bg-[#1a1a1a] border border-[#1e1e1e] rounded-xl p-5 text-center">
            <div className="text-3xl">{demand.status === 'active' ? '🔥' : demand.status === 'met' ? '✅' : '🔒'}</div>
            <div className="text-[#666666] text-xs mt-1 uppercase tracking-wider">Status</div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-[#1a1a1a] border border-[#1e1e1e] rounded-xl p-6 mb-6">
          <h2 className="text-sm font-medium text-[#666666] uppercase tracking-wider mb-3">The Demand</h2>
          <p className="text-white whitespace-pre-wrap leading-relaxed">{demand.description}</p>
        </div>

        {/* Success Criteria */}
        <div className="bg-[#1a1a1a] border border-[#00aaff]/20 rounded-xl p-6 mb-6">
          <h2 className="text-sm font-medium text-[#00aaff] uppercase tracking-wider mb-3">Success Criteria</h2>
          <p className="text-white whitespace-pre-wrap leading-relaxed">{demand.successCriteria}</p>
        </div>

        {/* Creator */}
        <div className="bg-[#1a1a1a] border border-[#1e1e1e] rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs text-[#666666] uppercase tracking-wider mb-1">Created by</div>
              <div className="text-white font-medium">{demand.creatorName}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-[#666666] uppercase tracking-wider mb-1">Created</div>
              <div className="text-white font-medium">
                {demand.createdAt ? new Date(demand.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown'}
              </div>
            </div>
          </div>
        </div>

        {/* Escalation Ladder */}
        <div className="mb-6">
          <EscalationLadder coSignCount={demand.coSignCount || 0} />
        </div>

        {/* Impact Calculator */}
        <ImpactCalculator demand={demand} />

        {/* What If Calculator */}
        <div className="mt-6">
          <WhatIfCalculator companyName={demand.targetCompany} />
        </div>

        {/* Analytics Dashboard */}
        <div className="mt-6">
          <DemandAnalytics demand={demand} />
        </div>

        {/* Corporate Responses */}
        <div className="mt-6">
          <CorporateResponseSection demandId={demandId} companyName={demand.targetCompany} />
        </div>

        {/* Fork */}
        <div className="mt-6">
          <DemandForkButton demand={demand} />
        </div>

        {/* Spokesperson System */}
        <div className="mt-6">
          <SpokespersonNomination demand={demand} onUpdate={() => {
          // Refresh demand data
          const demandRef = doc(db, 'demands', demandId);
          getDoc(demandRef).then(snap => {
            if (snap.exists()) {
              setDemand({ id: snap.id, ...snap.data(), createdAt: snap.data().createdAt?.toDate(), updatedAt: snap.data().updatedAt?.toDate() } as Demand);
            }
          });
          }} />
        </div>

        {/* Democratic Editing */}
        <div className="mt-6">
          <DemandEditProposals demand={demand} onDemandUpdate={() => {
            const demandRef = doc(db, 'demands', demandId);
            getDoc(demandRef).then(snap => {
              if (snap.exists()) {
                setDemand({ id: snap.id, ...snap.data(), createdAt: snap.data().createdAt?.toDate(), updatedAt: snap.data().updatedAt?.toDate() } as Demand);
              }
            });
          }} />
        </div>

        {/* Message Board */}
        <div className="mt-6">
          <MessageBoard demandId={demandId} />
        </div>
      </div>
    </div>
  );
}
