/**
 * Add the 6th demo demand (Shein)
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

async function addSheinDemand() {
  console.log('🌱 Adding Shein demand...');

  // Sign in to get UIDs
  const userCredentials: { email: string; uid: string; name: string }[] = [];
  for (const user of DEMO_USERS) {
    try {
      const userCred = await signInWithEmailAndPassword(auth, user.email, user.password);
      userCredentials.push({ 
        email: user.email, 
        uid: userCred.user.uid,
        name: user.name
      });
    } catch (error: any) {
      console.error(`✗ Could not sign in ${user.email}:`, error.message);
    }
  }

  const demandData = {
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
    creatorId: userCredentials[0].uid,
    creatorName: userCredentials[0].name,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    status: 'active',
    coSigners: [userCredentials[2].uid, userCredentials[3].uid, userCredentials[4].uid],
    coSignCount: 3,
    visibility: 'public',
    tags: ['DEMO'],
    currentSpokespersonId: userCredentials[0].uid,
    spokespersonVotes: [],
    spokespersonVotingOpen: false,
  };

  await addDoc(collection(db, 'demands'), demandData);
  console.log('✓ Created: [DEMO] Shein demand');
  console.log('✅ Done!');
}

addSheinDemand().then(() => process.exit(0));
