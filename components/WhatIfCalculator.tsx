'use client';

import { useState } from 'react';
import { formatNumber } from '@/lib/pressure';

// Rough annual revenue / customer estimates for major companies
const COMPANY_DATA: Record<string, { customers: number; revenue: number; avgSpend: number }> = {
  'Ticketmaster': { customers: 70000000, revenue: 11200000000, avgSpend: 160 },
  'Live Nation': { customers: 70000000, revenue: 22700000000, avgSpend: 324 },
  'Amazon': { customers: 310000000, revenue: 574800000000, avgSpend: 1854 },
  'Apple': { customers: 1200000000, revenue: 383300000000, avgSpend: 319 },
  'Google': { customers: 2000000000, revenue: 307400000000, avgSpend: 154 },
  'Meta': { customers: 3000000000, revenue: 134900000000, avgSpend: 45 },
  'Netflix': { customers: 260000000, revenue: 33700000000, avgSpend: 130 },
  'Uber': { customers: 130000000, revenue: 37300000000, avgSpend: 287 },
  'Walmart': { customers: 240000000, revenue: 648100000000, avgSpend: 2700 },
  'Disney': { customers: 160000000, revenue: 88900000000, avgSpend: 556 },
};

interface Props {
  companyName?: string;
}

export default function WhatIfCalculator({ companyName }: Props) {
  const [company, setCompany] = useState(companyName || '');
  const [boycottPercent, setBoycottPercent] = useState(5);
  
  const data = COMPANY_DATA[company];
  const customCustomers = 10000000; // default 10M if unknown
  const customRevenue = 5000000000;
  
  const customers = data?.customers || customCustomers;
  const revenue = data?.revenue || customRevenue;
  const avgSpend = data?.avgSpend || (revenue / customers);
  
  const boycotters = Math.round(customers * (boycottPercent / 100));
  const lostRevenue = Math.round(boycotters * avgSpend);
  const lostRevenuePercent = (lostRevenue / revenue) * 100;

  return (
    <div className="bg-[#1a1a1a] border border-[#222222] rounded-xl p-6">
      <h3 className="text-sm font-medium text-[#666666] uppercase tracking-wider mb-4">💰 &quot;What If&quot; Calculator</h3>
      <p className="text-[#a0a0a0] text-sm mb-4">See the financial impact if customers act on this demand.</p>
      
      <div className="space-y-4">
        {!companyName && (
          <div>
            <label className="text-xs text-[#666666] mb-1 block">Company</label>
            <select value={company} onChange={e => setCompany(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-4 py-2 text-white text-sm focus:border-[#00aaff] focus:outline-none">
              <option value="">Select a company...</option>
              {Object.keys(COMPANY_DATA).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}
        
        <div>
          <label className="text-xs text-[#666666] mb-1 block">
            Boycott percentage: <span className="text-[#00aaff] font-bold">{boycottPercent}%</span>
          </label>
          <input type="range" min="1" max="50" value={boycottPercent}
            onChange={e => setBoycottPercent(parseInt(e.target.value))}
            className="w-full accent-[#00aaff]" />
          <div className="flex justify-between text-[10px] text-[#444444]">
            <span>1%</span><span>25%</span><span>50%</span>
          </div>
        </div>

        {(company || companyName) && (
          <div className="bg-gradient-to-br from-[#00aaff]/5 to-[#ef4444]/5 border border-[#00aaff]/20 rounded-xl p-5 mt-4">
            <div className="text-center mb-4">
              <div className="text-xs text-[#666666] uppercase tracking-wider mb-1">If {boycottPercent}% of customers act</div>
              <div className="text-3xl font-black text-[#ef4444]">
                -${formatNumber(lostRevenue)}
              </div>
              <div className="text-sm text-[#a0a0a0]">in lost annual revenue</div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-lg font-bold text-white">{formatNumber(boycotters)}</div>
                <div className="text-[10px] text-[#666666]">Boycotters</div>
              </div>
              <div>
                <div className="text-lg font-bold text-[#f59e0b]">{lostRevenuePercent.toFixed(1)}%</div>
                <div className="text-[10px] text-[#666666]">Revenue Hit</div>
              </div>
              <div>
                <div className="text-lg font-bold text-white">${formatNumber(avgSpend)}</div>
                <div className="text-[10px] text-[#666666]">Avg Spend/yr</div>
              </div>
            </div>
            
            {/* Shareable quote */}
            <div className="mt-4 p-3 bg-[#0a0a0a] rounded-lg border border-[#222222]">
              <p className="text-sm text-[#a0a0a0] italic">
                &quot;If just {boycottPercent}% of {company || companyName}&apos;s {formatNumber(customers)} customers boycott, that&apos;s ${formatNumber(lostRevenue)} in lost revenue — {lostRevenuePercent.toFixed(1)}% of their annual income.&quot;
              </p>
              <button onClick={() => navigator.clipboard?.writeText(
                `If just ${boycottPercent}% of ${company || companyName}'s ${formatNumber(customers)} customers boycott, that's $${formatNumber(lostRevenue)} in lost revenue. #Demand`
              )} className="text-[#00aaff] text-xs mt-2 hover:underline">📋 Copy to share</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
