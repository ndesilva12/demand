'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Demand } from '@/types';

export default function DashboardPage() {
  const { user, signOut, loading: authLoading } = useAuth();
  const router = useRouter();
  const [myDemands, setMyDemands] = useState<Demand[]>([]);
  const [coSignedDemands, setCoSignedDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (!authLoading && !user) router.push('/login'); }, [user, authLoading, router]);

  useEffect(() => {
    const fetchDemands = async () => {
      if (!user) return;
      try {
        const myQ = query(collection(db, 'demands'), where('creatorId', '==', user.uid), orderBy('createdAt', 'desc'));
        const mySnap = await getDocs(myQ);
        setMyDemands(mySnap.docs.map((doc) => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate(), updatedAt: doc.data().updatedAt?.toDate() })) as Demand[]);

        const coQ = query(collection(db, 'demands'), where('coSigners', 'array-contains', user.uid));
        const coSnap = await getDocs(coQ);
        setCoSignedDemands(coSnap.docs.map((doc) => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate(), updatedAt: doc.data().updatedAt?.toDate() })) as Demand[]);
      } catch (error) {
        console.error('Error fetching demands:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDemands();
  }, [user]);

  if (authLoading || !user) {
    return <div className="min-h-screen bg-surface-deep flex items-center justify-center"><div className="text-text-muted">Loading...</div></div>;
  }

  const DemandCard = ({ demand }: { demand: Demand }) => (
    <Link href={`/demands/${demand.id}`} className="block bg-surface-raised border border-border-subtle rounded-xl p-5 hover:border-brand/30 transition-all group">
      <div className="flex justify-between items-start">
        <div className="flex-1 mr-4">
          <h3 className="font-bold text-text-primary group-hover:text-brand transition-colors text-sm">{demand.title}</h3>
          <p className="text-xs text-text-muted mt-1">Target: {demand.targetCompany}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
            <span><span className="text-brand font-semibold">{demand.coSignCount || 0}</span> co-signers</span>
            <span>{demand.createdAt ? new Date(demand.createdAt).toLocaleDateString() : ''}</span>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${
          demand.status === 'active' ? 'bg-brand/10 text-brand' : demand.status === 'met' ? 'bg-success/10 text-success' : 'bg-surface-overlay text-text-muted'
        }`}>
          {demand.status === 'active' ? 'Active' : demand.status === 'met' ? 'Won' : 'Closed'}
        </span>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-surface-deep">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-2xl font-bold text-brand">demand</Link>
          <div className="flex items-center gap-4">
            <Link href="/demands" className="text-text-secondary hover:text-text-primary text-sm transition-colors">Browse</Link>
            <Link href="/create" className="bg-brand hover:bg-brand-dark text-white px-5 py-2 rounded-lg text-sm font-medium transition-all">+ New Demand</Link>
            <button onClick={async () => { await signOut(); router.push('/'); }} className="text-text-muted hover:text-danger text-sm transition-colors">Sign Out</button>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-text-primary mb-1">Dashboard</h1>
        <p className="text-text-secondary text-sm mb-8">{user.email}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-surface-raised border border-border-subtle rounded-xl p-5 text-center">
            <div className="text-2xl font-bold text-brand">{myDemands.length}</div>
            <div className="text-text-muted text-xs mt-1 uppercase tracking-wider">Created</div>
          </div>
          <div className="bg-surface-raised border border-border-subtle rounded-xl p-5 text-center">
            <div className="text-2xl font-bold text-brand">{coSignedDemands.length}</div>
            <div className="text-text-muted text-xs mt-1 uppercase tracking-wider">Co-Signed</div>
          </div>
          <div className="bg-surface-raised border border-border-subtle rounded-xl p-5 text-center">
            <div className="text-2xl font-bold text-success">{myDemands.filter((d) => d.status === 'met').length}</div>
            <div className="text-text-muted text-xs mt-1 uppercase tracking-wider">Won</div>
          </div>
        </div>

        {/* My Demands */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-text-primary mb-4">My Demands</h2>
          {loading ? (
            <div className="animate-pulse bg-surface-raised rounded-xl h-20"></div>
          ) : myDemands.length === 0 ? (
            <div className="bg-surface-raised border border-border-subtle rounded-xl p-8 text-center">
              <p className="text-text-muted text-sm mb-4">No demands yet.</p>
              <Link href="/create" className="bg-brand hover:bg-brand-dark text-white px-5 py-2 rounded-lg text-sm font-medium transition-all inline-block">Create One</Link>
            </div>
          ) : (
            <div className="space-y-3">{myDemands.map((d) => <DemandCard key={d.id} demand={d} />)}</div>
          )}
        </div>

        {/* Co-Signed */}
        <div>
          <h2 className="text-lg font-bold text-text-primary mb-4">Demands I Support</h2>
          {loading ? (
            <div className="animate-pulse bg-surface-raised rounded-xl h-20"></div>
          ) : coSignedDemands.length === 0 ? (
            <div className="bg-surface-raised border border-border-subtle rounded-xl p-8 text-center">
              <p className="text-text-muted text-sm mb-4">No co-signed demands.</p>
              <Link href="/demands" className="bg-brand hover:bg-brand-dark text-white px-5 py-2 rounded-lg text-sm font-medium transition-all inline-block">Browse Demands</Link>
            </div>
          ) : (
            <div className="space-y-3">{coSignedDemands.map((d) => <DemandCard key={d.id} demand={d} />)}</div>
          )}
        </div>
      </div>
    </div>
  );
}
