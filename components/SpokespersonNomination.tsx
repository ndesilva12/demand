'use client';

import { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Demand, SpokespersonVote } from '@/types';

interface SpokespersonNominationProps {
  demand: Demand;
}

export function SpokespersonNomination({ demand }: SpokespersonNominationProps) {
  const { user } = useAuth();
  const [nominees, setNominees] = useState<string[]>([]);
  const [selectedNominee, setSelectedNominee] = useState<string | null>(null);
  const [votes, setVotes] = useState<SpokespersonVote[]>([]);
  const [canNominate, setCanNominate] = useState(false);
  const [canVote, setCanVote] = useState(false);

  useEffect(() => {
    // Check if user can nominate/vote
    if (user && demand.coSigners.includes(user.uid)) {
      setCanNominate(true);
    }

    // Check voting status
    if (demand.spokespersonVotingOpen) {
      setCanVote(true);
      setVotes(demand.spokespersonVotes || []);
      setNominees(
        [...new Set([...nominees, ...demand.coSigners])]
      );
    }
  }, [user, demand]);

  const handleNomination = async () => {
    if (!user || !selectedNominee) return;

    try {
      const demandRef = doc(db, 'demands', demand.id);
      await updateDoc(demandRef, {
        spokespersonNominationDate: new Date(),
        spokespersonVotingOpen: true,
        spokespersonVotingEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        spokespersonVotes: [],
        currentSpokespersonId: selectedNominee,
      });

      // Notify co-signers about nomination
      // TODO: Implement notification system
    } catch (error) {
      console.error('Nomination error:', error);
    }
  };

  const handleVote = async (voteType: 'approve' | 'reject') => {
    if (!user) return;

    try {
      const demandRef = doc(db, 'demands', demand.id);
      await updateDoc(demandRef, {
        spokespersonVotes: arrayUnion({
          userId: user.uid,
          vote: voteType,
          timestamp: new Date(),
        }),
      });

      // Check if voting threshold met
      const approvalThreshold = demand.coSignCount * 0.75;
      const approvedVotes = votes.filter(v => v.vote === 'approve').length;

      if (approvedVotes >= approvalThreshold) {
        await updateDoc(demandRef, {
          spokespersonVotingOpen: false,
          currentSpokespersonId: selectedNominee,
        });
      }
    } catch (error) {
      console.error('Vote error:', error);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
      <h3 className="text-xl font-bold text-[#00aaff] mb-4">Demand Spokesperson</h3>
      
      {/* Current Spokesperson */}
      <div className="mb-4">
        <p className="text-gray-300">
          Current Spokesperson: {demand.currentSpokespersonId}
        </p>
      </div>

      {/* Nomination Section */}
      {canNominate && !demand.spokespersonVotingOpen && (
        <div>
          <select
            value={selectedNominee || ''}
            onChange={(e) => setSelectedNominee(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white rounded"
          >
            <option value="">Select Nominee</option>
            {demand.coSigners.map(signerId => (
              <option key={signerId} value={signerId}>
                {signerId}
              </option>
            ))}
          </select>
          <button
            onClick={handleNomination}
            className="mt-2 w-full bg-[#00aaff] text-white p-2 rounded hover:bg-[#0088cc]"
          >
            Nominate Spokesperson
          </button>
        </div>
      )}

      {/* Voting Section */}
      {demand.spokespersonVotingOpen && canVote && (
        <div>
          <p className="text-gray-300 mb-2">
            Nominee: {demand.currentSpokespersonId}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleVote('approve')}
              className="flex-1 bg-green-600 text-white p-2 rounded hover:bg-green-700"
            >
              Approve
            </button>
            <button
              onClick={() => handleVote('reject')}
              className="flex-1 bg-red-600 text-white p-2 rounded hover:bg-red-700"
            >
              Reject
            </button>
          </div>
          <p className="text-gray-400 mt-2 text-sm">
            Voting ends in: {/* Add countdown timer */}
          </p>
        </div>
      )}
    </div>
  );
}