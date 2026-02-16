/**
 * DEMO DATA SEEDER
 * Creates mock accounts, demands, and interactions for demonstration
 * All demo data is prefixed with [DEMO] for easy removal
 */

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, Timestamp, updateDoc, doc, arrayUnion } from 'firebase/firestore';

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

interface DemoUser {
  email: string;
  password: string;
  uid?: string;
  displayName: string;
}

interface DemoDemand {
  title: string;
  description: string;
  targetCompany: string;
  successCriteria: string;
  creatorEmail: string;
  coSignerEmails: string[];
  status: 'active' | 'met' | 'closed';
}

const demoUsers: DemoUser[] = [
  { email: 'demo1@demand.local', password: 'DemoPass123!', displayName: '[DEMO] Sarah Chen' },
  { email: 'demo2@demand.local', password: 'DemoPass123!', displayName: '[DEMO] Marcus Johnson' },
  { email: 'demo3@demand.local', password: 'DemoPass123!', displayName: '[DEMO] Emma Rodriguez' },
  { email: 'demo4@demand.local', password: 'DemoPass123!', displayName: '[DEMO] David Park' },
  { email: 'demo5@demand.local', password: 'DemoPass123!', displayName: '[DEMO] Lisa Thompson' },
];

const demoDemands: DemoDemand[] = [
  {
    title: '[DEMO] Amazon: Stop Mandatory Return-to-Office Policy',
    description: `Amazon announced a mandatory 5-day return to office policy starting January 2025, eliminating the flexible hybrid work that employees have successfully used for years.

This policy:
- Ignores proven productivity gains from remote work
- Forces unnecessary commutes (environmental impact)
- Disproportionately impacts working parents and caregivers
- Contradicts Amazon's own climate pledges
- Will cause mass exodus of talented employees

We demand Amazon reverse this anti-worker policy and maintain hybrid flexibility.`,
    targetCompany: 'Amazon',
    successCriteria: `1. Amazon publicly announces continuation or expansion of hybrid work options
2. Employees retain ability to work remotely at least 2-3 days per week
3. No penalties or career limitations for remote workers
4. Policy change communicated by end of Q1 2026`,
    creatorEmail: 'demo1@demand.local',
    coSignerEmails: ['demo2@demand.local', 'demo3@demand.local', 'demo4@demand.local', 'demo5@demand.local'],
    status: 'active',
  },
  {
    title: '[DEMO] Meta: End Surveillance Advertising on Instagram',
    description: `Meta's surveillance-based advertising model on Instagram tracks users across the web, building invasive profiles without meaningful consent.

The current system:
- Tracks users even when not using Instagram
- Shares data with thousands of third parties
- Manipulates users with algorithmic feeds designed for addiction
- Particularly harmful to teenagers' mental health

European regulators have fined Meta billions for privacy violations. It's time for real change.`,
    targetCompany: 'Meta (Instagram)',
    successCriteria: `1. Offer chronological feed as default option (not buried in settings)
2. Allow users to opt-out of cross-site tracking entirely
3. End data sharing with third-party advertisers without explicit per-case consent
4. Publish transparency report showing exactly what data is collected and how it's used
5. Independent audit of data practices by end of Q2 2026`,
    creatorEmail: 'demo2@demand.local',
    coSignerEmails: ['demo1@demand.local', 'demo3@demand.local', 'demo5@demand.local'],
    status: 'active',
  },
  {
    title: '[DEMO] Starbucks: Pay Fair Wages to Baristas',
    description: `Starbucks reported record profits of $35.9 billion in 2024, yet baristas—the workers who create that value—struggle to afford rent.

The reality:
- Starting wages: $12-15/hr in most markets (below living wage)
- Inconsistent scheduling makes second jobs impossible
- Union-busting tactics against workers seeking better conditions
- CEO made $14.7M last year (980x median barista salary)

Starbucks can afford to pay fairly. They choose not to.`,
    targetCompany: 'Starbucks',
    successCriteria: `1. Minimum wage of $20/hr for all baristas nationwide
2. Guaranteed minimum 25 hours/week for part-time workers
3. Predictable schedules posted 2 weeks in advance
4. Stop union-busting: Recognize and negotiate with union stores in good faith
5. Changes implemented by Q3 2026`,
    creatorEmail: 'demo3@demand.local',
    coSignerEmails: ['demo1@demand.local', 'demo2@demand.local', 'demo4@demand.local'],
    status: 'active',
  },
  {
    title: '[DEMO] Tesla: Recall All Cybertrucks for Safety Issues',
    description: `Tesla's Cybertruck has experienced multiple critical safety failures since launch:

Documented issues:
- Accelerator pedal detachment (April 2024 recall)
- "Frunk" injuries from closing mechanism
- Windshield wiper failures at highway speeds
- Sharp exposed edges causing injuries
- Rust appearing within weeks of purchase

Despite these issues, Tesla continues selling new units. This is unacceptable.`,
    targetCompany: 'Tesla',
    successCriteria: `1. Immediate recall of all Cybertrucks for comprehensive safety inspection
2. Free repairs/replacements for all identified defects
3. Third-party safety audit (not Tesla-conducted)
4. Compensation for injured customers
5. Public safety report published by end of Q2 2026`,
    creatorEmail: 'demo4@demand.local',
    coSignerEmails: ['demo2@demand.local', 'demo3@demand.local'],
    status: 'active',
  },
  {
    title: '[DEMO] Ticketmaster: End Junk Fees and Dynamic Pricing',
    description: `Ticketmaster's monopoly on live event ticketing has led to outrageous fees and exploitative pricing.

The problem:
- "Service fees" often 30-50% of ticket price (for what service?)
- Dynamic pricing gouges fans (Taylor Swift tickets hit $5,000+)
- Ticket resale platforms (also owned by Ticketmaster) charge ANOTHER fee
- Near-monopoly means no alternatives

Fans deserve transparent, fair pricing.`,
    targetCompany: 'Ticketmaster',
    successCriteria: `1. All-in pricing displayed upfront (no surprise fees at checkout)
2. Service fees capped at 10% of base ticket price
3. End dynamic pricing—tickets sold at fixed prices
4. Allow ticket transfers without fees
5. Consent decree from DOJ antitrust case requires these changes`,
    creatorEmail: 'demo5@demand.local',
    coSignerEmails: ['demo1@demand.local', 'demo2@demand.local', 'demo3@demand.local', 'demo4@demand.local'],
    status: 'active',
  },
  {
    title: '[DEMO] Shein: Stop Using Forced Labor in Supply Chain',
    description: `Investigations have found strong evidence that Shein's ultra-cheap fast fashion relies on forced labor in Xinjiang, China.

Evidence:
- Prices impossible without exploited labor ($3 shirts?)
- Supply chain opacity (won't disclose factory locations)
- Ties to Xinjiang cotton (documented forced labor region)
- Bloomberg investigation found labor violations

Shein must prove their supply chain is ethical or face boycott.`,
    targetCompany: 'Shein',
    successCriteria: `1. Independent third-party audit of entire supply chain
2. Public disclosure of all factory locations
3. Proof of fair wages (documented pay stubs from workers)
4. End use of Xinjiang cotton
5. Audit results published by Q3 2026`,
    creatorEmail: 'demo1@demand.local',
    coSignerEmails: ['demo3@demand.local', 'demo4@demand.local', 'demo5@demand.local'],
    status: 'active',
  },
];

