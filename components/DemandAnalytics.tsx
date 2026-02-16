'use client';

import { Demand } from '@/types';
import { getEscalationStage, formatNumber } from '@/lib/pressure';
import { ESCALATION_THRESHOLDS } from '@/types';

interface Props {
  demand: Demand;
}

export default function DemandAnalytics({ demand }: Props) {
  const coSignCount = demand.coSignCount || 0;
  const daysActive = demand.createdAt ? Math.max(1, Math.floor((Date.now() - new Date(demand.createdAt).getTime()) / (1000 * 60 * 60 * 24))) : 1;
  const dailyRate = coSignCount / daysActive;
  const stage = getEscalationStage(coSignCount);
  const stageInfo = ESCALATION_THRESHOLDS[stage];
  
  // Projections
  const daysTo1k = coSignCount >= 1000 ? 0 : dailyRate > 0 ? Math.ceil((1000 - coSignCount) / dailyRate) : null;
  const daysTo10k = coSignCount >= 10000 ? 0 : dailyRate > 0 ? Math.ceil((10000 - coSignCount) / dailyRate) : null;
  const daysTo100k = coSignCount >= 100000 ? 0 : dailyRate > 0 ? Math.ceil((100000 - coSignCount) / dailyRate) : null;

  // Simulated growth chart (7 data points)
  const chartPoints = Array.from({ length: 7 }, (_, i) => {
    const fraction = i / 6;
    // Simulate S-curve growth
    const simulated = Math.round(coSignCount * (fraction * 0.3 + fraction * fraction * 0.7));
    return simulated;
  });
  const maxChart = Math.max(...chartPoints, 1);

  return (
    <div className="bg-[#1a1a1a] border border-[#222222] rounded-xl p-6">
      <h3 className="text-sm font-medium text-[#666666] uppercase tracking-wider mb-4">📊 Campaign Analytics</h3>
      
      {/* Key metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Daily Growth', value: `+${dailyRate.toFixed(1)}`, sub: 'per day' },
          { label: 'Total Reach', value: formatNumber(coSignCount * 15), sub: 'est. social reach' },
          { label: 'Stage', value: stageInfo.icon, sub: stageInfo.label },
          { label: 'Days Active', value: daysActive.toString(), sub: 'running' },
        ].map(m => (
          <div key={m.label} className="bg-[#0a0a0a] rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-[#00aaff]">{m.value}</div>
            <div className="text-[10px] text-[#666666] uppercase tracking-wider">{m.label}</div>
            <div className="text-[10px] text-[#444444]">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Mini chart */}
      <div className="mb-6">
        <div className="text-xs text-[#666666] mb-2">Growth Trend</div>
        <div className="flex items-end gap-1 h-16">
          {chartPoints.map((val, i) => (
            <div key={i} className="flex-1 bg-[#00aaff]/20 rounded-t relative group" 
              style={{ height: `${Math.max(4, (val / maxChart) * 100)}%` }}>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#0a0a0a] text-[#00aaff] text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {formatNumber(val)}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-[#444444] mt-1">
          <span>Start</span><span>Now</span>
        </div>
      </div>

      {/* Projections */}
      {dailyRate > 0 && (
        <div>
          <div className="text-xs text-[#666666] mb-2">Projected Milestones (at current rate)</div>
          <div className="space-y-2">
            {[
              { target: '1K', days: daysTo1k, reached: coSignCount >= 1000 },
              { target: '10K', days: daysTo10k, reached: coSignCount >= 10000 },
              { target: '100K', days: daysTo100k, reached: coSignCount >= 100000 },
            ].map(p => (
              <div key={p.target} className="flex items-center justify-between text-sm">
                <span className="text-[#a0a0a0]">{p.target} co-signers</span>
                <span className={p.reached ? 'text-[#22c55e] font-medium' : 'text-[#666666]'}>
                  {p.reached ? '✅ Reached' : p.days ? `~${p.days} days` : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
