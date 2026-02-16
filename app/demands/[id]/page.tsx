'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Demand } from '@/types';

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
          setDemand({
            id: demandSnap.id,
            ...demandSnap.data(),
            createdAt: demandSnap.data().createdAt?.toDate(),
            updatedAt: demandSnap.data().updatedAt?.toDate(),
          } as Demand);
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
    if (!user) {
      router.push('/login');
      return;
    }

    if (!demand) return;

    setCoSigning(true);

    try {
      const demandRef = doc(db, 'demands', demandId);
      const hasCoSigned = demand.coSigners?.includes(user.uid);

      if (hasCoSigned) {
        // Remove co-signature
        await updateDoc(demandRef, {
          coSigners: arrayRemove(user.uid),
          coSignCount: increment(-1),
        });
        setDemand({
          ...demand,
          coSigners: demand.coSigners.filter((id) => id !== user.uid),
          coSignCount: (demand.coSignCount || 0) - 1,
        });
      } else {
        // Add co-signature
        await updateDoc(demandRef, {
          coSigners: arrayUnion(user.uid),
          coSignCount: increment(1),
        });
        setDemand({
          ...demand,
          coSigners: [...(demand.coSigners || []), user.uid],
          coSignCount: (demand.coSignCount || 0) + 1,
        });
      }
    } catch (error) {
      console.error('Error co-signing demand:', error);
    } finally {
      setCoSigning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!demand) {
    return null;
  }

  const hasCoSigned = user && demand.coSigners?.includes(user.uid);
  const isCreator = user && demand.creatorId === user.uid;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-3xl font-bold text-purple-600">
            Demand
          </Link>
          <div className="space-x-4">
            <Link href="/demands" className="text-gray-700 hover:text-purple-600">
              ← Back to Demands
            </Link>
            {user && (
              <Link href="/dashboard" className="text-gray-700 hover:text-purple-600">
                Dashboard
              </Link>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Status Badge */}
          <div className="mb-6">
            <span
              className={`inline-block px-6 py-2 rounded-full text-sm font-semibold ${
                demand.status === 'active'
                  ? 'bg-blue-100 text-blue-700'
                  : demand.status === 'met'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {demand.status === 'active'
                ? 'Active Demand'
                : demand.status === 'met'
                ? 'Demand Won ✓'
                : 'Closed'}
            </span>
          </div>

          {/* Title & Company */}
          <h1 className="text-5xl font-bold text-gray-900 mb-4">{demand.title}</h1>
          <p className="text-xl text-gray-600 mb-8">
            Target: <span className="font-semibold text-purple-600">{demand.targetCompany}</span>
          </p>

          {/* Co-Sign Button */}
          {!isCreator && (
            <button
              onClick={handleCoSign}
              disabled={coSigning || !user}
              className={`mb-8 px-8 py-4 rounded-lg font-semibold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${
                hasCoSigned
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {coSigning
                ? 'Processing...'
                : hasCoSigned
                ? 'Remove Co-Signature'
                : 'Co-Sign This Demand'}
            </button>
          )}

          {/* Stats */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-8">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-purple-600">
                  {demand.coSignCount || 0}
                </div>
                <div className="text-gray-600 mt-1">Co-Signers</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-gray-900">
                  {demand.createdAt
                    ? Math.floor(
                        (Date.now() - demand.createdAt.getTime()) / (1000 * 60 * 60 * 24)
                      )
                    : 0}
                </div>
                <div className="text-gray-600 mt-1">Days Active</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-gray-900">
                  {demand.status === 'active' ? '🔥' : demand.status === 'met' ? '✅' : '🔒'}
                </div>
                <div className="text-gray-600 mt-1">Status</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-8 rounded-xl shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Demand</h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {demand.description}
            </p>
          </div>

          {/* Success Criteria */}
          <div className="bg-white p-8 rounded-xl shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Success Criteria</h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {demand.successCriteria}
            </p>
          </div>

          {/* Creator Info */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-8">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 mb-1">Created by</p>
                <p className="text-lg font-semibold text-gray-900">{demand.creatorName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Created on</p>
                <p className="text-lg font-semibold text-gray-900">
                  {demand.createdAt
                    ? new Date(demand.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Unknown'}
                </p>
              </div>
            </div>
          </div>

          {/* Message Board (Placeholder) */}
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Discussion</h2>
            <p className="text-gray-500 text-center py-8">
              Message board coming soon. Discuss strategy, share updates, coordinate action.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
