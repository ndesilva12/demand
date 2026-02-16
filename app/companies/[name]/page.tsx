'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Demand, CompanyProfile } from '@/types';

export default function CompanyProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);
  const companyName = decodeURIComponent(params.name as string);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        // Try to fetch company profile
        const companyRef = doc(db, 'companies', companyName);
        const companySnap = await getDoc(companyRef);
        
        if (companySnap.exists()) {
          setCompany(companySnap.data() as CompanyProfile);
        } else {
          // Create basic profile if doesn't exist
          const basicProfile: CompanyProfile = {
            name: companyName,
            description: 'Profile pending completion',
            industry: 'Unknown',
            politicalDonations: [],
            controversies: [],
            activeDemands: [],
            responseRate: 0,
          };
          setCompany(basicProfile);
        }

        // Fetch demands targeting this company
        const demandsRef = collection(db, 'demands');
        const q = query(
          demandsRef,
          where('targetCompany', '==', companyName),
          where('status', 'in', ['active', 'negotiation'])
        );
        const querySnapshot = await getDocs(q);
        const fetchedDemands = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as Demand[];
        
        setDemands(fetchedDemands.sort((a, b) => (b.coSignCount || 0) - (a.coSignCount || 0)));
      } catch (error) {
        console.error('Error fetching company:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [companyName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-pulse text-[#666666]">Loading company profile...</div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#666666]">Company not found</div>
      </div>
    );
  }

  const totalDonations = company.politicalDonations?.reduce((sum, d) => sum + d.amount, 0) || 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#666666] mb-6">
          <Link href="/companies" className="hover:text-[#00aaff]">Companies</Link>
          <span>›</span>
          <span className="text-[#a0a0a0]">Profile</span>
        </div>

        {/* Company Header */}
        <div className="bg-[#1a1a1a] border border-[#1e1e1e] rounded-xl p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{company.name}</h1>
              <div className="flex items-center gap-4 text-sm">
                <span className="px-3 py-1 bg-[#00aaff]/10 text-[#00aaff] border border-[#00aaff]/20 rounded-full">
                  {company.industry}
                </span>
                <span className="text-[#666666]">
                  Response Rate: <span className={company.responseRate > 50 ? 'text-[#22c55e]' : 'text-[#ef4444]'}>
                    {company.responseRate}%
                  </span>
                </span>
              </div>
            </div>
          </div>
          <p className="text-[#a0a0a0] leading-relaxed">{company.description}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-[#1a1a1a] border border-[#1e1e1e] rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-[#00aaff]">{demands.length}</div>
            <div className="text-[#666666] text-sm mt-1 uppercase tracking-wider">Active Demands</div>
          </div>
          <div className="bg-[#1a1a1a] border border-[#1e1e1e] rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-[#f59e0b]">
              ${(totalDonations / 1000000).toFixed(1)}M
            </div>
            <div className="text-[#666666] text-sm mt-1 uppercase tracking-wider">Political Donations</div>
          </div>
          <div className="bg-[#1a1a1a] border border-[#1e1e1e] rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-[#ef4444]">{company.controversies?.length || 0}</div>
            <div className="text-[#666666] text-sm mt-1 uppercase tracking-wider">Known Controversies</div>
          </div>
        </div>

        {/* Active Demands */}
        <div className="bg-[#1a1a1a] border border-[#1e1e1e] rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4 uppercase tracking-wider">
            🎯 Active Demands Against {company.name}
          </h2>
          {demands.length === 0 ? (
            <p className="text-[#666666] text-center py-8">No active demands yet</p>
          ) : (
            <div className="space-y-3">
              {demands.map((demand) => (
                <Link
                  key={demand.id}
                  href={`/demands/${demand.id}`}
                  className="block p-4 bg-[#222222] border border-[#1e1e1e] hover:border-[#00aaff] rounded-lg transition-all group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold group-hover:text-[#00aaff] transition-colors mb-1">
                        {demand.title}
                      </h3>
                      <p className="text-[#666666] text-sm line-clamp-2">{demand.description}</p>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-[#00aaff] font-bold text-lg">{demand.coSignCount || 0}</div>
                      <div className="text-[#666666] text-xs">co-signers</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Political Donations */}
        {company.politicalDonations && company.politicalDonations.length > 0 && (
          <div className="bg-[#1a1a1a] border border-[#1e1e1e] rounded-xl p-6 mb-6">
            <h2 className="text-lg font-bold text-[#f59e0b] mb-4 uppercase tracking-wider">
              💰 Political Donations
            </h2>
            <div className="space-y-3">
              {company.politicalDonations.map((donation, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-[#222222] rounded-lg">
                  <div>
                    <div className="text-white font-semibold">{donation.recipient}</div>
                    <div className="text-[#666666] text-xs">{donation.year}</div>
                  </div>
                  <div className="text-[#f59e0b] font-bold">
                    ${(donation.amount / 1000).toFixed(0)}K
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Controversies */}
        {company.controversies && company.controversies.length > 0 && (
          <div className="bg-[#1a1a1a] border border-[#1e1e1e] rounded-xl p-6">
            <h2 className="text-lg font-bold text-[#ef4444] mb-4 uppercase tracking-wider">
              ⚠️ Known Controversies
            </h2>
            <div className="space-y-4">
              {company.controversies.map((controversy, idx) => (
                <div key={idx} className="p-4 bg-[#222222] border border-[#1e1e1e] rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-semibold">{controversy.title}</h3>
                    <span className="text-[#666666] text-xs">{controversy.year}</span>
                  </div>
                  <p className="text-[#a0a0a0] text-sm mb-3">{controversy.description}</p>
                  {controversy.sources && controversy.sources.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {controversy.sources.map((source, sIdx) => (
                        <a
                          key={sIdx}
                          href={source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#00aaff] hover:underline"
                        >
                          Source {sIdx + 1} →
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Corporate Response Portal */}
        <div className="mt-6 bg-gradient-to-r from-[#00aaff]/10 to-[#0088cc]/10 border border-[#00aaff]/30 rounded-xl p-6">
          <h2 className="text-lg font-bold text-[#00aaff] mb-2 uppercase tracking-wider">
            🏢 Are you from {company.name}?
          </h2>
          <p className="text-[#a0a0a0] mb-4">
            Companies can respond to demands directly on this platform. Build trust through transparency and dialogue.
          </p>
          <button className="px-6 py-2 bg-[#00aaff] hover:bg-[#0088cc] text-white font-semibold rounded-lg transition-all">
            Official Company Response Portal →
          </button>
        </div>
      </div>
    </div>
  );
}
