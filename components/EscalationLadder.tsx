'use client';

import { ESCALATION_THRESHOLDS } from '@/types';
import { getEscalationStage, getEscalationProgress, formatNumber } from '@/lib/pressure';

interface Props {
  coSignCount: number;
}

export default function EscalationLadder({ coSignCount }: Props) {
  const currentStage = getEscalationStage(coSignCount);
  const progress = getEscalationProgress(coSignCount);
  const stages = Object.entries(ESCALATION_THRESHOLDS) as [string, typeof ESCALATION_THRESHOLDS.petition][];
  const currentIdx = stages.findIndex(([key]) => key === currentStage);

  return (
    <div className="bg-[#1a1a1a] border border-[#222222] rounded-xl p-6">
      <h3 className="text-sm font-medium text-[#666666] uppercase tracking-wider mb-4">Escalation Ladder</h3>
      
      {/* Progress bar */}
      <div className="h-3 bg-[#222222] rounded-full overflow-hidden mb-6 relative">
        <div className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-[#a0a0a0] via-[#f59e0b] via-[#ef4444] to-[#00aaff]"
          style={{ width: `${progress}%` }} />
        {/* Stage markers */}
        {[25, 50, 75].map(pos => (
          <div key={pos} className="absolute top-0 h-full w-0.5 bg-[#333333]" style={{ left: `${pos}%` }} />
        ))}
      </div>

      {/* Stages */}
      <div className="grid grid-cols-4 gap-2">
        {stages.map(([key, stage], i) => {
          const isActive = i <= currentIdx;
          const isCurrent = key === currentStage;
          return (
            <div key={key} className={`text-center p-3 rounded-lg transition-all ${
              isCurrent ? 'bg-[#00aaff]/10 border border-[#00aaff]/20' : isActive ? 'opacity-100' : 'opacity-40'
            }`}>
              <div className="text-2xl mb-1">{stage.icon}</div>
              <div className={`text-xs font-bold uppercase tracking-wider ${isCurrent ? 'text-[#00aaff]' : 'text-[#a0a0a0]'}`}>
                {stage.label}
              </div>
              <div className="text-[10px] text-[#666666] mt-1">
                {stage.max === Infinity ? `${formatNumber(stage.min)}+` : `${formatNumber(stage.min)}-${formatNumber(stage.max)}`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Current status */}
      <div className="mt-4 text-center">
        <span className="text-sm text-[#a0a0a0]">
          {currentStage === 'petition' && coSignCount < 1000 && `${formatNumber(1000 - coSignCount)} more co-signers to reach Campaign stage`}
          {currentStage === 'campaign' && `${formatNumber(10000 - coSignCount)} more to reach Movement stage — unlock press release tools`}
          {currentStage === 'movement' && `${formatNumber(100000 - coSignCount)} more to reach Crisis stage — board-level response required`}
          {currentStage === 'crisis' && '🔥 CRISIS LEVEL — This demand requires board-level corporate response'}
        </span>
      </div>
    </div>
  );
}
