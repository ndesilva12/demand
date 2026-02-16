'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Demand } from '@/types';
import { getTopTrending, getHeatLevel } from '@/lib/trending';

export default function TrendingDemands() {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const demandsRef = collection(db, 'demands');
        const q = query(demandsRef, where('status', '==', 'active'));
        const snapshot = await getDocs(q);
        
        const fetchedDemands = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as Demand[];

        const trending = getTopTrending(fetchedDemands, 6);
        setDemands(trending);
      } catch (error) {
        console.error('Error fetching trending:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-brand border-t-transparent"></div>
      </div>
    );
  }

  if (demands.length === 0) {
    return (
      <div className="text-center py-12 text-text-muted">
        <p>No trending demands yet. Be the first to create one!</p>
      </div>
    );
  }

  const getHeatEmoji = (heat: ReturnType<typeof getHeatLevel>) => {
    switch (heat) {
      case 'fire': return '🔥🔥🔥';
      case 'hot': return '🔥🔥';
      case 'warm': return '🔥';
      default: return '📍';
    }
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {demands.map((demand) => {
        const heat = getHeatLevel(demand);
        const daysActive = demand.createdAt 
          ? Math.floor((Date.now() - demand.createdAt.getTime()) / (1000 * 60 * 60 * 24))
          : 0;

        return (
          <Link
            key={demand.id}
            href={`/demands/${demand.id}`}
            className="block bg-surface-raised border border-border-subtle hover:border-brand rounded-xl p-6 transition-all group hover:-translate-y-1"
          >
            {/* Heat Indicator */}
            <div className="flex justify-between items-start mb-3">
              <span className={`text-xs px-2 py-1 rounded-full ${
                heat === 'fire' ? 'bg-danger/20 text-danger border border-danger/30' :
                heat === 'hot' ? 'bg-warning/20 text-warning border border-warning/30' :
                heat === 'warm' ? 'bg-brand/20 text-brand border border-brand/30' :
                'bg-surface-overlay text-text-muted border border-border-default'
              }`}>
                {getHeatEmoji(heat)} Trending
              </span>
              <span className="text-xs text-text-muted">{daysActive}d old</span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-text-primary group-hover:text-brand transition-colors mb-2 line-clamp-2">
              {demand.title}
            </h3>

            {/* Target */}
            <p className="text-text-muted text-sm mb-3">
              vs <span className="text-brand font-semibold">{demand.targetCompany}</span>
            </p>

            {/* Stats */}
            <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-brand font-bold text-lg">{demand.coSignCount || 0}</div>
                  <div className="text-text-muted text-xs">co-signers</div>
                </div>
                {demand.currentSpokespersonId && (
                  <div className="text-xs text-text-muted px-2 py-1 bg-surface-overlay rounded-full">
                    📢 Has spokesperson
                  </div>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
