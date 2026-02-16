export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
}

export interface Demand {
  id: string;
  title: string;
  description: string;
  targetCompany: string;
  successCriteria: string;
  creatorId: string;
  creatorName: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'met' | 'closed';
  coSigners: string[]; // array of user IDs
  coSignCount: number;
  tags?: string[];
  visibility: 'public' | 'private';
}

export interface MessageBoardPost {
  id: string;
  demandId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
  replies?: MessageBoardPost[];
}

export interface Edit {
  id: string;
  demandId: string;
  proposerId: string;
  proposerName: string;
  changes: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
  status: 'pending' | 'approved' | 'rejected';
  votes: {
    userId: string;
    vote: 'approve' | 'reject';
  }[];
  createdAt: Date;
}
