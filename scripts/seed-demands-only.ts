/**
 * Seed demands using existing demo users
 * Run with: npx tsx scripts/seed-demands-only.ts
 */

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const DEMO_USERS = [
  { email: 'demo1@demand.local', password: 'DemoPass123!', name: '[DEMO] Sarah Chen' },
  { email: 'demo2@demand.local', password: 'DemoPass123!', name: '[DEMO] Marcus Johnson' },
  { email: 'demo3@demand.local', password: 'DemoPass123!', name: '[DEMO] Emma Rodriguez' },
  { email: 'demo4@demand.local', password: 'DemoPass123!', name: '[DEMO] David Park' },
  { email: 'demo5@demand.local', password: 'DemoPass123!', name: '[DEMO] Lisa Thompson' },
];

const DEMO_DEMANDS = [
  {
    title: '[DEMO] Amazon: Stop Mandatory Return-to-Office Policy',
    description: `Amazon announced a mandatory 5-day return to office policy starting January 2025, eliminating the flexible hybrid work that employees have successfully used for years.

This policy:
• Ignores proven productivity gains from remote work
• Forces unnecessary commutes (environmental impact)
• Disproportionately impacts working parents and caregivers
• Contradicts Amazon's own climate pledges
• Will cause mass exodus of talented employees

We demand Amazon reverse this anti-worker policy and maintain hybrid flexibility.`,
    targetCompany: 'Amazon',
    successCriteria: `1. Amazon publicly announces continuation or expansion of hybrid work options
2. Employees retain ability to work remotely at least 2-3 days per week
3. No penalties or career limitations for remote workers
4. Policy change communicated by end of Q1 2026`,
    creator: 0,
    coSigners: [1, 2, 3, 4],
  },
  {
    title: '[DEMO] Meta: End Surveillance Advertising on Instagram',
    description: `Meta's surveillance-based advertising model on Instagram tracks users across the web, building invasive profiles without meaningful consent.

The current system:
• Tracks users even when not using Instagram
• Shares data with thousands of third parties
• Manipulates users with algorithmic feeds designed for addiction
• Particularly harmful to teenagers' mental health

European regulators have fined Meta billions for privacy violations. It's time for real change.`,
    targetCompany: 'Meta (Instagram)',
    successCriteria: `1. Offer chronological feed as default option (not buried in settings)
2. Allow users to opt-out of cross-site tracking entirely
3. End data sharing with third-party advertisers without explicit per-case consent
4. Publish transparency report showing exactly what data is collected
5. Independent audit of data practices by end of Q2 2026`,
    creator: 1,
    coSigners: [0, 2, 4],
  },
  {
    title: '[DEMO] Starbucks: Pay Fair Wages to Baristas',
    description: `Starbucks reported record profits of $35.9 billion in 2024, yet baristas—the workers who create that value—struggle to afford rent.

The reality:
• Starting wages: $12-15/hr in most markets (below living wage)
• Inconsistent scheduling makes second jobs impossible
• Union-busting tactics against workers seeking better conditions
• CEO made $14.7M last year (980x median barista salary)

Starbucks can afford to pay fairly. They choose not to.`,
    targetCompany: 'Starbucks',
    successCriteria: `1. Minimum wage of $20/hr for all baristas nationwide
2. Guaranteed minimum 25 hours/week for part-time workers
3. Predictable schedules posted 2 weeks in advance
4. Stop union-busting: Recognize and negotiate with union stores in good faith
5. Changes implemented by Q3 2026`,
    creator: 2,
    coSigners: [0, 1, 3],
  },
  {
    title: '[DEMO] Tesla: Recall All Cybertrucks for Safety Issues',
    description: `Tesla's Cybertruck has experienced multiple critical safety failures since launch:

Documented issues:
• Accelerator pedal detachment (April 2024 recall)
• "Frunk" injuries from closing mechanism
• Windshield wiper failures at highway speeds
• Sharp exposed edges causing injuries
• Rust appearing within weeks of purchase

Despite these issues, Tesla continues selling new units. This is unacceptable.`,
    targetCompany: 'Tesla',
    successCriteria: `1. Immediate recall of all Cybertrucks for comprehensive safety inspection
2. Free repairs/replacements for all identified defects
3. Third-party safety audit (not Tesla-conducted)
4. Compensation for injured customers
5. Public safety report published by end of Q2 2026`,
    creator: 3,
    coSigners: [1, 2],
  },
  {
    title: '[DEMO] Ticketmaster: End Junk Fees and Dynamic Pricing',
    description: `Ticketmaster's monopoly on live event ticketing has led to outrageous fees and exploitative pricing.

The problem:
• "Service fees" often 30-50% of ticket price (for what service?)
• Dynamic pricing gouges fans (Taylor Swift tickets hit $5,000+)
• Ticket resale platforms (also owned by Ticketmaster) charge ANOTHER fee
• Near-monopoly means no alternatives

Fans deserve transparent, fair pricing.`,
    targetCompany: 'Ticketmaster',
    successCriteria: `1. All-in pricing displayed upfront (no surprise fees at checkout)
2. Service fees capped at 10% of base ticket price
3. End dynamic pricing—tickets sold at fixed prices
4. Allow ticket transfers without fees
5. Consent decree from DOJ antitrust case requires these changes`,
    creator: 4,
    coSigners: [0, 1, 2, 3],
  },
];

async function seedDemands() {
  console.log('🌱 Starting demand seed...');

  // Sign in to existing demo users to get UIDs
  console.log('\n📧 Signing in to demo users...');
  const userCredentials: { email: string; uid: string; name: string }[] = [];
  
  for (const user of DEMO_USERS) {
    try {
      const userCred = await signInWithEmailAndPassword(auth, user.email, user.password);
      userCredentials.push({ 
        email: user.email, 
        uid: userCred.user.uid,
        name: user.name
      });
      console.log(`✓ Signed in: ${user.name} (${userCred.user.uid})`);
    } catch (error: any) {
      console.error(`✗ Could not sign in ${user.email}:`, error.message);
    }
  }

  if (userCredentials.length === 0) {
    console.error('❌ No users found. Cannot seed demands.');
    return;
  }

  console.log(`\n📋 Creating ${DEMO_DEMANDS.length} demo demands...`);
  let created = 0;

  for (const demand of DEMO_DEMANDS) {
    try {
      const creatorCred = userCredentials[demand.creator];
      if (!creatorCred) {
        console.log(`⚠ Skipping (creator not found): ${demand.title}`);
        continue;
      }

      const coSignerUids = demand.coSigners
        .map(idx => userCredentials[idx]?.uid)
        .filter(uid => uid !== undefined);

      const demandData = {
        title: demand.title,
        description: demand.description,
        targetCompany: demand.targetCompany,
        successCriteria: demand.successCriteria,
        creatorId: creatorCred.uid,
        creatorName: creatorCred.name,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        status: 'active',
        coSigners: coSignerUids,
        coSignCount: coSignerUids.length,
        visibility: 'public',
        tags: ['DEMO'],
        currentSpokespersonId: creatorCred.uid,
        spokespersonVotes: [],
        spokespersonVotingOpen: false,
      };

      await addDoc(collection(db, 'demands'), demandData);
      created++;
      console.log(`✓ Created: ${demand.title.substring(0, 60)}...`);
    } catch (error: any) {
      console.error(`✗ Error creating demand:`, error.message);
    }
  }

  console.log(`\n✅ Created ${created}/${DEMO_DEMANDS.length} demands`);
  console.log('\n⚠️ All demo data tagged with [DEMO] for easy removal');
}

seedDemands().then(() => process.exit(0));
