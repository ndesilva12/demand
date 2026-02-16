'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface Notification {
  id: string;
  type: 'cosign' | 'response' | 'milestone' | 'victory' | 'mention' | 'welcome';
  title: string;
  message: string;
  demandId?: string;
  read: boolean;
  createdAt: Date;
}

const mockNotifications: Notification[] = [
  { id: '1', type: 'cosign', title: 'New co-signer!', message: 'Sarah K. co-signed your demand "Cap Insulin Prices at $35"', demandId: 'demand-1', read: false, createdAt: new Date(Date.now() - 1000 * 60 * 15) },
  { id: '2', type: 'milestone', title: 'Milestone reached! 🎉', message: '"Right to Repair" hit 10,000 co-signers — escalation stage unlocked', demandId: 'demand-2', read: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: '3', type: 'response', title: 'Corporate response received', message: 'Apple responded to "Right to Repair Program" demand', demandId: 'demand-3', read: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5) },
  { id: '4', type: 'victory', title: 'Victory! 🏆', message: '"Transparent Pricing" demand against Eli Lilly was marked as won!', demandId: 'demand-4', read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { id: '5', type: 'cosign', title: 'Trending demand', message: 'A demand you co-signed is now trending: "End Hidden Fees"', demandId: 'demand-5', read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48) },
  { id: '6', type: 'mention', title: 'You were mentioned', message: 'Marcus J. mentioned you in a discussion on "Worker Safety Standards"', demandId: 'demand-6', read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72) },
  { id: '7', type: 'welcome', title: 'Welcome to Demand! 👋', message: 'Your account is set up. Start by browsing demands or creating your own.', read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 168) },
];

const typeIcons: Record<string, string> = {
  cosign: '✊',
  response: '🏢',
  milestone: '⚡',
  victory: '🏆',
  mention: '💬',
  welcome: '👋',
};

const typeColors: Record<string, string> = {
  cosign: '#00aaff',
  response: '#f59e0b',
  milestone: '#8b5cf6',
  victory: '#22c55e',
  mention: '#ec4899',
  welcome: '#14b8a6',
};

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<string>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const filtered = filter === 'all' ? notifications : filter === 'unread' ? notifications.filter(n => !n.read) : notifications.filter(n => n.type === filter);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔔</div>
          <h2 className="text-2xl font-bold mb-3">Sign in to see notifications</h2>
          <p className="text-[#a0a0a0] mb-6">Stay updated on your demands and co-signs.</p>
          <Link href="/login" className="bg-[#00aaff] hover:bg-[#0088cc] text-white px-6 py-3 rounded-xl font-semibold transition-all">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-[#a0a0a0] text-sm mt-1">{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-[#00aaff] text-sm hover:underline font-medium">
              Mark all as read
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'unread', 'cosign', 'milestone', 'response', 'victory'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                filter === f ? 'bg-[#00aaff]/10 text-[#00aaff] border border-[#00aaff]/20' : 'bg-[#1a1a1a] border border-[#1e1e1e] text-[#a0a0a0] hover:text-white'
              }`}
            >
              {f === 'all' ? 'All' : f === 'unread' ? 'Unread' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">📭</div>
              <p className="text-[#666666]">No notifications yet</p>
            </div>
          ) : (
            filtered.map(n => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`flex items-start gap-4 p-4 rounded-xl transition-all cursor-pointer ${
                  n.read ? 'bg-[#0a0a0a] hover:bg-[#111111]' : 'bg-[#1a1a1a] border border-[#222222] hover:border-[#00aaff]/20'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-lg"
                  style={{ backgroundColor: `${typeColors[n.type]}15`, color: typeColors[n.type] }}
                >
                  {typeIcons[n.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm text-white">{n.title}</span>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-[#00aaff] shrink-0" />}
                  </div>
                  <p className="text-sm text-[#a0a0a0] line-clamp-2">{n.message}</p>
                  <span className="text-xs text-[#666666] mt-1 block">{timeAgo(n.createdAt)}</span>
                </div>
                {n.demandId && (
                  <Link href={`/demands/${n.demandId}`} className="text-[#00aaff] text-xs hover:underline shrink-0 self-center">
                    View →
                  </Link>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
