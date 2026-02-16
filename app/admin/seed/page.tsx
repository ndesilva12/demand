'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

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
  {
    title: '[DEMO] Shein: Stop Using Forced Labor in Supply Chain',
    description: `Investigations have found strong evidence that Shein's ultra-cheap fast fashion relies on forced labor in Xinjiang, China.

Evidence:
• Prices impossible without exploited labor ($3 shirts?)
• Supply chain opacity (won't disclose factory locations)
• Ties to Xinjiang cotton (documented forced labor region)
• Bloomberg investigation found labor violations

Shein must prove their supply chain is ethical or face boycott.`,
    targetCompany: 'Shein',
    successCriteria: `1. Independent third-party audit of entire supply chain
2. Public disclosure of all factory locations
3. Proof of fair wages (documented pay stubs from workers)
4. End use of Xinjiang cotton
5. Audit results published by Q3 2026`,
    creator: 0,
    coSigners: [2, 3, 4],
  },
];

export default function SeedDemoPage() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const seedData = async () => {
    setLoading(true);
    setStatus('🌱 Starting seed...\n');

    const userUids: string[] = [];
    const userCredentials: { email: string; uid: string }[] = [];

    // Create users
    setStatus(prev => prev + '\n📧 Creating demo users...\n');
    for (const user of DEMO_USERS) {
      try {
        const userCred = await createUserWithEmailAndPassword(auth, user.email, user.password);
        userUids.push(userCred.user.uid);
        userCredentials.push({ email: user.email, uid: userCred.user.uid });
        setStatus(prev => prev + `✓ Created: ${user.name}\n`);
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          try {
            // If user exists, try to get their UID
            const existingUser = await signInWithEmailAndPassword(auth, user.email, user.password);
            userUids.push(existingUser.user.uid);
            userCredentials.push({ email: user.email, uid: existingUser.user.uid });
            setStatus(prev => prev + `⚠ User existed: ${user.name}\n`);
          } catch (signInError) {
            setStatus(prev => prev + `✗ Could not sign in existing user: ${user.email}\n`);
          }
        } else {
          setStatus(prev => prev + `✗ Error creating user: ${error.message}\n`);
        }
      }
    }

    // Create demands
    setStatus(prev => prev + '\n📋 Creating demo demands...\n');
    for (const demand of DEMO_DEMANDS) {
      try {
        const creatorCredential = userCredentials[demand.creator];
        const coSignerUids = demand.coSigners.map(idx => userCredentials[idx].uid);

        const demandData = {
          title: demand.title,
          description: demand.description,
          targetCompany: demand.targetCompany,
          successCriteria: demand.successCriteria,
          creatorId: creatorCredential.uid,
          creatorName: DEMO_USERS[demand.creator].name,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          status: 'active',
          coSigners: coSignerUids,
          coSignCount: coSignerUids.length,
          visibility: 'public',
          tags: ['DEMO'],
        };

        // Attempt to add demand
        const docRef = await addDoc(collection(db, 'demands'), demandData);
        
        setStatus(prev => prev + `✓ Created: ${demand.title}\n`);
      } catch (error: any) {
        setStatus(prev => prev + `✗ Error creating demand: ${error.message}\n`);
        setStatus(prev => prev + `   Details: ${JSON.stringify(error, null, 2)}\n`);
      }
    }

    setStatus(prev => prev + '\n✅ Done!\n\nDemo credentials:\nEmails: demo1@demand.local through demo5@demand.local\nPassword: DemoPass123!\n');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#00aaff] mb-4">Seed Demo Data</h1>
        <p className="text-gray-300 mb-8">
          This will create demo users and demands. All demo data is tagged with [DEMO] for easy removal.
        </p>

        <button
          onClick={seedData}
          disabled={loading}
          className="bg-[#00aaff] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#0088cc] transition disabled:opacity-50 mb-8"
        >
          {loading ? 'Creating...' : 'Create Demo Data'}
        </button>

        {status && (
          <pre className="bg-gray-800 p-4 rounded-lg text-sm text-gray-300 whitespace-pre-wrap font-mono border border-gray-700">
            {status}
          </pre>
        )}
      </div>
    </div>
  );
}
