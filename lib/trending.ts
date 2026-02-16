import { Demand } from '@/types';

export interface TrendingScore {
  demandId: string;
  score: number;
  coSignVelocity: number;
  recencyScore: number;
}

/**
 * Calculate trending score for a demand
 * Formula: (coSigns * 2) + (recencyScore * 0.5) + (velocity * 3)
 * 
 * - Co-signs: More signatures = higher score
 * - Recency: Newer demands get boost
 * - Velocity: Rapidly growing demands get highest boost
 */
export function calculateTrendingScore(demand: Demand): number {
  const now = Date.now();
  const createdMs = demand.createdAt ? demand.createdAt.getTime() : now;
  const ageInDays = (now - createdMs) / (1000 * 60 * 60 * 24);
  
  // Recency score: decreases over time (1.0 for today, 0.5 for 7 days, 0.1 for 30 days)
  const recencyScore = Math.max(0, 1 - (ageInDays / 30));
  
  // Velocity: co-signs per day
  const velocity = ageInDays > 0 ? (demand.coSignCount || 0) / ageInDays : 0;
  
  // Combined score
  const score = (demand.coSignCount || 0) * 2 + recencyScore * 50 + velocity * 100;
  
  return score;
}

/**
 * Sort demands by trending score
 */
export function sortByTrending(demands: Demand[]): Demand[] {
  return [...demands].sort((a, b) => {
    const scoreA = calculateTrendingScore(a);
    const scoreB = calculateTrendingScore(b);
    return scoreB - scoreA;
  });
}

/**
 * Get top trending demands
 */
export function getTopTrending(demands: Demand[], limit: number = 10): Demand[] {
  const activeDemands = demands.filter(d => d.status === 'active');
  return sortByTrending(activeDemands).slice(0, limit);
}

/**
 * Calculate heat level for visualization
 */
export function getHeatLevel(demand: Demand): 'cold' | 'warm' | 'hot' | 'fire' {
  const score = calculateTrendingScore(demand);
  if (score >= 500) return 'fire';
  if (score >= 200) return 'hot';
  if (score >= 50) return 'warm';
  return 'cold';
}
