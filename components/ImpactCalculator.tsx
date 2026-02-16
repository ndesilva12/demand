'use client';

import { useState } from 'react';
import { Demand } from '@/types';

interface ImpactCalculatorProps {
  demand: Demand;
}

export default function ImpactCalculator({ demand }: ImpactCalculatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Estimate impact based on co-signers and target company
  const coSigners = demand.coSignCount || 0;
  
  // Average household spending estimate
  const avgAnnualSpending = 5000; // $5K per household average
  const boycottEffectiveness = 0.3; // 30% actually follow through
  
  // Economic impact
  const potentialRevenueLoss = coSigners * avgAnnualSpending * boycottEffectiveness;
  const weeklyImpact = potentialRevenueLoss / 52;
  
  // Social impact
  const socialReach = coSigners * 150; // Average social media reach per person
  const pressMultiplier = Math.log10(coSigners + 1) * 2;
  
  // Media attention threshold
  const mediaAttention = 
    coSigners >= 10000 ? 'National Media Coverage' :
    coSigners >= 5000 ? 'Regional Media Likely' :
    coSigners >= 1000 ? 'Local Media Interest' :
    coSigners >= 100 ? 'Social Media Buzz' :
    'Building Momentum';

  return (
    <div className="bg-surface-raised border border-border-subtle rounded-xl p-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center"
      >
        <h3 className="text-lg font-bold text-text-primary uppercase tracking-wider">
          📊 Impact Calculator
        </h3>
        <span className="text-brand text-2xl">{isExpanded ? '−' : '+'}</span>
      </button>

      {isExpanded && (
        <div className="mt-6 space-y-4">
          <p className="text-text-secondary text-sm">
            Estimated economic and social impact if this demand continues to grow:
          </p>

          {/* Economic Impact */}
          <div className="bg-surface-overlay border border-border-default rounded-lg p-4">
            <div className="text-xs text-text-muted uppercase tracking-wider mb-2">Economic Pressure</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold text-brand">
                  ${(potentialRevenueLoss / 1000000).toFixed(2)}M
                </div>
                <div className="text-text-muted text-xs">Potential Annual Revenue Impact</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-warning">
                  ${(weeklyImpact / 1000).toFixed(0)}K
                </div>
                <div className="text-text-muted text-xs">Per Week</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-text-muted">
              Based on {coSigners} co-signers × ${avgAnnualSpending.toLocaleString()} avg spending × {(boycottEffectiveness * 100).toFixed(0)}% participation rate
            </div>
          </div>

          {/* Social Impact */}
          <div className="bg-surface-overlay border border-border-default rounded-lg p-4">
            <div className="text-xs text-text-muted uppercase tracking-wider mb-2">Social Reach</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold text-brand">
                  {(socialReach / 1000000).toFixed(2)}M
                </div>
                <div className="text-text-muted text-xs">Estimated Social Impressions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-success">
                  {pressMultiplier.toFixed(1)}x
                </div>
                <div className="text-text-muted text-xs">Pressure Multiplier</div>
              </div>
            </div>
          </div>

          {/* Media Attention */}
          <div className="bg-gradient-to-r from-brand/10 to-brand-dark/10 border border-brand/30 rounded-lg p-4">
            <div className="text-xs text-brand uppercase tracking-wider mb-2">Media Attention Level</div>
            <div className="text-xl font-bold text-text-primary mb-2">{mediaAttention}</div>
            <div className="h-2 bg-surface-overlay rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-brand to-brand-dark transition-all duration-500"
                style={{ width: `${Math.min((coSigners / 10000) * 100, 100)}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-text-muted">
              {coSigners >= 10000 
                ? '🎯 Maximum visibility reached!' 
                : `${(10000 - coSigners).toLocaleString()} more co-signers until national media threshold`}
            </div>
          </div>

          {/* Growth Projection */}
          {demand.createdAt && coSigners > 0 && (
            <div className="bg-surface-overlay border border-border-default rounded-lg p-4">
              <div className="text-xs text-text-muted uppercase tracking-wider mb-2">Growth Velocity</div>
              {(() => {
                const daysActive = Math.max(1, Math.floor((Date.now() - demand.createdAt.getTime()) / (1000 * 60 * 60 * 24)));
                const dailyGrowth = coSigners / daysActive;
                const projectedIn30Days = coSigners + (dailyGrowth * 30);
                
                return (
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-text-secondary text-sm">Current daily growth:</span>
                      <span className="text-brand font-semibold">{dailyGrowth.toFixed(1)} co-signers/day</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary text-sm">Projected in 30 days:</span>
                      <span className="text-success font-semibold">{Math.floor(projectedIn30Days).toLocaleString()} total</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Disclaimer */}
          <div className="text-xs text-text-muted italic">
            * Estimates based on industry averages and historical campaign data. Actual impact may vary.
          </div>
        </div>
      )}
    </div>
  );
}
