'use client';

import { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion, getDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Demand, SpokespersonVote } from '@/types';

interface SpokespersonNominationProps {
  demand: Demand;
  onUpdate?: () => void;
}

export function SpokespersonNomination({ demand, onUpdate }: SpokespersonNominationProps) {
  const { user } = useAuth();
  const [selectedNominee, setSelectedNominee] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [userNames, setUserNames] = useState<Record<string, string>>({});

  const isCoSigner = user && demand.coSigners?.includes(user.uid);
  const isSpokesperson = user && demand.currentSpokespersonId === user.uid;
  const hasVoted = user && demand.spokespersonVotes?.some(v => v.userId === user.uid);
  
  const approveVotes = demand.spokespersonVotes?.filter(v => v.vote === 'approve').length || 0;
  const rejectVotes = demand.spokespersonVotes?.filter(v => v.vote === 'reject').length || 0;
  const totalVotes = approveVotes + rejectVotes;
  const approvalThreshold = Math.ceil((demand.coSignCount || 1) * 0.75);

  useEffect(() => {
    // Fetch user names for display
    const fetchUserNames = async () => {
      const names: Record<string, string> = {};
      for (const uid of demand.coSigners || []) {
        try {
          const userDoc = await getDoc(doc(db, 'users', uid));
          if (userDoc.exists()) {
            names[uid] = userDoc.data().displayName || userDoc.data().email?.split('@')[0] || 'Anonymous';
          } else {
            names[uid] = 'User ' + uid.slice(0, 8);
          }
        } catch (e) {
          names[uid] = 'User ' + uid.slice(0, 8);
        }
      }
      setUserNames(names);
    };
    if (demand.coSigners?.length) {
      fetchUserNames();
    }
  }, [demand.coSigners]);

  const handleNominate = async () => {
    if (!user || !selectedNominee || !isCoSigner) return;
    setLoading(true);
    try {
      const demandRef = doc(db, 'demands', demand.id);
      await updateDoc(demandRef, {
        spokespersonVotingOpen: true,
        spokespersonVotingEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        spokespersonVotes: [{
          userId: user.uid,
          vote: 'approve',
          timestamp: new Date(),
        }],
        currentSpokespersonId: selectedNominee,
        spokespersonNominationDate: new Date(),
      });
      onUpdate?.();
    } catch (error) {
      console.error('Nomination error:', error);
      alert('Failed to nominate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (voteType: 'approve' | 'reject') => {
    if (!user || !isCoSigner || hasVoted) return;
    setLoading(true);
    try {
      const demandRef = doc(db, 'demands', demand.id);
      const newVote: SpokespersonVote = {
        userId: user.uid,
        vote: voteType,
        timestamp: new Date(),
      };
      
      await updateDoc(demandRef, {
        spokespersonVotes: arrayUnion(newVote),
      });

      // Check if threshold met
      const newApproveCount = voteType === 'approve' ? approveVotes + 1 : approveVotes;
      const newRejectCount = voteType === 'reject' ? rejectVotes + 1 : rejectVotes;
      
      if (newApproveCount >= approvalThreshold) {
        // Spokesperson approved!
        await updateDoc(demandRef, {
          spokespersonVotingOpen: false,
        });
        // Award reputation to spokesperson
        const spokespersonRef = doc(db, 'users', demand.currentSpokespersonId);
        await updateDoc(spokespersonRef, {
          reputation: increment(50),
        });
      } else if (newRejectCount > (demand.coSignCount || 1) * 0.25) {
        // Nominee rejected
        await updateDoc(demandRef, {
          spokespersonVotingOpen: false,
          currentSpokespersonId: '',
        });
      }
      
      onUpdate?.();
    } catch (error) {
      console.error('Vote error:', error);
      alert('Failed to vote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRelinquish = async () => {
    if (!user || !isSpokesperson) return;
    if (!confirm('Are you sure you want to relinquish your spokesperson role? This will allow a new nomination.')) return;
    
    setLoading(true);
    try {
      const demandRef = doc(db, 'demands', demand.id);
      await updateDoc(demandRef, {
        currentSpokespersonId: '',
        spokespersonVotingOpen: false,
        spokespersonVotes: [],
      });
      onUpdate?.();
    } catch (error) {
      console.error('Relinquish error:', error);
      alert('Failed to relinquish role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-raised border border-border-subtle rounded-xl p-6">
      <h3 className="text-lg font-bold text-brand mb-4 uppercase tracking-wider">📢 Demand Spokesperson</h3>
      
      {/* Current Spokesperson */}
      {demand.currentSpokespersonId && !demand.spokespersonVotingOpen && (
        <div className="bg-brand/10 border border-brand/30 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-brand uppercase tracking-wider mb-1">Current Spokesperson</div>
              <div className="text-text-primary font-semibold">
                {userNames[demand.currentSpokespersonId] || 'Loading...'}
              </div>
              <div className="text-xs text-text-muted mt-1">
                Companies can contact this person to negotiate
              </div>
            </div>
            {isSpokesperson && (
              <button
                onClick={handleRelinquish}
                disabled={loading}
                className="px-3 py-1.5 text-xs bg-surface-overlay hover:bg-danger/20 border border-border-default hover:border-danger text-text-secondary hover:text-danger rounded-lg transition-all disabled:opacity-50"
              >
                Relinquish
              </button>
            )}
          </div>
        </div>
      )}

      {/* No Spokesperson */}
      {!demand.currentSpokespersonId && !demand.spokespersonVotingOpen && isCoSigner && (
        <div>
          <p className="text-text-secondary text-sm mb-4">
            Co-signers can nominate a spokesperson to represent this demand in negotiations with companies.
          </p>
          <select
            value={selectedNominee}
            onChange={(e) => setSelectedNominee(e.target.value)}
            className="w-full mb-3 bg-surface-overlay text-text-primary border border-border-default rounded-lg px-4 py-2.5 focus:border-brand focus:ring-2 focus:ring-brand/20"
            disabled={loading}
          >
            <option value="">Select a co-signer to nominate...</option>
            {demand.coSigners?.map(uid => (
              <option key={uid} value={uid}>
                {userNames[uid] || uid.slice(0, 8)}
              </option>
            ))}
          </select>
          <button
            onClick={handleNominate}
            disabled={loading || !selectedNominee}
            className="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Nominating...' : 'Nominate Spokesperson'}
          </button>
        </div>
      )}

      {/* Voting in Progress */}
      {demand.spokespersonVotingOpen && (
        <div>
          <div className="mb-4">
            <div className="text-xs text-text-muted uppercase tracking-wider mb-2">Nominee</div>
            <div className="text-text-primary font-semibold">
              {userNames[demand.currentSpokespersonId] || 'Loading...'}
            </div>
          </div>

          {/* Vote Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-text-muted mb-2">
              <span>Approval Progress</span>
              <span>{approveVotes} / {approvalThreshold} needed</span>
            </div>
            <div className="h-2 bg-surface-overlay rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand transition-all duration-500"
                style={{ width: `${(approveVotes / approvalThreshold) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-success">✓ {approveVotes} approve</span>
              <span className="text-danger">✗ {rejectVotes} reject</span>
            </div>
          </div>

          {/* Voting Buttons */}
          {isCoSigner && !hasVoted ? (
            <div className="flex gap-3">
              <button
                onClick={() => handleVote('approve')}
                disabled={loading}
                className="flex-1 bg-success hover:bg-success-dark text-white font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50"
              >
                ✓ Approve
              </button>
              <button
                onClick={() => handleVote('reject')}
                disabled={loading}
                className="flex-1 bg-danger hover:bg-danger-dark text-white font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50"
              >
                ✗ Reject
              </button>
            </div>
          ) : hasVoted ? (
            <div className="text-center text-text-muted text-sm py-2">
              You have voted. Waiting for other co-signers...
            </div>
          ) : (
            <div className="text-center text-text-muted text-sm py-2">
              Only co-signers can vote
            </div>
          )}

          {/* Voting Deadline */}
          {demand.spokespersonVotingEndDate && (
            <div className="mt-3 text-xs text-text-muted text-center">
              Voting ends {new Date(demand.spokespersonVotingEndDate).toLocaleDateString()}
            </div>
          )}
        </div>
      )}

      {!isCoSigner && !demand.currentSpokespersonId && (
        <p className="text-text-muted text-sm text-center py-4">
          Co-sign this demand to participate in spokesperson nomination
        </p>
      )}
    </div>
  );
}
