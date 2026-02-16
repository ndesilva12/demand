'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CompanyProfile } from '@/types';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const companiesRef = collection(db, 'companies');
        const snapshot = await getDocs(companiesRef);
        const fetchedCompanies = snapshot.docs.map(doc => ({
          ...doc.data(),
        })) as CompanyProfile[];
        setCompanies(fetchedCompanies);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const industries = ['all', ...Array.from(new Set(companies.map(c => c.industry)))];

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = selectedIndustry === 'all' || company.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Company Directory</h1>
          <p className="text-[#a0a0a0]">
            Research companies, view their political donations, controversies, and active demands against them.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="bg-[#1a1a1a] border border-[#1e1e1e] rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-[#222222] border border-[#2a2a2a] rounded-lg text-white placeholder-text-muted focus:border-[#00aaff] focus:ring-2 focus:ring-[#00aaff]/20 transition-all"
              />
            </div>
            <div>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full px-4 py-3 bg-[#222222] border border-[#2a2a2a] rounded-lg text-white focus:border-[#00aaff] focus:ring-2 focus:ring-[#00aaff]/20 transition-all"
              >
                {industries.map(industry => (
                  <option key={industry} value={industry}>
                    {industry === 'all' ? 'All Industries' : industry}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-[#1a1a1a] border border-[#1e1e1e] rounded-xl p-6">
                <div className="skeleton h-6 w-40 rounded mb-2" />
                <div className="skeleton h-4 w-24 rounded-full mb-3" />
                <div className="skeleton h-4 w-full rounded mb-2" />
                <div className="skeleton h-4 w-3/4 rounded" />
              </div>
            ))}
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="bg-[#1a1a1a] border border-[#1e1e1e] rounded-xl p-12 text-center">
            <p className="text-[#666666] mb-2">No companies found</p>
            <p className="text-[#666666] text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCompanies.map((company) => {
              const totalDonations = company.politicalDonations?.reduce((sum, d) => sum + d.amount, 0) || 0;
              
              return (
                <Link
                  key={company.name}
                  href={`/companies/${encodeURIComponent(company.name)}`}
                  className="block bg-[#1a1a1a] border border-[#1e1e1e] hover:border-[#00aaff]/30 rounded-xl p-4 sm:p-6 transition-all group card-hover"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-[#00aaff] transition-colors mb-1">
                        {company.name}
                      </h3>
                      <span className="text-xs px-2 py-1 bg-[#00aaff]/10 text-[#00aaff] border border-[#00aaff]/20 rounded-full">
                        {company.industry}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-[#a0a0a0] text-sm mb-4 line-clamp-2">
                    {company.description}
                  </p>

                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#1e1e1e]">
                    <div className="text-center">
                      <div className="text-[#00aaff] font-bold">{company.activeDemands?.length || 0}</div>
                      <div className="text-[#666666] text-xs">Demands</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[#f59e0b] font-bold">
                        ${totalDonations > 1000000 ? `${(totalDonations / 1000000).toFixed(1)}M` : `${(totalDonations / 1000).toFixed(0)}K`}
                      </div>
                      <div className="text-[#666666] text-xs">Donations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[#ef4444] font-bold">{company.controversies?.length || 0}</div>
                      <div className="text-[#666666] text-xs">Issues</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
