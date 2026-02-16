'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
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
}

export default function MessageBoard({ demandId }: { demandId: string }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(true);

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
      await addDoc(messagesRef, {
        demandId,
        authorId: user.uid,
        authorName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        content: newMessage.trim(),
        createdAt: serverTimestamp(),
      });

      setNewMessage('');
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

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Discussion</h2>

      {/* Message List */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-2">No messages yet. Start the conversation!</p>
            <p className="text-sm">Discuss strategy, share updates, coordinate action.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 rounded-lg ${
                message.authorId === user?.uid ? 'bg-purple-50' : 'bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {message.authorName.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-gray-900">
                    {message.authorName}
                    {message.authorId === user?.uid && (
                      <span className="ml-2 text-xs text-purple-600">(You)</span>
                    )}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{formatTime(message.createdAt)}</span>
              </div>
              <p className="text-gray-700 ml-10 whitespace-pre-wrap">{message.content}</p>
            </div>
          ))
        )}
      </div>

      {/* Post Form */}
      {user ? (
        <form onSubmit={handlePost} className="mt-6">
          <div className="mb-3">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Share your thoughts, strategy, or updates..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition"
              disabled={posting}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={posting || !newMessage.trim()}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {posting ? 'Posting...' : 'Post Message'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">
            <a href="/login" className="text-purple-600 hover:underline font-semibold">
              Sign in
            </a>{' '}
            to join the discussion
          </p>
        </div>
      )}
    </div>
  );
}
