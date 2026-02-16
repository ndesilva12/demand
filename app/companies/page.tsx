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
    <div className="min-h-screen bg-surface-deep">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-2xl font-bold text-brand">demand</Link>
          <Link href="/demands" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
            View All Demands
          </Link>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-3">Company Directory</h1>
          <p className="text-text-secondary">
            Research companies, view their political donations, controversies, and active demands against them.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="bg-surface-raised border border-border-subtle rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-surface-overlay border border-border-default rounded-lg text-text-primary placeholder-text-muted focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
              />
            </div>
            <div>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full px-4 py-3 bg-surface-overlay border border-border-default rounded-lg text-text-primary focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
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
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-brand border-t-transparent"></div>
            <p className="text-text-muted mt-4">Loading companies...</p>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="bg-surface-raised border border-border-subtle rounded-xl p-12 text-center">
            <p className="text-text-muted mb-2">No companies found</p>
            <p className="text-text-muted text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCompanies.map((company) => {
              const totalDonations = company.politicalDonations?.reduce((sum, d) => sum + d.amount, 0) || 0;
              
              return (
                <Link
                  key={company.name}
                  href={`/companies/${encodeURIComponent(company.name)}`}
                  className="block bg-surface-raised border border-border-subtle hover:border-brand rounded-xl p-6 transition-all group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-text-primary group-hover:text-brand transition-colors mb-1">
                        {company.name}
                      </h3>
                      <span className="text-xs px-2 py-1 bg-brand/10 text-brand border border-brand/20 rounded-full">
                        {company.industry}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                    {company.description}
                  </p>

                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border-subtle">
                    <div className="text-center">
                      <div className="text-brand font-bold">{company.activeDemands?.length || 0}</div>
                      <div className="text-text-muted text-xs">Demands</div>
                    </div>
                    <div className="text-center">
                      <div className="text-warning font-bold">
                        ${totalDonations > 1000000 ? `${(totalDonations / 1000000).toFixed(1)}M` : `${(totalDonations / 1000).toFixed(0)}K`}
                      </div>
                      <div className="text-text-muted text-xs">Donations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-danger font-bold">{company.controversies?.length || 0}</div>
                      <div className="text-text-muted text-xs">Issues</div>
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
