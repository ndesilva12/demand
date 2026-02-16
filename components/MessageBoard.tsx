'use client';

import { useState, useEffect, useRef } from 'react';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
  increment,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  demandId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
  replyTo?: string;
  replies?: string[];
}

export default function MessageBoard({ demandId }: { demandId: string }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('demandId', '==', demandId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Message[];

        setMessages(fetchedMessages);
        setLoading(false);
        
        // Auto-scroll to bottom on new messages
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
      (error) => {
        console.error('Error fetching messages:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [demandId]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !newMessage.trim()) return;

    setPosting(true);

    try {
      const messagesRef = collection(db, 'messages');
      const messageData: any = {
        demandId,
        authorId: user.uid,
        authorName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        content: newMessage.trim(),
        createdAt: serverTimestamp(),
      };

      if (replyToId) {
        messageData.replyTo = replyToId;
        
        // Add reply to parent message
        const parentRef = doc(db, 'messages', replyToId);
        await updateDoc(parentRef, {
          replies: arrayUnion(replyToId),
        });
      }

      await addDoc(messagesRef, messageData);

      // Award reputation for participation
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        reputation: increment(2),
      });

      setNewMessage('');
      setReplyToId(null);
    } catch (error) {
      console.error('Error posting message:', error);
      alert('Failed to post message. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const getReplyToMessage = (replyToId: string) => {
    return messages.find(m => m.id === replyToId);
  };

  return (
    <div className="bg-surface-raised border border-border-subtle rounded-xl p-6">
      <h2 className="text-lg font-bold text-text-primary mb-4 uppercase tracking-wider">💬 Discussion</h2>

      {/* Message List */}
      <div className="space-y-3 mb-6 max-h-[500px] overflow-y-auto pr-2">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-brand border-t-transparent"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-text-muted">
            <p className="mb-2">No messages yet. Start the conversation!</p>
            <p className="text-xs">Discuss strategy, share updates, coordinate action.</p>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const replyTo = message.replyTo ? getReplyToMessage(message.replyTo) : null;
              return (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg border transition-all ${
                    message.authorId === user?.uid 
                      ? 'bg-brand/5 border-brand/30' 
                      : 'bg-surface-overlay border-border-subtle hover:border-border-default'
                  }`}
                >
                  {/* Reply Context */}
                  {replyTo && (
                    <div className="mb-2 pl-3 border-l-2 border-border-default">
                      <div className="text-xs text-text-muted">
                        Replying to <span className="text-brand">{replyTo.authorName}</span>
                      </div>
                      <div className="text-xs text-text-muted truncate">{replyTo.content}</div>
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-brand to-brand-dark rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {message.authorName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-semibold text-text-primary text-sm">
                          {message.authorName}
                          {message.authorId === user?.uid && (
                            <span className="ml-2 text-xs text-brand">(You)</span>
                          )}
                        </span>
                        <div className="text-xs text-text-muted">{formatTime(message.createdAt)}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setReplyToId(message.id)}
                      className="text-xs text-text-muted hover:text-brand transition-colors"
                    >
                      Reply
                    </button>
                  </div>
                  <p className="text-text-secondary ml-10 whitespace-pre-wrap text-sm">{message.content}</p>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Post Form */}
      {user ? (
        <form onSubmit={handlePost} className="mt-6">
          {replyToId && (
            <div className="mb-2 flex items-center justify-between bg-surface-overlay border border-border-default rounded-lg px-3 py-2">
              <span className="text-xs text-text-muted">
                Replying to message...
              </span>
              <button
                type="button"
                onClick={() => setReplyToId(null)}
                className="text-xs text-danger hover:underline"
              >
                Cancel
              </button>
            </div>
          )}
          <div className="mb-3">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Share your thoughts, strategy, or updates..."
              rows={3}
              className="w-full px-4 py-3 bg-surface-overlay border border-border-default rounded-lg focus:border-brand focus:ring-2 focus:ring-brand/20 text-text-primary placeholder-text-muted transition-all resize-none"
              disabled={posting}
            />
          </div>
          <div className="flex justify-between items-center">
            <div className="text-xs text-text-muted">
              {newMessage.length}/500 characters
            </div>
            <button
              type="submit"
              disabled={posting || !newMessage.trim() || newMessage.length > 500}
              className="px-6 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {posting ? 'Posting...' : 'Post Message'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-6 p-4 bg-surface-overlay border border-border-subtle rounded-lg text-center">
          <p className="text-text-secondary text-sm">
            <a href="/login" className="text-brand hover:underline font-semibold">
              Sign in
            </a>{' '}
            to join the discussion
          </p>
        </div>
      )}
    </div>
  );
}
