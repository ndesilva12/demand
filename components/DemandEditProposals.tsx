'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Demand } from '@/types';

interface EditProposal {
  id: string;
  demandId: string;
  proposerId: string;
  proposerName: string;
  field: 'title' | 'description' | 'successCriteria';
  currentValue: string;
  proposedValue: string;
  reason: string;
  approvalVotes: string[]; // user IDs
  rejectionVotes: string[]; // user IDs
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

interface DemandEditProposalsProps {
  demand: Demand;
  onDemandUpdate?: () => void;
}

export default function DemandEditProposals({ demand, onDemandUpdate }: DemandEditProposalsProps) {
  const { user } = useAuth();
  const [proposals, setProposals] = useState<EditProposal[]>([]);
  const [showProposeForm, setShowProposeForm] = useState(false);
  const [proposalField, setProposalField] = useState<'title' | 'description' | 'successCriteria'>('description');
  const [proposedValue, setProposedValue] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const isCoSigner = user && demand.coSigners?.includes(user.uid);
  const approvalThreshold = Math.ceil((demand.coSignCount || 1) * 0.6); // 60% approval needed

  useEffect(() => {
    fetchProposals();
  }, [demand.id]);

  const fetchProposals = async () => {
    try {
      const proposalsRef = collection(db, 'editProposals');
      const q = query(proposalsRef, where('demandId', '==', demand.id));
      const snapshot = await getDocs(q);
      
      const fetchedProposals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as EditProposal[];

      setProposals(fetchedProposals.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    } catch (error) {
      console.error('Error fetching proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isCoSigner || !proposedValue.trim() || !reason.trim()) return;

    setSubmitting(true);
    try {
      const proposalsRef = collection(db, 'editProposals');
      await addDoc(proposalsRef, {
        demandId: demand.id,
        proposerId: user.uid,
        proposerName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        field: proposalField,
        currentValue: demand[proposalField],
        proposedValue: proposedValue.trim(),
        reason: reason.trim(),
        approvalVotes: [user.uid], // Proposer auto-approves
        rejectionVotes: [],
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      // Award reputation for proposal
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        reputation: increment(10),
      });

      setProposedValue('');
      setReason('');
      setShowProposeForm(false);
      fetchProposals();
    } catch (error) {
      console.error('Error submitting proposal:', error);
      alert('Failed to submit proposal');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (proposalId: string, vote: 'approve' | 'reject') => {
    if (!user || !isCoSigner) return;

    try {
      const proposal = proposals.find(p => p.id === proposalId);
      if (!proposal) return;

      const hasApproved = proposal.approvalVotes.includes(user.uid);
      const hasRejected = proposal.rejectionVotes.includes(user.uid);
      
      if ((vote === 'approve' && hasApproved) || (vote === 'reject' && hasRejected)) return;

      const proposalRef = doc(db, 'editProposals', proposalId);
      const updates: any = {};

      if (vote === 'approve') {
        updates.approvalVotes = arrayUnion(user.uid);
        if (hasRejected) {
          // Remove from rejections
          const newRejections = proposal.rejectionVotes.filter(id => id !== user.uid);
          updates.rejectionVotes = newRejections;
        }
      } else {
        updates.rejectionVotes = arrayUnion(user.uid);
        if (hasApproved) {
          // Remove from approvals
          const newApprovals = proposal.approvalVotes.filter(id => id !== user.uid);
          updates.approvalVotes = newApprovals;
        }
      }

      await updateDoc(proposalRef, updates);

      // Check if threshold met
      const newApprovalCount = vote === 'approve' 
        ? (hasRejected ? proposal.approvalVotes.length + 1 : proposal.approvalVotes.length + (hasApproved ? 0 : 1))
        : (hasApproved ? proposal.approvalVotes.length - 1 : proposal.approvalVotes.length);

      if (newApprovalCount >= approvalThreshold) {
        // Approve the edit!
        await updateDoc(proposalRef, { status: 'approved' });
        
        // Apply the edit to the demand
        const demandRef = doc(db, 'demands', demand.id);
        await updateDoc(demandRef, {
          [proposal.field]: proposal.proposedValue,
          updatedAt: serverTimestamp(),
        });

        // Award reputation
        const proposerRef = doc(db, 'users', proposal.proposerId);
        await updateDoc(proposerRef, {
          reputation: increment(25),
        });

        onDemandUpdate?.();
      }

      fetchProposals();
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to vote');
    }
  };

  return (
    <div className="bg-surface-raised border border-border-subtle rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-text-primary uppercase tracking-wider">
          📝 Edit Proposals
        </h3>
        {isCoSigner && !showProposeForm && (
          <button
            onClick={() => setShowProposeForm(true)}
            className="text-xs px-3 py-1.5 bg-brand hover:bg-brand-dark text-white rounded-lg transition-all font-semibold"
          >
            + Propose Edit
          </button>
        )}
      </div>

      {/* Propose Form */}
      {showProposeForm && (
        <form onSubmit={handleSubmitProposal} className="mb-6 p-4 bg-surface-overlay border border-border-default rounded-lg">
          <div className="mb-3">
            <label className="block text-text-secondary text-xs mb-2 uppercase tracking-wider">
              Field to Edit
            </label>
            <select
              value={proposalField}
              onChange={(e) => setProposalField(e.target.value as any)}
              className="w-full px-3 py-2 bg-surface-raised border border-border-default rounded-lg text-text-primary focus:border-brand focus:ring-2 focus:ring-brand/20 text-sm"
            >
              <option value="title">Title</option>
              <option value="description">Description</option>
              <option value="successCriteria">Success Criteria</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="block text-text-secondary text-xs mb-2 uppercase tracking-wider">
              Current Value
            </label>
            <div className="p-3 bg-surface-raised border border-border-subtle rounded-lg text-text-muted text-sm">
              {demand[proposalField]}
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-text-secondary text-xs mb-2 uppercase tracking-wider">
              Proposed Value
            </label>
            <textarea
              value={proposedValue}
              onChange={(e) => setProposedValue(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-surface-raised border border-border-default rounded-lg text-text-primary focus:border-brand focus:ring-2 focus:ring-brand/20 resize-none text-sm"
              placeholder="Enter your proposed change..."
            />
          </div>

          <div className="mb-4">
            <label className="block text-text-secondary text-xs mb-2 uppercase tracking-wider">
              Reason for Change
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-surface-raised border border-border-default rounded-lg text-text-primary focus:border-brand focus:ring-2 focus:ring-brand/20 resize-none text-sm"
              placeholder="Explain why this change improves the demand..."
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting || !proposedValue.trim() || !reason.trim()}
              className="flex-1 px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg transition-all disabled:opacity-50 font-semibold text-sm"
            >
              {submitting ? 'Submitting...' : 'Submit Proposal'}
            </button>
            <button
              type="button"
              onClick={() => setShowProposeForm(false)}
              className="px-4 py-2 bg-surface-raised border border-border-default hover:border-danger text-text-secondary hover:text-danger rounded-lg transition-all text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Proposals List */}
      {loading ? (
        <div className="text-center py-8 text-text-muted text-sm">Loading proposals...</div>
      ) : proposals.length === 0 ? (
        <p className="text-text-muted text-sm text-center py-6">
          No edit proposals yet. Co-signers can propose improvements.
        </p>
      ) : (
        <div className="space-y-3">
          {proposals.map((proposal) => {
            const hasVoted = user && (proposal.approvalVotes.includes(user.uid) || proposal.rejectionVotes.includes(user.uid));
            const userApproved = user && proposal.approvalVotes.includes(user.uid);
            
            return (
              <div key={proposal.id} className="p-4 bg-surface-overlay border border-border-subtle rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-text-primary font-semibold text-sm mb-1">
                      Edit: {proposal.field}
                    </div>
                    <div className="text-xs text-text-muted">
                      by {proposal.proposerName} • {proposal.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    proposal.status === 'approved' ? 'bg-success/20 text-success border border-success/30' :
                    proposal.status === 'rejected' ? 'bg-danger/20 text-danger border border-danger/30' :
                    'bg-brand/20 text-brand border border-brand/30'
                  }`}>
                    {proposal.status}
                  </span>
                </div>

                <div className="mb-2">
                  <div className="text-xs text-text-muted mb-1">Reason:</div>
                  <div className="text-text-secondary text-sm">{proposal.reason}</div>
                </div>

                <div className="mb-3 p-2 bg-surface-raised rounded border border-border-subtle">
                  <div className="text-xs text-text-muted mb-1">Proposed change:</div>
                  <div className="text-text-primary text-sm">{proposal.proposedValue}</div>
                </div>

                {/* Voting */}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-text-muted">
                    {proposal.approvalVotes.length} / {approvalThreshold} approvals needed
                  </div>
                  {isCoSigner && proposal.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVote(proposal.id, 'approve')}
                        className={`px-3 py-1 text-xs rounded-lg transition-all ${
                          userApproved
                            ? 'bg-success text-white'
                            : 'bg-surface-raised border border-success text-success hover:bg-success hover:text-white'
                        }`}
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleVote(proposal.id, 'reject')}
                        className={`px-3 py-1 text-xs rounded-lg transition-all ${
                          hasVoted && !userApproved
                            ? 'bg-danger text-white'
                            : 'bg-surface-raised border border-danger text-danger hover:bg-danger hover:text-white'
                        }`}
                      >
                        ✗ Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
