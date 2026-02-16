import { Demand, CompanyProfile } from '@/types';

interface DemandIntelligenceScore {
  overallScore: number;
  potentialImpact: 'Low' | 'Medium' | 'High' | 'Transformative';
  negotiationReadiness: number;
  corporateVulnerability: number;
  mediaInterestPotential: number;
  recommendedStrategies: string[];
}

export class DemandIntelligence {
  private demand: Demand;
  private companyProfile: CompanyProfile;

  constructor(demand: Demand, companyProfile: CompanyProfile) {
    this.demand = demand;
    this.companyProfile = companyProfile;
  }

  // Core intelligence generation
  analyzeDemandsIntelligence(): DemandIntelligenceScore {
    const impactFactors = [
      this.calculateCorporateVulnerability(),
      this.assessMediaInterestPotential(),
      this.evaluateNegotiationReadiness(),
      this.calculateCoSignerInfluence()
    ];

    const overallScore = this.computeWeightedScore(impactFactors);
    
    return {
      overallScore,
      potentialImpact: this.determinePotentialImpact(overallScore),
      negotiationReadiness: impactFactors[2],
      corporateVulnerability: impactFactors[0],
      mediaInterestPotential: impactFactors[1],
      recommendedStrategies: this.generateStrategicRecommendations(overallScore)
    };
  }

  private calculateCorporateVulnerability(): number {
    // Analyze company's past responses, controversies, public perception
    const controversiesCount = this.companyProfile.controversies.length;
    const donationVolatility = this.computeDonationVolatility();
    
    return Math.min(
      (controversiesCount * 20) + 
      (donationVolatility * 15) + 
      (this.demand.coSignCount * 2),
      100
    );
  }

  private computeDonationVolatility(): number {
    // Analyze political donation patterns for potential leverage
    const donations = this.companyProfile.politicalDonations;
    if (donations.length === 0) return 0;

    const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0);
    const yearSpread = new Set(donations.map(d => d.year)).size;
    
    return Math.min((totalDonations / 10000) * (yearSpread * 5), 50);
  }

  private assessMediaInterestPotential(): number {
    const keywordScore = this.computeKeywordImpact();
    const coSignerReach = Math.min(this.demand.coSignCount * 3, 30);
    
    return Math.min(keywordScore + coSignerReach, 100);
  }

  private computeKeywordImpact(): number {
    const impactKeywords = [
      'child labor', 'environmental damage', 'discrimination', 
      'worker rights', 'climate change', 'privacy violation'
    ];

    return impactKeywords.reduce((score, keyword) => {
      return this.demand.description.toLowerCase().includes(keyword) 
        ? score + 15 
        : score;
    }, 0);
  }

  private evaluateNegotiationReadiness(): number {
    const successCriteriaClarity = this.demand.successCriteria.split('.').length * 10;
    const spokespersonQuality = this.demand.currentSpokespersonId ? 20 : 0;
    
    return Math.min(successCriteriaClarity + spokespersonQuality, 100);
  }

  private calculateCoSignerInfluence(): number {
    // More diverse/influential co-signers increase score
    return Math.min(this.demand.coSignCount * 3, 40);
  }

  private computeWeightedScore(factors: number[]): number {
    const weights = [0.3, 0.2, 0.3, 0.2];
    return factors.reduce((score, factor, index) => score + (factor * weights[index]), 0);
  }

  private determinePotentialImpact(score: number): DemandIntelligenceScore['potentialImpact'] {
    if (score < 25) return 'Low';
    if (score < 50) return 'Medium';
    if (score < 75) return 'High';
    return 'Transformative';
  }

  private generateStrategicRecommendations(score: number): string[] {
    const baseStrategies = [
      'Build coalition with advocacy groups',
      'Leverage social media amplification',
      'Prepare detailed media kit',
      'Identify key corporate decision-makers'
    ];

    const advancedStrategies = [
      'Orchestrate coordinated investor pressure',
      'Target corporate leadership on LinkedIn',
      'Develop multimedia campaign',
      'Prepare legal strategy documentation'
    ];

    return score > 50 
      ? [...baseStrategies, ...advancedStrategies]
      : baseStrategies;
  }
}