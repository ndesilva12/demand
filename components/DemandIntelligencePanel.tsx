'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { DemandIntelligence } from '@/lib/demand-intelligence';
import { db } from '@/lib/firebase';
import { Demand, CompanyProfile } from '@/types';

interface DemandIntelligencePanelProps {
  demand: Demand;
}

export function DemandIntelligencePanel({ demand }: DemandIntelligencePanelProps) {
  const [intelligence, setIntelligence] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIntelligence() {
      try {
        const companyDoc = await getDoc(doc(db, 'companies', demand.targetCompany));
        const companyProfile = companyDoc.data() as CompanyProfile;

        const demandIntelligence = new DemandIntelligence(demand, companyProfile);
        const intelligenceScore = demandIntelligence.analyzeDemandsIntelligence();
        
        setIntelligence(intelligenceScore);
      } catch (error) {
        console.error('Intelligence fetch error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchIntelligence();
  }, [demand]);

  if (loading) return <div>Loading intelligence...</div>;
  if (!intelligence) return null;

  const getColorForScore = (score: number) => {
    if (score < 25) return 'text-red-500';
    if (score < 50) return 'text-yellow-500';
    if (score < 75) return 'text-green-500';
    return 'text-blue-500';
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
      <h2 className="text-2xl font-bold text-[#00aaff] mb-4">Demand Intelligence</h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-300">Overall Impact</h3>
          <div className={`text-5xl font-bold ${getColorForScore(intelligence.overallScore)}`}>
            {intelligence.overallScore.toFixed(0)}/100
          </div>
          <div className="text-gray-400 mt-2">
            Potential: {intelligence.potentialImpact}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-300">Key Metrics</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Corporate Vulnerability</span>
              <span className={getColorForScore(intelligence.corporateVulnerability)}>
                {intelligence.corporateVulnerability}/100
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Media Interest Potential</span>
              <span className={getColorForScore(intelligence.mediaInterestPotential)}>
                {intelligence.mediaInterestPotential}/100
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Negotiation Readiness</span>
              <span className={getColorForScore(intelligence.negotiationReadiness)}>
                {intelligence.negotiationReadiness}/100
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-300 mb-3">Recommended Strategies</h3>
        <ul className="list-disc list-inside text-gray-400 space-y-2">
          {intelligence.recommendedStrategies.map((strategy: string, index: number) => (
            <li key={index}>{strategy}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}