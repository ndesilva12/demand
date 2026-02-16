import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin (server-side)
if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const auth = getAuth();
const db = getFirestore();

const DEMO_USERS = [
  { email: 'demo1@demand.local', name: '[DEMO] Sarah Chen' },
  { email: 'demo2@demand.local', name: '[DEMO] Marcus Johnson' },
  { email: 'demo3@demand.local', name: '[DEMO] Emma Rodriguez' },
  { email: 'demo4@demand.local', name: '[DEMO] David Park' },
  { email: 'demo5@demand.local', name: '[DEMO] Lisa Thompson' },
];

const DEMO_DEMANDS = [
  {
    title: '[DEMO] Amazon: Stop Mandatory Return-to-Office Policy',
    description: `Amazon announced a mandatory 5-day return to office policy, eliminating flexible hybrid work.

This policy ignores proven productivity gains, forces unnecessary commutes, and will cause mass exodus of talent.`,
    targetCompany: 'Amazon',
    successCriteria: 'Maintain hybrid work options (2-3 days remote/week), no penalties for remote workers, by Q1 2026',
    creator: 0,
    coSigners: [1, 2, 3, 4],
  },
  {
    title: '[DEMO] Meta: End Surveillance Advertising on Instagram',
    description: `Meta tracks users across the web without meaningful consent, building invasive profiles and sharing data with thousands of third parties.`,
    targetCompany: 'Meta',
    successCriteria: 'Chronological feed default, opt-out of cross-site tracking, end third-party data sharing, transparency report by Q2 2026',
    creator: 1,
    coSigners: [0, 2, 4],
  },
  {
    title: '[DEMO] Starbucks: Pay Fair Wages to Baristas',
    description: `Record profits of $35.9B while baristas earn $12-15/hr and struggle to afford rent. CEO made $14.7M (980x median barista).`,
    targetCompany: 'Starbucks',
    successCriteria: '$20/hr minimum wage nationwide, 25hr/week minimum, predictable schedules, stop union-busting by Q3 2026',
    creator: 2,
    coSigners: [0, 1, 3],
  },
  {
    title: '[DEMO] Tesla: Recall All Cybertrucks for Safety Issues',
    description: `Multiple critical failures: accelerator detachment, frunk injuries, wiper failures, rust within weeks. Still selling new units.`,
    targetCompany: 'Tesla',
    successCriteria: 'Immediate recall, free repairs, third-party audit, compensation for injured, public report by Q2 2026',
    creator: 3,
    coSigners: [1, 2],
  },
  {
    title: '[DEMO] Ticketmaster: End Junk Fees and Dynamic Pricing',
    description: `Monopoly leads to 30-50% service fees and exploitative dynamic pricing. Taylor Swift tickets hit $5,000+.`,
    targetCompany: 'Ticketmaster',
    successCriteria: 'All-in pricing, fees capped at 10%, end dynamic pricing, free transfers, DOJ consent decree',
    creator: 4,
    coSigners: [0, 1, 2, 3],
  },
  {
    title: '[DEMO] Shein: Stop Using Forced Labor',
    description: `Evidence of forced labor in supply chain. $3 shirts impossible without exploitation. Ties to Xinjiang cotton.`,
    targetCompany: 'Shein',
    successCriteria: 'Independent audit, disclose factories, prove fair wages, end Xinjiang cotton, results by Q3 2026',
    creator: 0,
    coSigners: [2, 3, 4],
  },
];

export async function POST(request: Request) {
  try {
    const { secret } = await request.json();
    
    // Simple security check
    if (secret !== 'SEED_DEMO_NOW_2026') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userUids: string[] = [];

    // Create demo users
    for (const user of DEMO_USERS) {
      try {
        const userRecord = await auth.createUser({
          email: user.email,
          password: 'DemoPass123!',
          displayName: user.name,
        });
        userUids.push(userRecord.uid);
      } catch (error: any) {
        if (error.code === 'auth/email-already-exists') {
          const existingUser = await auth.getUserByEmail(user.email);
          userUids.push(existingUser.uid);
        } else {
          throw error;
        }
      }
    }

    // Create demo demands
    for (const demand of DEMO_DEMANDS) {
      const coSignerUids = demand.coSigners.map(idx => userUids[idx]);
      
      await db.collection('demands').add({
        title: demand.title,
        description: demand.description,
        targetCompany: demand.targetCompany,
        successCriteria: demand.successCriteria,
        creatorId: userUids[demand.creator],
        creatorName: DEMO_USERS[demand.creator].name,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        status: 'active',
        coSigners: coSignerUids,
        coSignCount: coSignerUids.length,
        visibility: 'public',
        tags: ['DEMO'],
      });
    }

    return NextResponse.json({ 
      success: true, 
      created: {
        users: DEMO_USERS.length,
        demands: DEMO_DEMANDS.length,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
