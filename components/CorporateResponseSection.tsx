'use client';

import { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp, doc, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { CorporateResponse } from '@/types';

interface Props {
  demandId: string;
  companyName: string;
}

export default function CorporateResponseSection({ demandId, companyName }: Props) {
  const { user } = useAuth();
  const [responses, setResponses] = useState<CorporateResponse[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [responderTitle, setResponderTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const snap = await getDocs(query(
          collection(db, 'corporateResponses'),
          where('demandId', '==', demandId),
          orderBy('createdAt', 'desc')
        ));
        setResponses(snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate() } as CorporateResponse)));
      } catch (e) { console.error(e); }
    };
    fetchResponses();
  }, [demandId]);

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !message) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'corporateResponses'), {
        companyName,
        demandId,
        responderId: user.uid,
        responderTitle,
        message,
        createdAt: serverTimestamp(),
        ratings: [],
        acceptCount: 0,
        rejectCount: 0,
        insufficientCount: 0,
      });
      setMessage('');
      setResponderTitle('');
      setShowForm(false);
      // Refresh
      const snap = await getDocs(query(collection(db, 'corporateResponses'), where('demandId', '==', demandId), orderBy('createdAt', 'desc')));
      setResponses(snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate() } as CorporateResponse)));
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  const handleRate = async (responseId: string, rating: 'accepted' | 'rejected' | 'insufficient') => {
    if (!user) return;
    const resp = responses.find(r => r.id === responseId);
    if (!resp || resp.ratings?.some(r => r.userId === user.uid)) return;
    try {
      const ref = doc(db, 'corporateResponses', responseId);
      const field = rating === 'accepted' ? 'acceptCount' : rating === 'rejected' ? 'rejectCount' : 'insufficientCount';
      await updateDoc(ref, {
        ratings: arrayUnion({ userId: user.uid, rating, timestamp: new Date() }),
        [field]: increment(1),
      });
      setResponses(prev => prev.map(r => r.id === responseId ? {
        ...r,
        ratings: [...(r.ratings || []), { userId: user.uid, rating }],
        [field]: (r[field as keyof CorporateResponse] as number || 0) + 1,
      } : r));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#222222] rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-[#666666] uppercase tracking-wider">
          Corporate Responses {responses.length === 0 && <span className="text-[#ef4444] ml-1">· SILENCE</span>}
        </h3>
        {user && (
          <button onClick={() => setShowForm(!showForm)}
            className="text-xs text-[#00aaff] hover:underline">
            {showForm ? 'Cancel' : 'Submit Response'}
          </button>
        )}
      </div>

      {responses.length === 0 && !showForm && (
        <div className="text-center py-6">
          <div className="text-3xl mb-2">🤫</div>
          <p className="text-[#a0a0a0] text-sm">No response from <span className="text-white font-medium">{companyName}</span> yet.</p>
          <p className="text-[#666666] text-xs mt-1">Their silence speaks volumes.</p>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmitResponse} className="mb-6 space-y-3">
          <input value={responderTitle} onChange={e => setResponderTitle(e.target.value)}
            placeholder="Your title (e.g., VP of Customer Relations)"
            className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-4 py-2 text-white text-sm placeholder-[#666666] focus:border-[#00aaff] focus:outline-none" />
          <textarea value={message} onChange={e => setMessage(e.target.value)} required rows={4}
            placeholder="Official corporate response..."
            className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-4 py-2 text-white text-sm placeholder-[#666666] focus:border-[#00aaff] focus:outline-none resize-none" />
          <button type="submit" disabled={submitting}
            className="bg-[#00aaff] hover:bg-[#0088cc] text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
            {submitting ? 'Submitting...' : 'Submit Response'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {responses.map(r => {
          const hasRated = r.ratings?.some(rt => rt.userId === user?.uid);
          const total = (r.acceptCount || 0) + (r.rejectCount || 0) + (r.insufficientCount || 0);
          return (
            <div key={r.id} className="bg-[#0a0a0a] border border-[#222222] rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-white font-medium text-sm">{r.companyName}</span>
                  {r.responderTitle && <span className="text-[#666666] text-xs ml-2">· {r.responderTitle}</span>}
                </div>
                <span className="text-[#666666] text-xs">
                  {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}
                </span>
              </div>
              <p className="text-[#a0a0a0] text-sm mb-3 whitespace-pre-wrap">{r.message}</p>
              
              {/* Rating buttons */}
              <div className="flex items-center gap-2">
                {[
                  { key: 'accepted' as const, label: '✅ Accept', count: r.acceptCount || 0, color: 'text-[#22c55e]' },
                  { key: 'insufficient' as const, label: '⚠️ Insufficient', count: r.insufficientCount || 0, color: 'text-[#f59e0b]' },
                  { key: 'rejected' as const, label: '❌ Reject', count: r.rejectCount || 0, color: 'text-[#ef4444]' },
                ].map(btn => (
                  <button key={btn.key} onClick={() => handleRate(r.id, btn.key)}
                    disabled={hasRated || !user}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      hasRated ? 'opacity-60 cursor-default' : 'hover:bg-[#1a1a1a]'
                    } ${btn.color}`}>
                    {btn.label} {total > 0 && <span className="text-[#666666]">({btn.count})</span>}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
