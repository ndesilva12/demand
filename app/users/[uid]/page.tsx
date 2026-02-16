'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, Demand } from '@/types';

interface Activity {
  id: string;
  type: 'created' | 'cosigned' | 'spokesperson' | 'message';
  demandId: string;
  demandTitle: string;
  timestamp: Date;
}

export default function UserProfilePage() {
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [createdDemands, setCreatedDemands] = useState<Demand[]>([]);
  const [coSignedDemands, setCoSignedDemands] = useState<Demand[]>([]);
  const [spokespersonDemands, setSpokespersonDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = params.uid as string;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user profile
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          setUser({
            uid: userSnap.id,
            ...userSnap.data(),
            createdAt: userSnap.data().createdAt?.toDate(),
          } as User);
        }

        // Fetch created demands
        const createdQuery = query(
          collection(db, 'demands'),
          where('creatorId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        const createdSnapshot = await getDocs(createdQuery);
        setCreatedDemands(createdSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        })) as Demand[]);

        // Fetch co-signed demands
        const coSignedQuery = query(
          collection(db, 'demands'),
          where('coSigners', 'array-contains', userId)
        );
        const coSignedSnapshot = await getDocs(coSignedQuery);
        setCoSignedDemands(coSignedSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        })) as Demand[]);

        // Fetch spokesperson demands
        const spokespersonQuery = query(
          collection(db, 'demands'),
          where('currentSpokespersonId', '==', userId)
        );
        const spokespersonSnapshot = await getDocs(spokespersonQuery);
        setSpokespersonDemands(spokespersonSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        })) as Demand[]);

      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-deep flex items-center justify-center">
        <div className="animate-pulse text-text-muted">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-surface-deep flex items-center justify-center">
        <div className="text-text-muted">User not found</div>
      </div>
    );
  }

  const reputation = user.reputation || 0;
  const reputationLevel = 
    reputation >= 1000 ? 'Legend' :
    reputation >= 500 ? 'Champion' :
    reputation >= 250 ? 'Advocate' :
    reputation >= 100 ? 'Activist' :
    reputation >= 50 ? 'Supporter' : 'Member';

  const badges = [];
  if (createdDemands.length >= 5) badges.push({ emoji: '🚀', name: 'Creator', desc: '5+ demands created' });
  if (coSignedDemands.length >= 10) badges.push({ emoji: '✊', name: 'Movement Builder', desc: '10+ demands co-signed' });
  if (spokespersonDemands.length >= 1) badges.push({ emoji: '📢', name: 'Spokesperson', desc: 'Active spokesperson' });
  if (reputation >= 500) badges.push({ emoji: '⭐', name: 'High Reputation', desc: '500+ points' });

  return (
    <div className="min-h-screen bg-surface-deep">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-2xl font-bold text-brand">demand</Link>
          <Link href="/demands" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
            View All Demands
          </Link>
        </div>

        {/* Profile Header */}
        <div className="bg-surface-raised border border-border-subtle rounded-xl p-8 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-brand to-brand-dark rounded-full flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
              {(user.displayName || user.email || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                {user.displayName || user.email?.split('@')[0] || 'Anonymous User'}
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-brand/10 text-brand border border-brand/20 rounded-full text-sm font-semibold">
                  {reputationLevel}
                </span>
                {user.verifiedStatus === 'verified' && (
                  <span className="px-3 py-1 bg-success/10 text-success border border-success/20 rounded-full text-sm">
                    ✓ Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-text-muted">
                <span>Joined {user.createdAt?.toLocaleDateString() || 'Unknown'}</span>
                <span>•</span>
                <span>{reputation} reputation points</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-surface-raised border border-border-subtle rounded-xl p-5 text-center">
            <div className="text-3xl font-bold text-brand">{createdDemands.length}</div>
            <div className="text-text-muted text-xs mt-1 uppercase tracking-wider">Created</div>
          </div>
          <div className="bg-surface-raised border border-border-subtle rounded-xl p-5 text-center">
            <div className="text-3xl font-bold text-text-primary">{coSignedDemands.length}</div>
            <div className="text-text-muted text-xs mt-1 uppercase tracking-wider">Co-Signed</div>
          </div>
          <div className="bg-surface-raised border border-border-subtle rounded-xl p-5 text-center">
            <div className="text-3xl font-bold text-warning">{spokespersonDemands.length}</div>
            <div className="text-text-muted text-xs mt-1 uppercase tracking-wider">Spokesperson</div>
          </div>
        </div>

        {/* Badges & Achievements */}
        {badges.length > 0 && (
          <div className="bg-surface-raised border border-border-subtle rounded-xl p-6 mb-6">
            <h2 className="text-lg font-bold text-text-primary mb-4 uppercase tracking-wider">
              🏆 Achievements
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {badges.map((badge, idx) => (
                <div key={idx} className="p-3 bg-surface-overlay border border-border-subtle rounded-lg">
                  <div className="text-2xl mb-1">{badge.emoji}</div>
                  <div className="text-text-primary font-semibold text-sm">{badge.name}</div>
                  <div className="text-text-muted text-xs">{badge.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Created Demands */}
        {createdDemands.length > 0 && (
          <div className="bg-surface-raised border border-border-subtle rounded-xl p-6 mb-6">
            <h2 className="text-lg font-bold text-text-primary mb-4 uppercase tracking-wider">
              🚀 Created Demands
            </h2>
            <div className="space-y-3">
              {createdDemands.map((demand) => (
                <Link
                  key={demand.id}
                  href={`/demands/${demand.id}`}
                  className="block p-4 bg-surface-overlay border border-border-subtle hover:border-brand rounded-lg transition-all group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-text-primary font-semibold group-hover:text-brand transition-colors mb-1">
                        {demand.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <span className={`px-2 py-0.5 rounded-full ${
                          demand.status === 'active' ? 'bg-brand/10 text-brand' :
                          demand.status === 'met' ? 'bg-success/10 text-success' :
                          'bg-surface-overlay text-text-muted'
                        }`}>
                          {demand.status}
                        </span>
                        <span>vs {demand.targetCompany}</span>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-brand font-bold">{demand.coSignCount || 0}</div>
                      <div className="text-text-muted text-xs">co-signers</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Co-Signed Demands */}
        {coSignedDemands.length > 0 && (
          <div className="bg-surface-raised border border-border-subtle rounded-xl p-6">
            <h2 className="text-lg font-bold text-text-primary mb-4 uppercase tracking-wider">
              ✊ Co-Signed Demands
            </h2>
            <div className="space-y-3">
              {coSignedDemands.slice(0, 5).map((demand) => (
                <Link
                  key={demand.id}
                  href={`/demands/${demand.id}`}
                  className="block p-4 bg-surface-overlay border border-border-subtle hover:border-brand rounded-lg transition-all group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-text-primary font-semibold group-hover:text-brand transition-colors mb-1">
                        {demand.title}
                      </h3>
                      <div className="text-xs text-text-muted">vs {demand.targetCompany}</div>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-brand font-bold">{demand.coSignCount || 0}</div>
                      <div className="text-text-muted text-xs">co-signers</div>
                    </div>
                  </div>
                </Link>
              ))}
              {coSignedDemands.length > 5 && (
                <div className="text-center text-text-muted text-sm pt-2">
                  + {coSignedDemands.length - 5} more
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
