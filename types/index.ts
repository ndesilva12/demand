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