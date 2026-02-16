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

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchDemands = async () => {
      if (!user) return;

      try {
        // Fetch demands created by user
        const myDemandsQuery = query(
          collection(db, 'demands'),
          where('creatorId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const myDemandsSnap = await getDocs(myDemandsQuery);
        const myDemandsData = myDemandsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as Demand[];
        setMyDemands(myDemandsData);

        // Fetch demands co-signed by user
        const coSignedQuery = query(
          collection(db, 'demands'),
          where('coSigners', 'array-contains', user.uid)
        );
        const coSignedSnap = await getDocs(coSignedQuery);
        const coSignedData = coSignedSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as Demand[];
        setCoSignedDemands(coSignedData);
      } catch (error) {
        console.error('Error fetching demands:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDemands();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-3xl font-bold text-purple-600">
            Demand
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/demands" className="text-gray-700 hover:text-purple-600">
              Browse Demands
            </Link>
            <Link
              href="/create"
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Create Demand
            </Link>
            <button
              onClick={handleSignOut}
              className="text-gray-700 hover:text-red-600"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.email}</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl font-bold text-purple-600">
                {myDemands.length}
              </div>
              <div className="text-gray-600 mt-1">Demands Created</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl font-bold text-purple-600">
                {coSignedDemands.length}
              </div>
              <div className="text-gray-600 mt-1">Demands Co-Signed</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl font-bold text-green-600">
                {myDemands.filter((d) => d.status === 'met').length}
              </div>
              <div className="text-gray-600 mt-1">Demands Won</div>
            </div>
          </div>

          {/* My Demands */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Demands</h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : myDemands.length === 0 ? (
              <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <p className="text-gray-600 mb-4">You haven&apos;t created any demands yet.</p>
                <Link
                  href="/create"
                  className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  Create Your First Demand
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {myDemands.map((demand) => (
                  <Link
                    key={demand.id}
                    href={`/demands/${demand.id}`}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition block"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {demand.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">
                          Target: {demand.targetCompany}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="font-semibold text-purple-600">
                            {demand.coSignCount || 0} co-signers
                          </span>
                          <span>
                            {demand.createdAt
                              ? new Date(demand.createdAt).toLocaleDateString()
                              : ''}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`px-4 py-1 rounded-full text-sm font-semibold ${
                          demand.status === 'active'
                            ? 'bg-blue-100 text-blue-700'
                            : demand.status === 'met'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {demand.status === 'active'
                          ? 'Active'
                          : demand.status === 'met'
                          ? 'Won'
                          : 'Closed'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Co-Signed Demands */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Demands I Support</h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : coSignedDemands.length === 0 ? (
              <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <p className="text-gray-600 mb-4">
                  You haven&apos;t co-signed any demands yet.
                </p>
                <Link
                  href="/demands"
                  className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  Browse Demands
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {coSignedDemands.map((demand) => (
                  <Link
                    key={demand.id}
                    href={`/demands/${demand.id}`}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition block"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {demand.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">
                          Target: {demand.targetCompany} • By {demand.creatorName}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="font-semibold text-purple-600">
                            {demand.coSignCount || 0} co-signers
                          </span>
                        </div>
                      </div>
                      <span
                        className={`px-4 py-1 rounded-full text-sm font-semibold ${
                          demand.status === 'active'
                            ? 'bg-blue-100 text-blue-700'
                            : demand.status === 'met'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {demand.status === 'active'
                          ? 'Active'
                          : demand.status === 'met'
                          ? 'Won'
                          : 'Closed'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
