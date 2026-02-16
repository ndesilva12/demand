export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  reputation?: number;
  verifiedStatus?: 'unverified' | 'verified' | 'trusted';
}

export interface SpokespersonVote {
  userId: string;
  vote: 'approve' | 'reject';
  timestamp: Date;
}

export interface DemandNegotiation {
  id: string;
  demandId: string;
  companyName: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'stalled';
  initiatedBy: 'company' | 'spokesperson';
  messages: {
    sender: 'company' | 'spokesperson';
    message: string;
    timestamp: Date;
  }[];
}

export interface Demand {
  id: string;
  title: string;
  description: string;
  targetCompany: string;
  successCriteria: string;
  
  // Core demand metadata
  creatorId: string;
  creatorName: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Spokesperson system
  currentSpokespersonId: string;
  spokespersonNominationDate?: Date;
  spokespersonVotes: SpokespersonVote[];
  spokespersonVotingOpen: boolean;
  spokespersonVotingEndDate?: Date;
  
  // Demand status
  status: 'draft' | 'active' | 'negotiation' | 'met' | 'closed';
  visibility: 'public' | 'private';
  
  // Collaboration
  coSigners: string[];
  coSignCount: number;
  
  // Negotiations
  activeNegotiations: string[]; // IDs of DemandNegotiation
  
  // Metadata
  tags?: string[];
}

// Coalition System
export interface Coalition {
  id: string;
  name: string;
  description: string;
  demandIds: string[];
  targetCompanies: string[];
  creatorId: string;
  creatorName: string;
  createdAt: Date;
  updatedAt: Date;
  totalCoSigners: number;
  pressureScore: number;
  tags?: string[];
}

// Escalation Ladder
export type EscalationStage = 'petition' | 'campaign' | 'movement' | 'crisis';
export const ESCALATION_THRESHOLDS = {
  petition: { min: 0, max: 1000, label: 'Petition', icon: '📋', color: '#a0a0a0' },
  campaign: { min: 1000, max: 10000, label: 'Campaign', icon: '📢', color: '#f59e0b' },
  movement: { min: 10000, max: 100000, label: 'Movement', icon: '🔥', color: '#ef4444' },
  crisis: { min: 100000, max: Infinity, label: 'Crisis', icon: '⚡', color: '#00aaff' },
};

// Corporate Response
export interface CorporateResponse {
  id: string;
  companyName: string;
  demandId: string;
  responderId: string;
  responderTitle: string;
  message: string;
  createdAt: Date;
  ratings: { userId: string; rating: 'accepted' | 'rejected' | 'insufficient' }[];
  acceptCount: number;
  rejectCount: number;
  insufficientCount: number;
}

// Demand Fork
export interface DemandFork {
  id: string;
  originalDemandId: string;
  forkedDemandId: string;
  reason: string;
  creatorId: string;
  creatorName: string;
  createdAt: Date;
}

// Pressure Score
export interface PressureEntry {
  companyName: string;
  pressureScore: number;
  activeDemands: number;
  totalCoSigners: number;
  velocity: number;
  rank: number;
  change: 'up' | 'down' | 'same';
}

// Weekly Digest
export interface WeeklyDigest {
  id: string;
  weekStart: Date;
  weekEnd: Date;
  newDemands: number;
  totalCoSigners: number;
  topDemands: { id: string; title: string; coSignCount: number }[];
  corporateResponses: number;
  victories: number;
  trendingCompanies: string[];
  createdAt: Date;
}

export interface CompanyProfile {
  name: string;
  description: string;
  industry: string;
  politicalDonations: {
    recipient: string;
    amount: number;
    year: number;
  }[];
  controversies: {
    title: string;
    description: string;
    year: number;
    sources: string[];
  }[];
  activeDemands: string[]; // Demand IDs
  responseRate: number; // Percentage of demands responded to
}