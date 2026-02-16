'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getCountFromServer } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function DemandStats() {
  const [stats, setStats] = useState({
    totalDemands: 0,
    activeDemands: 0,
    wonDemands: 0,
    totalCoSignatures: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const demandsRef = collection(db, 'demands');
        
        const totalDemandsQuery = query(demandsRef, where('visibility', '==', 'public'));
        const activeDemandsQuery = query(demandsRef, 
          where('visibility', '==', 'public'), 
          where('status', '==', 'active')
        );
        const wonDemandsQuery = query(demandsRef, 
          where('visibility', '==', 'public'), 
          where('status', '==', 'met')
        );

        const [totalDemands, activeDemands, wonDemands] = await Promise.all([
          getCountFromServer(totalDemandsQuery),
          getCountFromServer(activeDemandsQuery),
          getCountFromServer(wonDemandsQuery)
        ]);

        setStats({
          totalDemands: totalDemands.data().count,
          activeDemands: activeDemands.data().count,
          wonDemands: wonDemands.data().count,
          totalCoSignatures: 0  // We'll enhance this later
        });
      } catch (error) {
        console.error('Error fetching demand stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid md:grid-cols-4 gap-4 text-center">
        {[1, 2, 3, 4].map((_, index) => (
          <div 
            key={index} 
            className="bg-gray-800 p-6 rounded-xl border border-gray-700 animate-pulse"
          >
            <div className="h-8 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-4 gap-4 text-center">
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-[#00aaff] transition">
        <div className="text-4xl font-bold text-[#00aaff]">{stats.totalDemands}</div>
        <div className="text-gray-400 mt-2">Total Demands</div>
      </div>
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-[#00aaff] transition">
        <div className="text-4xl font-bold text-[#00aaff]">{stats.activeDemands}</div>
        <div className="text-gray-400 mt-2">Active Demands</div>
      </div>
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-green-500 transition">
        <div className="text-4xl font-bold text-green-500">{stats.wonDemands}</div>
        <div className="text-gray-400 mt-2">Demands Won</div>
      </div>
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-[#00aaff] transition">
        <div className="text-4xl font-bold text-purple-500">0</div>
        <div className="text-gray-400 mt-2">Community</div>
      </div>
    </div>
  );
}