import { Demand, PressureEntry, EscalationStage } from '@/types';

export function calculatePressureScore(demands: Demand[]): number {
  if (demands.length === 0) return 0;
  const totalSigners = demands.reduce((sum, d) => sum + (d.coSignCount || 0), 0);
  const activeDemands = demands.filter(d => d.status === 'active').length;
  // Velocity: average age-weighted co-signers (newer demands weigh more)
  const velocity = demands.reduce((sum, d) => {
    const daysOld = d.createdAt ? Math.max(1, (Date.now() - new Date(d.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 30;
    return sum + (d.coSignCount || 0) / daysOld;
  }, 0);
  return Math.round(totalSigners * 0.4 + activeDemands * 100 * 0.3 + velocity * 50 * 0.3);
}

export function getEscalationStage(coSignCount: number): EscalationStage {
  if (coSignCount >= 100000) return 'crisis';
  if (coSignCount >= 10000) return 'movement';
  if (coSignCount >= 1000) return 'campaign';
  return 'petition';
}

export function getEscalationProgress(coSignCount: number): number {
  if (coSignCount >= 100000) return 100;
  if (coSignCount >= 10000) return 75 + (coSignCount - 10000) / 90000 * 25;
  if (coSignCount >= 1000) return 50 + (coSignCount - 1000) / 9000 * 25;
  return Math.min(50, (coSignCount / 1000) * 50);
}

export function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

export function buildPressureBoard(demandsByCompany: Record<string, Demand[]>): PressureEntry[] {
  const entries: PressureEntry[] = Object.entries(demandsByCompany).map(([company, demands]) => ({
    companyName: company,
    pressureScore: calculatePressureScore(demands),
    activeDemands: demands.filter(d => d.status === 'active').length,
    totalCoSigners: demands.reduce((sum, d) => sum + (d.coSignCount || 0), 0),
    velocity: demands.reduce((sum, d) => {
      const daysOld = d.createdAt ? Math.max(1, (Date.now() - new Date(d.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 30;
      return sum + (d.coSignCount || 0) / daysOld;
    }, 0),
    rank: 0,
    change: 'same' as const,
  }));
  entries.sort((a, b) => b.pressureScore - a.pressureScore);
  entries.forEach((e, i) => { e.rank = i + 1; });
  return entries;
}