async function seedDemoData() {
  console.log('🌱 Starting demo data seed...');

  // Create demo users
  console.log('\n📧 Creating demo user accounts...');
  for (const user of demoUsers) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
      user.uid = userCredential.user.uid;
      console.log(`✓ Created: ${user.displayName} (${user.email})`);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠ Already exists: ${user.email}`);
        // You'll need to manually get UID from Firebase console
      } else {
        console.error(`✗ Error creating ${user.email}:`, error.message);
      }
    }
  }

  console.log('\n📋 Creating demo demands...');
  for (const demand of demoDemands) {
    try {
      const creator = demoUsers.find(u => u.email === demand.creatorEmail);
      if (!creator?.uid) {
        console.log(`⚠ Skipping demand (creator not found): ${demand.title}`);
        continue;
      }

      const coSignerUids = demand.coSignerEmails
        .map(email => demoUsers.find(u => u.email === email)?.uid)
        .filter(uid => uid !== undefined);

      const demandData = {
        title: demand.title,
        description: demand.description,
        targetCompany: demand.targetCompany,
        successCriteria: demand.successCriteria,
        creatorId: creator.uid,
        creatorName: creator.displayName,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        status: demand.status,
        coSigners: coSignerUids,
        coSignCount: coSignerUids.length,
        visibility: 'public',
        tags: ['DEMO'],
      };

      const docRef = await addDoc(collection(db, 'demands'), demandData);
      console.log(`✓ Created: ${demand.title.substring(0, 50)}...`);
    } catch (error: any) {
      console.error(`✗ Error creating demand:`, error.message);
    }
  }

  console.log('\n✅ Demo data seeding complete!');
  console.log('\nDemo credentials:');
  console.log('Email: demo1@demand.local through demo5@demand.local');
  console.log('Password: DemoPass123!');
  console.log('\n⚠️ All demo data tagged with [DEMO] for easy removal');
}

seedDemoData();
