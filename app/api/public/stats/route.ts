import { NextResponse } from 'next/server';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Fetch all active demands
    const activeSnap = await getDocs(query(collection(db, 'demands'), where('status', 'in', ['active', 'negotiation'])));
    const activeDemands = activeSnap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        title: data.title,
        targetCompany: data.targetCompany,
        coSignCount: data.coSignCount || 0,
        status: data.status,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        tags: data.tags || [],
      };
    });

    // Victories
    const victoriesSnap = await getDocs(query(collection(db, 'demands'), where('status', '==', 'met')));
    const victories = victoriesSnap.docs.length;

    // Total co-signers
    const totalCoSigners = activeDemands.reduce((sum, d) => sum + d.coSignCount, 0);

    // Pressure by company
    const byCompany: Record<string, { demands: number; coSigners: number }> = {};
    activeDemands.forEach(d => {
      if (!byCompany[d.targetCompany]) byCompany[d.targetCompany] = { demands: 0, coSigners: 0 };
      byCompany[d.targetCompany].demands++;
      byCompany[d.targetCompany].coSigners += d.coSignCount;
    });

    const pressureBoard = Object.entries(byCompany)
      .map(([company, data]) => ({
        company,
        activeDemands: data.demands,
        totalCoSigners: data.coSigners,
        pressureScore: Math.round(data.coSigners * 0.4 + data.demands * 100 * 0.3),
      }))
      .sort((a, b) => b.pressureScore - a.pressureScore)
      .slice(0, 20);

    // Trending demands (top 10 by co-signers)
    const trending = [...activeDemands].sort((a, b) => b.coSignCount - a.coSignCount).slice(0, 10);

    return NextResponse.json({
      platform: 'Demand',
      description: 'Consumer-Powered Corporate Accountability Platform',
      url: 'https://demandchange.vercel.app',
      generatedAt: new Date().toISOString(),
      stats: {
        activeDemands: activeDemands.length,
        totalCoSigners,
        victories,
        companiesTargeted: Object.keys(byCompany).length,
      },
      trending,
      pressureBoard,
      api: {
        docs: 'This is a public API for journalists and researchers. Data updates in real-time.',
        endpoints: {
          stats: '/api/public/stats',
        },
        license: 'Free to use with attribution to Demand (demandchange.vercel.app)',
      },
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
