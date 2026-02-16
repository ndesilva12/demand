'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, doc, updateDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Demand, User } from '@/types';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [demands, setDemands] = useState<Demand[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({
    totalDemands: 0,
    activeDemands: 0,
    totalUsers: 0,
    totalCoSignatures: 0,
    demandsWon: 0,
  });
  const [loading, setLoading] = useState(true);

  // Simple admin check - in production, use proper role-based access control
  const isAdmin = user?.email?.includes('admin') || user?.uid === 'ADMIN_UID';

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch demands
      const demandsSnapshot = await getDocs(collection(db, 'demands'));
      const fetchedDemands = demandsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Demand[];
      setDemands(fetchedDemands);

      // Fetch users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const fetchedUsers = usersSnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as User[];
      setUsers(fetchedUsers);

      // Calculate stats
      const totalCoSigns = fetchedDemands.reduce((sum, d) => sum + (d.coSignCount || 0), 0);
      setStats({
        totalDemands: fetchedDemands.length,
        activeDemands: fetchedDemands.filter(d => d.status === 'active').length,
        totalUsers: fetchedUsers.length,
        totalCoSignatures: totalCoSigns,
        demandsWon: fetchedDemands.filter(d => d.status === 'met').length,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDemandStatus = async (demandId: string, newStatus: Demand['status']) => {
    if (!confirm(`Change demand status to "${newStatus}"?`)) return;
    
    try {
      const demandRef = doc(db, 'demands', demandId);
      await updateDoc(demandRef, { status: newStatus });
      fetchData();
    } catch (error) {
      console.error('Error updating demand:', error);
      alert('Failed to update demand');
    }
  };

  const handleVerifyUser = async (userId: string, status: User['verifiedStatus']) => {
    if (!confirm(`Set user verification to "${status}"?`)) return;
    
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { verifiedStatus: status });
      fetchData();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-deep flex items-center justify-center">
        <div className="animate-pulse text-text-muted">Loading admin dashboard...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-surface-deep flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-danger mb-4">Access Denied</h1>
          <p className="text-text-muted mb-6">You don&apos;t have admin permissions</p>
          <Link href="/" className="text-brand hover:underline">Go to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Admin Dashboard</h1>
            <p className="text-text-secondary">Moderate demands, manage users, view platform stats</p>
          </div>
          <Link href="/" className="text-brand hover:underline">← Back to Site</Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-surface-raised border border-border-subtle rounded-xl p-5 text-center">
            <div className="text-3xl font-bold text-brand">{stats.totalDemands}</div>
            <div className="text-text-muted text-xs mt-1 uppercase tracking-wider">Total Demands</div>
          </div>
          <div className="bg-surface-raised border border-border-subtle rounded-xl p-5 text-center">
            <div className="text-3xl font-bold text-warning">{stats.activeDemands}</div>
            <div className="text-text-muted text-xs mt-1 uppercase tracking-wider">Active</div>
          </div>
          <div className="bg-surface-raised border border-border-subtle rounded-xl p-5 text-center">
            <div className="text-3xl font-bold text-text-primary">{stats.totalUsers}</div>
            <div className="text-text-muted text-xs mt-1 uppercase tracking-wider">Users</div>
          </div>
          <div className="bg-surface-raised border border-border-subtle rounded-xl p-5 text-center">
            <div className="text-3xl font-bold text-brand">{stats.totalCoSignatures}</div>
            <div className="text-text-muted text-xs mt-1 uppercase tracking-wider">Co-Signs</div>
          </div>
          <div className="bg-surface-raised border border-border-subtle rounded-xl p-5 text-center">
            <div className="text-3xl font-bold text-success">{stats.demandsWon}</div>
            <div className="text-text-muted text-xs mt-1 uppercase tracking-wider">Won</div>
          </div>
        </div>

        {/* Demands Management */}
        <div className="bg-surface-raised border border-border-subtle rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-text-primary mb-4">Manage Demands</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="text-left py-3 px-4 text-text-muted text-xs uppercase tracking-wider">Title</th>
                  <th className="text-left py-3 px-4 text-text-muted text-xs uppercase tracking-wider">Target</th>
                  <th className="text-center py-3 px-4 text-text-muted text-xs uppercase tracking-wider">Co-Signs</th>
                  <th className="text-center py-3 px-4 text-text-muted text-xs uppercase tracking-wider">Status</th>
                  <th className="text-center py-3 px-4 text-text-muted text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {demands.map((demand) => (
                  <tr key={demand.id} className="border-b border-border-subtle hover:bg-surface-overlay">
                    <td className="py-3 px-4">
                      <Link href={`/demands/${demand.id}`} className="text-text-primary hover:text-brand font-medium">
                        {demand.title}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-text-secondary text-sm">{demand.targetCompany}</td>
                    <td className="py-3 px-4 text-center text-brand font-semibold">{demand.coSignCount || 0}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        demand.status === 'active' ? 'bg-warning/20 text-warning' :
                        demand.status === 'met' ? 'bg-success/20 text-success' :
                        'bg-surface-overlay text-text-muted'
                      }`}>
                        {demand.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={demand.status}
                        onChange={(e) => handleUpdateDemandStatus(demand.id, e.target.value as Demand['status'])}
                        className="px-2 py-1 bg-surface-overlay border border-border-default rounded text-xs text-text-primary"
                      >
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="negotiation">Negotiation</option>
                        <option value="met">Won</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users Management */}
        <div className="bg-surface-raised border border-border-subtle rounded-xl p-6">
          <h2 className="text-xl font-bold text-text-primary mb-4">Manage Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="text-left py-3 px-4 text-text-muted text-xs uppercase tracking-wider">Email</th>
                  <th className="text-left py-3 px-4 text-text-muted text-xs uppercase tracking-wider">Display Name</th>
                  <th className="text-center py-3 px-4 text-text-muted text-xs uppercase tracking-wider">Reputation</th>
                  <th className="text-center py-3 px-4 text-text-muted text-xs uppercase tracking-wider">Status</th>
                  <th className="text-center py-3 px-4 text-text-muted text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 20).map((u) => (
                  <tr key={u.uid} className="border-b border-border-subtle hover:bg-surface-overlay">
                    <td className="py-3 px-4 text-text-primary text-sm">{u.email}</td>
                    <td className="py-3 px-4 text-text-secondary text-sm">{u.displayName || '-'}</td>
                    <td className="py-3 px-4 text-center text-brand font-semibold">{u.reputation || 0}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        u.verifiedStatus === 'verified' ? 'bg-success/20 text-success' :
                        u.verifiedStatus === 'trusted' ? 'bg-brand/20 text-brand' :
                        'bg-surface-overlay text-text-muted'
                      }`}>
                        {u.verifiedStatus || 'unverified'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={u.verifiedStatus || 'unverified'}
                        onChange={(e) => handleVerifyUser(u.uid, e.target.value as User['verifiedStatus'])}
                        className="px-2 py-1 bg-surface-overlay border border-border-default rounded text-xs text-text-primary"
                      >
                        <option value="unverified">Unverified</option>
                        <option value="verified">Verified</option>
                        <option value="trusted">Trusted</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
