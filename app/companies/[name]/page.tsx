'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Demand } from '@/types';

export default function CompanyPage() {
  const params = useParams();
  const companyName = decodeURIComponent(params.name as string);
  
  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDemands = async () => {
      try {
        const q = query(
          collection(db, 'demands'),
          where('targetCompany', '==', companyName),
          where('visibility', '==', 'public'),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const demandsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as Demand[];
        setDemands(demandsData);
      } catch (error) {
        console.error('Error fetching demands:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDemands();
  }, [companyName]);

  const activeDemands = demands.filter((d) => d.status === 'active');
  const wonDemands = demands.filter((d) => d.status === 'met');
  const totalCoSigners = demands.reduce((sum, d) => sum + (d.coSignCount || 0), 0);

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
              Browse All
            </Link>
            <Link href="/dashboard" className="text-gray-700 hover:text-purple-600">
              Dashboard
            </Link>
          </div>
        </div>

        {/* Company Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-400 rounded-lg flex items-center justify-center text-white text-3xl font-bold">
              {companyName.charAt(0)}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{companyName}</h1>
              <p className="text-gray-600 mt-1">All demands targeting this company</p>
            </div>
          </div>

          {/* Stats */}
          {!loading && demands.length > 0 && (
            <div className="grid grid-cols-4 gap-6 mt-8">
              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <div className="text-3xl font-bold text-purple-600">{demands.length}</div>
                <div className="text-gray-600 mt-1">Total Demands</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <div className="text-3xl font-bold text-blue-600">{activeDemands.length}</div>
                <div className="text-gray-600 mt-1">Active</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <div className="text-3xl font-bold text-green-600">{wonDemands.length}</div>
                <div className="text-gray-600 mt-1">Won</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <div className="text-3xl font-bold text-gray-900">{totalCoSigners}</div>
                <div className="text-gray-600 mt-1">Co-Signers</div>
              </div>
            </div>
          )}
        </div>

        {/* Demands List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Loading demands...</p>
          </div>
        ) : demands.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-md">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No demands for {companyName} yet
            </h3>
            <p className="text-gray-600 mb-6">Be the first to create one!</p>
            <Link
              href="/create"
              className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Create Demand
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {demands.map((demand) => (
              <Link
                key={demand.id}
                href={`/demands/${demand.id}`}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition block"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{demand.title}</h3>
                  </div>
                  <div
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
                      ? 'Won ✓'
                      : 'Closed'}
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{demand.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div>
                      <span className="font-semibold text-purple-600">
                        {demand.coSignCount || 0}
                      </span>{' '}
                      co-signers
                    </div>
                    <div>
                      By <span className="font-semibold">{demand.creatorName}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {demand.createdAt
                      ? new Date(demand.createdAt).toLocaleDateString()
                      : 'Unknown'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
