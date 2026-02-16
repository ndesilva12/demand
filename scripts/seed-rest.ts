/**
 * MASSIVE SEED via Firestore REST API
 * Uses the REST API with API key to bypass SDK auth requirements
 */

const PROJECT_ID = 'demand-c5b0d';
const API_KEY = 'AIzaSyAEwmgiNRIK_6uIMHbZOpM-u77Am-sy8gk';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// First, sign in anonymously or with email to get an auth token
async function getAuthToken(): Promise<string> {
  const signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
  const signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
  
  const email = 'seed-admin@demand.app';
  const password = 'SeedAdmin2026!!';
  
  // Try sign in first, then sign up
  let res = await fetch(signInUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  let data = await res.json();
  
  if (!data.idToken) {
    res = await fetch(signUpUrl, {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });
    data = await res.json();
  }
  
  if (!data.idToken) {
    console.error('Auth response:', data);
    throw new Error('Failed to get auth token');
  }
  return data.idToken;
}

function toFirestoreValue(val: any): any {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'string') return { stringValue: val };
  if (typeof val === 'number') {
    if (Number.isInteger(val)) return { integerValue: String(val) };
    return { doubleValue: val };
  }
  if (typeof val === 'boolean') return { booleanValue: val };
  if (val instanceof Date) return { timestampValue: val.toISOString() };
  if (Array.isArray(val)) return { arrayValue: { values: val.map(toFirestoreValue) } };
  if (typeof val === 'object') {
    const fields: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

function toFirestoreDoc(data: Record<string, any>): { fields: Record<string, any> } {
  const fields: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    fields[key] = toFirestoreValue(value);
  }
  return { fields };
}

async function writeDoc(token: string, collectionPath: string, docId: string, data: Record<string, any>) {
  const url = `${BASE_URL}/${collectionPath}/${docId}?key=${API_KEY}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(toFirestoreDoc(data)),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Write failed for ${collectionPath}/${docId}: ${res.status} ${err}`);
  }
}

async function addDoc(token: string, collectionPath: string, data: Record<string, any>) {
  const url = `${BASE_URL}/${collectionPath}?key=${API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(toFirestoreDoc(data)),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Add failed for ${collectionPath}: ${res.status} ${err}`);
  }
}

// Helper functions
function randomDate(monthsBack: number): Date {
  const now = Date.now();
  const past = now - monthsBack * 30 * 24 * 60 * 60 * 1000;
  return new Date(past + Math.random() * (now - past));
}
function randomItem<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randomInt(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }

// ============ DATA (abbreviated inline for REST approach) ============

const USERS = [
  { id: 'user_001', name: 'Sarah Chen', bio: 'Consumer rights advocate. Former FTC policy analyst. Fighting for transparency in tech.', reputation: 4850, badges: ['Pioneer', 'Verified', 'Top Contributor'], activity: 'power' },
  { id: 'user_002', name: 'Marcus Johnson', bio: 'Community organizer from Atlanta. Believe in collective action to hold corporations accountable.', reputation: 3720, badges: ['Verified', 'Coalition Builder'], activity: 'power' },
  { id: 'user_003', name: 'Emma Rodriguez', bio: 'Healthcare worker tired of watching patients struggle with medical bills.', reputation: 2890, badges: ['Healthcare Champion', 'Verified'], activity: 'power' },
  { id: 'user_004', name: 'David Park', bio: 'Software engineer who cares about digital rights and privacy.', reputation: 3150, badges: ['Tech Advocate', 'Pioneer'], activity: 'power' },
  { id: 'user_005', name: 'Lisa Thompson', bio: 'Environmental journalist covering corporate sustainability claims.', reputation: 2650, badges: ['Verified', 'Investigator'], activity: 'power' },
  { id: 'user_006', name: 'Aisha Okonkwo', bio: 'Law student focused on consumer protection.', reputation: 1920, badges: ['Rising Star'], activity: 'active' },
  { id: 'user_007', name: 'James Whitfield', bio: 'Retired teacher fighting for corporate fairness.', reputation: 2100, badges: ['Veteran Advocate'], activity: 'active' },
  { id: 'user_008', name: 'Priya Sharma', bio: 'Data scientist using numbers to expose corporate malpractice.', reputation: 2450, badges: ['Data Driven', 'Verified'], activity: 'power' },
  { id: 'user_009', name: 'Carlos Mendez', bio: 'Small business owner fighting monopolistic practices.', reputation: 1680, badges: ['Small Biz Champion'], activity: 'active' },
  { id: 'user_010', name: 'Rachel Kim', bio: 'Parent and PTA president advocating for safer products.', reputation: 1540, badges: ['Family First'], activity: 'active' },
  { id: 'user_011', name: 'Tyler Brooks', bio: 'Gig economy worker demanding fair treatment.', reputation: 980, badges: ['Worker Voice'], activity: 'active' },
  { id: 'user_012', name: 'Fatima Al-Rashid', bio: 'Financial literacy educator.', reputation: 2280, badges: ['Finance Expert', 'Verified'], activity: 'active' },
  { id: 'user_013', name: 'Nate Sullivan', bio: 'Rural broadband activist.', reputation: 1350, badges: ['Digital Divide Fighter'], activity: 'active' },
  { id: 'user_014', name: 'Mei-Lin Wu', bio: 'Food safety researcher.', reputation: 1870, badges: ['Food Safety'], activity: 'active' },
  { id: 'user_015', name: 'Derek Foster', bio: 'Union electrician supporting working people.', reputation: 1120, badges: ['Labor Ally'], activity: 'active' },
  { id: 'user_016', name: 'Sofia Petrov', bio: 'Climate activist and renewable energy consultant.', reputation: 2050, badges: ['Climate Champion'], activity: 'active' },
  { id: 'user_017', name: 'Jordan Hayes', bio: 'Disability rights advocate.', reputation: 1430, badges: ['Accessibility Advocate'], activity: 'active' },
  { id: 'user_018', name: 'Olivia Chang', bio: 'Pharmacist who sees drug pricing impact daily.', reputation: 1760, badges: ['Healthcare Voice'], activity: 'active' },
  { id: 'user_019', name: 'Brandon Mitchell', bio: 'College student fighting predatory lending.', reputation: 890, badges: ['Student Voice'], activity: 'casual' },
  { id: 'user_020', name: 'Nina Kovalenko', bio: 'Immigrant small business owner.', reputation: 720, badges: [], activity: 'casual' },
  { id: 'user_021', name: 'Will Hernandez', bio: 'Stay-at-home dad fighting subscription traps.', reputation: 650, badges: [], activity: 'casual' },
  { id: 'user_022', name: 'Tanya Okafor', bio: 'Nurse practitioner in Chicago.', reputation: 1100, badges: ['Healthcare Voice'], activity: 'casual' },
  { id: 'user_023', name: 'Alex Rivera', bio: 'Freelance designer fighting for fair platform fees.', reputation: 540, badges: [], activity: 'casual' },
  { id: 'user_024', name: 'Hannah Goldstein', bio: 'Public interest attorney.', reputation: 2340, badges: ['Legal Eagle', 'Verified'], activity: 'active' },
  { id: 'user_025', name: 'Chris Nakamura', bio: 'Cybersecurity professional.', reputation: 1560, badges: ['Privacy Guard'], activity: 'active' },
  { id: 'user_026', name: 'Destiny Williams', bio: 'Proud mom done with shrinkflation.', reputation: 430, badges: [], activity: 'casual' },
  { id: 'user_027', name: 'Omar Farouk', bio: 'Mechanical engineer against planned obsolescence.', reputation: 780, badges: ['Repair Advocate'], activity: 'casual' },
  { id: 'user_028', name: 'Jade Morales', bio: 'Social worker advocating for communities.', reputation: 960, badges: ['Community Voice'], activity: 'casual' },
  { id: 'user_029', name: 'Ryan O\'Brien', bio: 'Former bank employee turned whistleblower.', reputation: 1890, badges: ['Insider', 'Verified'], activity: 'active' },
  { id: 'user_030', name: 'Amara Diallo', bio: 'International student studying public policy.', reputation: 340, badges: [], activity: 'new' },
  { id: 'user_031', name: 'Kevin Tran', bio: 'Restaurant owner fighting delivery platform fees.', reputation: 1240, badges: ['Small Biz Champion'], activity: 'active' },
  { id: 'user_032', name: 'Lauren McCarthy', bio: 'Environmental scientist.', reputation: 1670, badges: ['Science Based'], activity: 'active' },
  { id: 'user_033', name: 'Rashid Hassan', bio: 'Taxi driver for 20 years.', reputation: 580, badges: ['Worker Voice'], activity: 'casual' },
  { id: 'user_034', name: 'Bethany Cruz', bio: 'Teacher in rural Oklahoma.', reputation: 870, badges: [], activity: 'casual' },
  { id: 'user_035', name: 'Darnell Washington', bio: 'Personal trainer.', reputation: 420, badges: [], activity: 'casual' },
  { id: 'user_036', name: 'Ingrid Larsson', bio: 'Sustainability consultant.', reputation: 1340, badges: ['Verified'], activity: 'active' },
  { id: 'user_037', name: 'Tony Rizzo', bio: 'Auto mechanic and right-to-repair advocate.', reputation: 910, badges: ['Repair Advocate'], activity: 'casual' },
  { id: 'user_038', name: 'Michelle Patel', bio: 'Pediatrician concerned about children\'s online safety.', reputation: 1560, badges: ['Child Safety'], activity: 'active' },
  { id: 'user_039', name: 'Greg Olsen', bio: 'Retired military.', reputation: 680, badges: [], activity: 'casual' },
  { id: 'user_040', name: 'Yuki Tanaka', bio: 'Game developer against predatory microtransactions.', reputation: 1020, badges: ['Gamer Voice'], activity: 'active' },
  { id: 'user_041', name: 'Patricia Nguyen', bio: 'Accountant and financial transparency advocate.', reputation: 760, badges: [], activity: 'casual' },
  { id: 'user_042', name: 'Malik Robinson', bio: 'Hip-hop artist amplifying consumer voices.', reputation: 2100, badges: ['Amplifier', 'Verified'], activity: 'active' },
  { id: 'user_043', name: 'Heather Stewart', bio: 'Registered dietitian.', reputation: 890, badges: ['Food Safety'], activity: 'casual' },
  { id: 'user_044', name: 'Ben Kowalski', bio: 'IT support technician.', reputation: 540, badges: [], activity: 'casual' },
  { id: 'user_045', name: 'Zara Ahmed', bio: 'Journalist covering corporate accountability.', reputation: 1980, badges: ['Media', 'Verified'], activity: 'active' },
  { id: 'user_046', name: 'Christopher Lee', bio: 'Senior citizen on fixed income.', reputation: 470, badges: [], activity: 'new' },
  { id: 'user_047', name: 'Diana Flores', bio: 'Immigration attorney.', reputation: 1230, badges: ['Community Voice'], activity: 'active' },
  { id: 'user_048', name: 'Sean Murphy', bio: 'Construction foreman.', reputation: 620, badges: ['Worker Voice'], activity: 'casual' },
  { id: 'user_049', name: 'Tamara Jones', bio: 'School bus driver and union rep.', reputation: 510, badges: [], activity: 'casual' },
  { id: 'user_050', name: 'Luis Gutierrez', bio: 'Farm worker advocate.', reputation: 840, badges: ['Environmental Justice'], activity: 'casual' },
  { id: 'user_051', name: 'Rebecca Adler', bio: 'Joined because of the insulin pricing demand.', reputation: 120, badges: [], activity: 'new' },
  { id: 'user_052', name: 'Kwame Asante', bio: 'Political science professor.', reputation: 1890, badges: ['Academic', 'Verified'], activity: 'active' },
  { id: 'user_053', name: 'Jenny Park', bio: 'Just signed up! Excited to join.', reputation: 50, badges: [], activity: 'new' },
  { id: 'user_054', name: 'Douglas Wright', bio: 'Checking this out after social media.', reputation: 30, badges: [], activity: 'new' },
  { id: 'user_055', name: 'Maria Santos', bio: 'Single mom fighting for fair wages.', reputation: 280, badges: [], activity: 'new' },
];

const COMPANIES = [
  { name: 'Apple', industry: 'Technology', revenue: '$394B', employees: 164000, description: 'Consumer electronics and software giant.', pressureScore: 78 },
  { name: 'Google', industry: 'Technology', revenue: '$307B', employees: 182000, description: 'Search, advertising, and cloud computing giant.', pressureScore: 85 },
  { name: 'Amazon', industry: 'E-Commerce / Technology', revenue: '$575B', employees: 1540000, description: 'E-commerce and cloud computing behemoth.', pressureScore: 92 },
  { name: 'Meta', industry: 'Technology / Social Media', revenue: '$135B', employees: 67000, description: 'Social media conglomerate.', pressureScore: 88 },
  { name: 'Microsoft', industry: 'Technology', revenue: '$245B', employees: 228000, description: 'Enterprise software and cloud powerhouse.', pressureScore: 45 },
  { name: 'JPMorgan Chase', industry: 'Financial Services', revenue: '$178B', employees: 309000, description: 'Largest US bank by assets.', pressureScore: 72 },
  { name: 'Bank of America', industry: 'Financial Services', revenue: '$99B', employees: 217000, description: 'Second-largest US bank.', pressureScore: 68 },
  { name: 'Eli Lilly', industry: 'Pharmaceuticals', revenue: '$41B', employees: 43000, description: 'Major pharmaceutical and insulin manufacturer.', pressureScore: 95 },
  { name: 'UnitedHealth Group', industry: 'Healthcare / Insurance', revenue: '$372B', employees: 400000, description: 'Largest US health insurer.', pressureScore: 90 },
  { name: 'McDonald\'s', industry: 'Food / Restaurant', revenue: '$25B', employees: 150000, description: 'World\'s largest fast food chain.', pressureScore: 65 },
  { name: 'DoorDash', industry: 'Technology / Food Delivery', revenue: '$8.6B', employees: 19000, description: 'Leading food delivery platform.', pressureScore: 58 },
  { name: 'Kroger', industry: 'Retail / Grocery', revenue: '$150B', employees: 430000, description: 'Largest US supermarket chain.', pressureScore: 42 },
  { name: 'ExxonMobil', industry: 'Energy / Oil & Gas', revenue: '$344B', employees: 62000, description: 'Largest publicly traded oil company.', pressureScore: 88 },
  { name: 'Duke Energy', industry: 'Energy / Utilities', revenue: '$29B', employees: 27600, description: 'Major US electric utility.', pressureScore: 55 },
  { name: 'Tesla', industry: 'Automotive / Energy', revenue: '$97B', employees: 140000, description: 'Electric vehicle and energy company.', pressureScore: 52 },
  { name: 'Walmart', industry: 'Retail', revenue: '$648B', employees: 2100000, description: 'World\'s largest company by revenue.', pressureScore: 70 },
  { name: 'AT&T', industry: 'Telecommunications', revenue: '$122B', employees: 160000, description: 'Major US telecom provider.', pressureScore: 75 },
  { name: 'Comcast', industry: 'Telecommunications / Media', revenue: '$121B', employees: 186000, description: 'Largest US cable company and ISP.', pressureScore: 80 },
  { name: 'Netflix', industry: 'Entertainment / Streaming', revenue: '$39B', employees: 13000, description: 'Leading streaming service.', pressureScore: 48 },
  { name: 'Ticketmaster', industry: 'Entertainment / Events', revenue: '$23B', employees: 44000, description: 'Dominant ticket sales platform.', pressureScore: 93 },
  { name: 'Navient', industry: 'Financial Services / Education', revenue: '$3.2B', employees: 5400, description: 'Major student loan servicer.', pressureScore: 82 },
  { name: 'Shein', industry: 'Retail / Fashion', revenue: '$45B', employees: 16000, description: 'Fast fashion e-commerce giant.', pressureScore: 76 },
];

// Import demands data from the original seed file
// For brevity, including key demands inline
const DEMANDS: any[] = [
  { id: 'demand_001', title: 'Apple Must Support Right-to-Repair for All Devices', description: 'Apple has systematically made it harder for consumers and independent repair shops to fix their own devices. From proprietary screws to parts pairing that disables functionality, Apple\'s repair restrictions cost consumers billions annually and create massive e-waste.\n\nWe demand that Apple:\n1. End all parts pairing restrictions\n2. Make genuine replacement parts available at fair prices\n3. Publish complete repair manuals\n4. Remove software locks on non-Apple parts\n5. Support federal right-to-repair legislation\n\nThe average iPhone repair at an Apple Store costs 2-3x what an independent shop would charge. This artificial monopoly on repairs hurts consumers, destroys small businesses, and contributes to 50 million tons of e-waste annually. Apple generated $394 billion in revenue last year. They can afford to let people fix their own devices.', targetCompany: 'Apple', category: 'Technology', successCriteria: 'Apple publicly commits to ending parts pairing and makes parts available to independent shops.', creatorId: 'user_004', creatorName: 'David Park', status: 'active', coSignCount: 34521, tags: ['right-to-repair', 'e-waste', 'consumer-rights'], escalationStage: 'movement' },
  { id: 'demand_002', title: 'Google: Stop Tracking Users Without Meaningful Consent', description: 'Google\'s data collection practices have gone far beyond acceptable. Despite promises of transparency, Google continues to track user location, browsing habits, and personal information through dozens of hidden settings and dark patterns.\n\nWe demand that Google:\n1. Implement a single "Stop All Tracking" toggle\n2. Make tracking opt-IN by default\n3. Stop using dark patterns\n4. Provide clear explanations of data collected\n5. Allow one-click permanent data deletion\n6. Stop cross-site tracking\n\nPrivacy isn\'t a luxury feature — it\'s a fundamental right. Google made $307 billion last year by monetizing our personal data.', targetCompany: 'Google', category: 'Technology', successCriteria: 'Google implements single-click tracking opt-out and makes tracking opt-in by default.', creatorId: 'user_025', creatorName: 'Chris Nakamura', status: 'active', coSignCount: 47832, tags: ['privacy', 'data-rights', 'tracking'], escalationStage: 'movement' },
  { id: 'demand_003', title: 'Amazon: Guarantee Safe Working Conditions in All Warehouses', description: 'Amazon warehouse workers face some of the most dangerous conditions in logistics. Injury rates are nearly double the industry average. Workers report being forced to skip bathroom breaks, work through injuries, and meet impossible quotas.\n\nWe demand that Amazon:\n1. Reduce injury rates to industry average within 18 months\n2. Install climate control in ALL warehouses\n3. Eliminate dangerous productivity quotas\n4. Allow unrestricted bathroom breaks\n5. Submit to independent quarterly safety audits\n6. Provide full healthcare for work injuries\n7. End retaliation against safety reporters\n\nAmazon is worth $2 trillion. There is no excuse for these injury rates.', targetCompany: 'Amazon', category: 'Technology', successCriteria: 'Amazon reduces injury rates to industry average and submits to independent safety audits.', creatorId: 'user_011', creatorName: 'Tyler Brooks', status: 'active', coSignCount: 52108, tags: ['worker-safety', 'labor-rights', 'warehouses'], escalationStage: 'movement' },
  { id: 'demand_004', title: 'Meta Must Make Algorithm Transparency a Default', description: 'Meta\'s algorithms on Facebook and Instagram maximize engagement at the expense of mental health and public discourse. Internal research shows algorithms amplify harmful content and contribute to teen mental health crises.\n\nWe demand:\n1. Publish complete ranking signals\n2. Toggle for chronological, non-algorithmic feed\n3. Show WHY content was shown\n4. Stop amplifying flagged harmful content\n5. Independent algorithmic audits\n6. Age verification and restrictions for under 18\n\nMeta made $135 billion by keeping us scrolling. We deserve transparency.', targetCompany: 'Meta', category: 'Technology', successCriteria: 'Meta publishes algorithm signals, offers chronological feed, allows independent audits.', creatorId: 'user_008', creatorName: 'Priya Sharma', status: 'active', coSignCount: 38945, tags: ['algorithm-transparency', 'mental-health', 'social-media'], escalationStage: 'movement' },
  { id: 'demand_005', title: 'End Overdraft Fees: Banks Must Stop Profiting from Poverty', description: 'Major US banks charge over $30 billion in overdraft fees annually, disproportionately impacting low-income Americans. JPMorgan Chase alone collected $1.9 billion in overdraft fees last year. 80% of fees are paid by just 9% of account holders.\n\nWe demand that JPMorgan Chase:\n1. Eliminate all overdraft fees\n2. Implement real-time balance notifications\n3. Offer free short-term credit for small overdrafts\n4. Stop reordering transactions to maximize fees\n5. Refund fees from past 12 months\n\nChase reported $50 billion in profit last year. They don\'t need overdraft fees.', targetCompany: 'JPMorgan Chase', category: 'Finance', successCriteria: 'JPMorgan Chase eliminates overdraft fees and implements real-time balance alerts.', creatorId: 'user_012', creatorName: 'Fatima Al-Rashid', status: 'active', coSignCount: 28734, tags: ['overdraft-fees', 'banking', 'financial-justice'], escalationStage: 'campaign' },
  { id: 'demand_006', title: 'Cap Insulin Prices at $35 for All Americans', description: 'Insulin costs $300+ per vial in the US vs $30 in Canada and $8 in Australia. 1.3 million Americans ration insulin due to cost. Eli Lilly has raised prices over 1,200% in two decades while production costs decreased.\n\nWe demand:\n1. Cap ALL insulin at $35/month regardless of insurance\n2. Eliminate patient assistance barriers\n3. Publish manufacturing cost data\n4. Stop lobbying against drug price regulation\n5. Establish hardship fund for uninsured diabetics\n\nInsulin was discovered in 1921 and its patent sold for $1. People are dying because they can\'t afford it.', targetCompany: 'Eli Lilly', category: 'Healthcare', successCriteria: 'Eli Lilly caps all insulin at $35/month for all Americans.', creatorId: 'user_003', creatorName: 'Emma Rodriguez', status: 'active', coSignCount: 67234, tags: ['insulin', 'drug-pricing', 'healthcare'], escalationStage: 'crisis' },
  { id: 'demand_007', title: 'UnitedHealth: Stop Denying Claims Using AI Algorithms', description: 'UnitedHealth uses an AI algorithm to automatically deny insurance claims with a 90% error rate on appeal. Patients are denied chemotherapy, emergency surgeries, and physical therapy without human review.\n\nWe demand:\n1. Cease AI claim denials immediately\n2. Require physician review for ALL denials\n3. Process appeals within 48 hours for urgent claims\n4. Publish denial/appeal/overturn rates\n5. Compensate patients harmed by algorithmic denials\n6. Independent audit of AI systems\n\nHealthcare decisions should be made by doctors, not profit-optimizing algorithms.', targetCompany: 'UnitedHealth Group', category: 'Healthcare', successCriteria: 'UnitedHealth stops AI denials, requires physician review, publishes data.', creatorId: 'user_022', creatorName: 'Tanya Okafor', status: 'active', coSignCount: 43567, tags: ['insurance-denials', 'AI', 'healthcare'], escalationStage: 'movement' },
  { id: 'demand_008', title: 'McDonald\'s: Pay All Workers a Living Wage of $20/hr', description: 'McDonald\'s workers earn $11-13/hr while the company generates $25B in revenue. CEO earned $18M. Company spent $6B on buybacks instead of workforce.\n\nWe demand:\n1. $20/hour minimum for ALL employees including franchise\n2. Healthcare for 25+ hour workers\n3. Predictable scheduling with 2 weeks notice\n4. End non-compete agreements for hourly workers\n5. 401(k) matching for all eligible employees\n\nWhen workers can\'t eat where they work, something is broken.', targetCompany: 'McDonald\'s', category: 'Food', successCriteria: 'McDonald\'s commits to $20/hr minimum including franchise employees.', creatorId: 'user_015', creatorName: 'Derek Foster', status: 'active', coSignCount: 31245, tags: ['living-wage', 'fast-food', 'worker-rights'], escalationStage: 'campaign' },
  { id: 'demand_009', title: 'DoorDash: Transparent Pricing and Fair Driver Pay', description: 'On a $30 order, DoorDash collects $13.50 in fees while the driver gets $4.50 before expenses. Restaurants pay 15-30% commissions.\n\nWe demand:\n1. Complete fee breakdown on every order\n2. $15/hour minimum for drivers after expenses\n3. Cap restaurant commissions at 15%\n4. Show actual restaurant prices vs DoorDash prices\n5. Stop using tips to subsidize base pay\n6. Accident insurance for drivers\n\nFood delivery platforms extract value from everyone except themselves.', targetCompany: 'DoorDash', category: 'Food', successCriteria: 'DoorDash implements fee transparency and guarantees $15/hr for drivers.', creatorId: 'user_031', creatorName: 'Kevin Tran', status: 'active', coSignCount: 18923, tags: ['gig-economy', 'food-delivery', 'transparency'], escalationStage: 'campaign' },
  { id: 'demand_010', title: 'Kroger: End Grocery Shrinkflation and Hidden Price Increases', description: 'Kroger embraces shrinkflation — reducing package sizes while maintaining prices. Internal communications revealed executives discussing strategies to increase prices beyond inflation.\n\nWe demand:\n1. Prominent unit pricing on ALL shelf labels\n2. "Size Changed" labels on reduced products\n3. Cap private-label price increases to verified cost increases\n4. Quarterly pricing transparency reports\n5. Consumer advisory board with veto power\n\nGroceries are necessities. Transparency is the bare minimum.', targetCompany: 'Kroger', category: 'Food', successCriteria: 'Kroger implements unit pricing and shrinkflation labeling.', creatorId: 'user_014', creatorName: 'Mei-Lin Wu', status: 'active', coSignCount: 22456, tags: ['shrinkflation', 'grocery', 'transparency'], escalationStage: 'campaign' },
  { id: 'demand_011', title: 'ExxonMobil: Honor Your Climate Pledges or Face Accountability', description: 'ExxonMobil spent decades funding climate denial while their scientists predicted climate change in the 1970s. In 2025, emissions INCREASED 3% despite net-zero pledges. Carbon capture is less than 1% of capex.\n\nWe demand:\n1. Binding emissions reduction plan with annual targets\n2. 20% capex to renewables by 2027\n3. Stop funding climate denial\n4. $10B fund for affected communities\n5. Tie executive pay to emissions targets\n6. Annual independent environmental audits\n\nThey knew. They lied. Time for accountability.', targetCompany: 'ExxonMobil', category: 'Energy', successCriteria: 'ExxonMobil publishes binding plan, allocates 20% to renewables, stops denial funding.', creatorId: 'user_005', creatorName: 'Lisa Thompson', status: 'active', coSignCount: 45678, tags: ['climate', 'emissions', 'greenwashing'], escalationStage: 'movement' },
  { id: 'demand_012', title: 'Duke Energy: Stop Raising Utility Rates on Fixed-Income Seniors', description: 'Duke Energy raised rates 47% over a decade while reporting record profits. They operate as a monopoly — customers can\'t switch.\n\nWe demand:\n1. Freeze rates for below 200% poverty level\n2. Progressive rate structure\n3. Cap exec pay at 50x median worker\n4. Invest increases in renewables\n5. Community oversight board\n\nMonopolies have a moral obligation to be fair.', targetCompany: 'Duke Energy', category: 'Energy', successCriteria: 'Duke Energy freezes rates for low-income customers.', creatorId: 'user_046', creatorName: 'Christopher Lee', status: 'active', coSignCount: 12345, tags: ['utility-rates', 'energy', 'seniors'], escalationStage: 'campaign' },
  { id: 'demand_013', title: 'Tesla: Standardize EV Charging and Open the Supercharger Network', description: 'Tesla\'s proprietary network fragments EV charging. Opening chargers to others is inconsistent and expensive.\n\nWe demand:\n1. Open 100% of Superchargers to all EVs at equal pricing\n2. Adopt unified NACS standards\n3. Equal speeds for all brands\n4. Publish real-time availability via open API\n5. Partner on open charging standard\n\nThe climate crisis is bigger than any company\'s market strategy.', targetCompany: 'Tesla', category: 'Energy', successCriteria: 'Tesla opens all Superchargers to all EVs at equal pricing.', creatorId: 'user_016', creatorName: 'Sofia Petrov', status: 'active', coSignCount: 19876, tags: ['ev-charging', 'electric-vehicles', 'climate'], escalationStage: 'campaign' },
  { id: 'demand_014', title: 'Walmart: End Poverty Wages and Provide Healthcare for All Workers', description: 'Walmart is the largest private employer with 2.1M workers, yet thousands rely on government assistance. Taxpayers subsidize Walmart\'s low wages by $6.2B/year. Average wage: $14.50/hr.\n\nWe demand:\n1. $20/hour minimum for all US employees\n2. Healthcare for 20+ hour workers\n3. Schedules 3 weeks in advance\n4. 30 hour minimum for those wanting full-time\n5. Stop union-busting\n\nA business that can\'t pay living wages socializes costs while privatizing profits.', targetCompany: 'Walmart', category: 'Retail', successCriteria: 'Walmart raises to $20/hr and provides healthcare.', creatorId: 'user_049', creatorName: 'Tamara Jones', status: 'active', coSignCount: 41234, tags: ['living-wage', 'healthcare', 'retail'], escalationStage: 'movement' },
  { id: 'demand_015', title: 'AT&T: End Data Caps and Hidden Fees on All Plans', description: 'AT&T "unlimited" plans aren\'t unlimited. Hidden fees add $15-20/month to advertised prices. FCC found costs average 31% higher than advertised.\n\nWe demand:\n1. Eliminate data caps on unlimited plans\n2. Include ALL fees in advertised prices\n3. Stop throttling without genuine congestion\n4. Honest speed tests\n5. Cancel without penalty when service doesn\'t match ads\n\nWhen you call something "unlimited," it should be unlimited.', targetCompany: 'AT&T', category: 'Telecom', successCriteria: 'AT&T eliminates data caps and includes all fees in advertised prices.', creatorId: 'user_013', creatorName: 'Nate Sullivan', status: 'active', coSignCount: 25678, tags: ['data-caps', 'hidden-fees', 'telecom'], escalationStage: 'campaign' },
  { id: 'demand_016', title: 'Comcast: Deliver the Broadband Speeds You Promise', description: 'Comcast delivers 40-60% of advertised speeds during peak hours despite receiving billions in subsidies.\n\nWe demand:\n1. Guarantee 90% of advertised speeds 95% of the time\n2. Automatic bill credits for failures\n3. End data caps\n4. 30% revenue to infrastructure\n5. Fulfill subsidy commitments\n6. Publish real-time performance data\n\nYou don\'t get to sell 500 Mbps and deliver 200.', targetCompany: 'Comcast', category: 'Telecom', successCriteria: 'Comcast guarantees 90% of advertised speeds and ends data caps.', creatorId: 'user_034', creatorName: 'Bethany Cruz', status: 'active', coSignCount: 19234, tags: ['broadband', 'internet-speed', 'telecom'], escalationStage: 'campaign' },
  { id: 'demand_017', title: 'Netflix: Stop the Price Hikes and Ad-Tier Degradation', description: 'Netflix raised prices 8 times in a decade. Ad-free plan now $23/month — double the original. Content libraries shrunk.\n\nWe demand:\n1. Freeze ad-free prices 24 months\n2. Guarantee no ads on ad-free plans\n3. Publish content add/remove metrics\n4. Allow permanent content downloads\n5. Restore family password sharing\n\nStreaming was supposed to replace cable, not become it.', targetCompany: 'Netflix', category: 'Entertainment', successCriteria: 'Netflix freezes prices 24 months and guarantees no ads on premium.', creatorId: 'user_021', creatorName: 'Will Hernandez', status: 'active', coSignCount: 35678, tags: ['streaming', 'price-hikes', 'entertainment'], escalationStage: 'movement' },
  { id: 'demand_018', title: 'Ticketmaster: End the Monopoly on Live Event Tickets', description: 'Ticketmaster\'s monopoly means fans pay 2-3x face value. Service fees exceed 30%. Dynamic pricing inflates costs. Bots dominate sales.\n\nWe demand:\n1. Cap fees at 10% of face value\n2. Eliminate dynamic pricing\n3. Effective anti-bot measures\n4. All fees visible upfront\n5. Transfers at face value only\n6. Support breaking up Live Nation/Ticketmaster\n\nLive events should be accessible to regular people.', targetCompany: 'Ticketmaster', category: 'Entertainment', successCriteria: 'Ticketmaster caps fees at 10% and eliminates dynamic pricing.', creatorId: 'user_042', creatorName: 'Malik Robinson', status: 'active', coSignCount: 58432, tags: ['ticketing', 'monopoly', 'live-events'], escalationStage: 'movement' },
  { id: 'demand_019', title: 'Navient: End Predatory Student Loan Servicing Practices', description: 'Navient steers borrowers into costly repayment plans and makes forgiveness applications difficult.\n\nWe demand:\n1. Proactively inform about cheapest options\n2. Process PSLF within 30 days\n3. Apply payments to highest interest first\n4. Accurate forgiveness info\n5. Compensate affected borrowers\n6. Answer calls within 5 minutes\n\n$1.7 trillion in student debt. Navient profits from confusion.', targetCompany: 'Navient', category: 'Finance', successCriteria: 'Navient proactively offers cheapest options and processes PSLF in 30 days.', creatorId: 'user_019', creatorName: 'Brandon Mitchell', status: 'active', coSignCount: 23456, tags: ['student-loans', 'predatory-lending', 'education'], escalationStage: 'campaign' },
  { id: 'demand_020', title: 'Bank of America: Stop Charging Late Fees on Credit Cards', description: 'BofA charges up to $41 per late payment, creating debt spirals for vulnerable customers.\n\nWe demand:\n1. Eliminate late fees\n2. 10-day grace period after due date\n3. Multiple payment reminders\n4. Auto minimum payment enrollment\n5. Stop raising rates for single late payments\n\nBofA made $30B profit. Late fees cause outsized harm for negligible revenue.', targetCompany: 'Bank of America', category: 'Finance', successCriteria: 'BofA eliminates late fees and implements grace period.', creatorId: 'user_029', creatorName: 'Ryan O\'Brien', status: 'active', coSignCount: 16789, tags: ['late-fees', 'credit-cards', 'banking'], escalationStage: 'campaign' },
  { id: 'demand_021', title: 'Shein: Disclose Your Full Supply Chain and Labor Practices', description: 'Shein workers work 18-hour days for 3 cents per garment. 6.3M tons CO2 annually. No supply chain transparency.\n\nWe demand:\n1. Publish all factory/supplier list\n2. Independent labor audits\n3. Minimum wage compliance\n4. Chemical disclosure and EU compliance\n5. Garment take-back program\n6. Environmental impact assessments\n\n$4 t-shirts have a real cost — paid by workers and communities, not consumers.', targetCompany: 'Shein', category: 'Retail', successCriteria: 'Shein publishes supply chain and submits to independent audits.', creatorId: 'user_036', creatorName: 'Ingrid Larsson', status: 'active', coSignCount: 29876, tags: ['fast-fashion', 'supply-chain', 'labor-rights'], escalationStage: 'campaign' },
  // VICTORIES
  { id: 'demand_022', title: 'Microsoft: Make Windows Updates Non-Disruptive', description: 'After 15,000+ co-signers demanded full control over update timing, Microsoft announced policy changes in January 2026 allowing users to defer all non-security updates indefinitely.', targetCompany: 'Microsoft', category: 'Technology', successCriteria: 'Users get full control over update timing.', creatorId: 'user_004', creatorName: 'David Park', status: 'met', coSignCount: 15234, tags: ['windows', 'updates', 'victory'], escalationStage: 'movement', resolvedAt: '2026-01-15', victoryStatement: 'Microsoft eliminated forced restarts for non-security updates.' },
  { id: 'demand_023', title: 'Spotify: Increase Artist Royalty Payments', description: 'After 20,000 co-signers, Spotify announced a 40% royalty increase for independent artists in December 2025.', targetCompany: 'Spotify', category: 'Entertainment', successCriteria: 'Spotify increases per-stream royalty by 30%+.', creatorId: 'user_042', creatorName: 'Malik Robinson', status: 'met', coSignCount: 21456, tags: ['music', 'artist-pay', 'victory'], escalationStage: 'campaign', resolvedAt: '2025-12-20', victoryStatement: 'Spotify increased independent artist royalties by 40%.' },
  { id: 'demand_024', title: 'Adobe: End Surprise Cancellation Fees on Creative Cloud', description: '30,000+ co-signers in two months. Adobe eliminated cancellation fees entirely in November 2025.', targetCompany: 'Adobe', category: 'Technology', successCriteria: 'Adobe eliminates early termination fees.', creatorId: 'user_023', creatorName: 'Alex Rivera', status: 'met', coSignCount: 32145, tags: ['subscription-traps', 'cancellation-fees', 'victory'], escalationStage: 'movement', resolvedAt: '2025-11-08', victoryStatement: 'Adobe eliminated all early termination fees. FTC cited consumer organizing.' },
  { id: 'demand_025', title: 'Uber: Provide Transparent Fare Breakdowns to Riders', description: '18,000 co-signers. Uber now shows complete fare breakdowns including driver earnings on every ride since October 2025.', targetCompany: 'Uber', category: 'Technology', successCriteria: 'Uber shows complete fare breakdown on every ride.', creatorId: 'user_033', creatorName: 'Rashid Hassan', status: 'met', coSignCount: 18234, tags: ['ride-sharing', 'transparency', 'victory'], escalationStage: 'campaign', resolvedAt: '2025-10-15', victoryStatement: 'Uber now shows complete fare breakdowns on every ride.' },
  // More active demands
  { id: 'demand_026', title: 'Amazon: End Subscription Traps — Make Cancellation Easy', description: 'Prime cancellation requires 6+ screens with dark patterns. FTC filed suit. 14% of users fail to cancel even when they want to.\n\nWe demand one-click cancellation, no dark patterns, renewal reminders, and partial refunds.', targetCompany: 'Amazon', category: 'Retail', successCriteria: 'Amazon implements one-click cancellation.', creatorId: 'user_006', creatorName: 'Aisha Okonkwo', status: 'active', coSignCount: 27654, tags: ['subscription-traps', 'dark-patterns', 'consumer-rights'], escalationStage: 'campaign' },
  { id: 'demand_027', title: 'All Hospitals: Publish Real Prices Before Treatment', description: 'Only 36% of hospitals comply with federal price transparency rules. Medical debt is the leading cause of bankruptcy.\n\nWe demand complete price lists, binding estimates, honored prices regardless of insurance, financial counseling, and no surprise billing.', targetCompany: 'UnitedHealth Group', category: 'Healthcare', successCriteria: 'Major hospitals achieve 100% price transparency.', creatorId: 'user_018', creatorName: 'Olivia Chang', status: 'active', coSignCount: 38765, tags: ['hospital-pricing', 'transparency', 'medical-debt'], escalationStage: 'movement' },
  { id: 'demand_028', title: 'Meta: Protect Children from Algorithm-Driven Content Addiction', description: '32% of teen girls say Instagram worsens body image. Age verification is trivially bypassable.\n\nWe demand robust age verification, no algorithmic feeds for under 16, time limits for minors, no youth-targeted ads, independent research funding, and annual child safety audits.', targetCompany: 'Meta', category: 'Technology', successCriteria: 'Meta implements real age verification and disables algorithmic feeds for minors.', creatorId: 'user_038', creatorName: 'Michelle Patel', status: 'active', coSignCount: 54321, tags: ['child-safety', 'social-media', 'mental-health'], escalationStage: 'movement' },
  { id: 'demand_029', title: 'Comcast: End Contract Lock-Ins and Equipment Rental Fees', description: 'Comcast charges $14/month for modems worth $80. Contracts have steep termination fees. Post-promo prices double.\n\nWe demand month-to-month only, customer equipment support, capped rental fees, full price disclosure, and 30-day notice for increases.', targetCompany: 'Comcast', category: 'Telecom', successCriteria: 'Comcast ends contracts and allows customer equipment.', creatorId: 'user_013', creatorName: 'Nate Sullivan', status: 'active', coSignCount: 14567, tags: ['contracts', 'equipment-fees', 'telecom'], escalationStage: 'campaign' },
  { id: 'demand_030', title: 'Google: Stop Burying Organic Search Results Under Ads', description: 'Users scroll past 4-5 ads before organic results. Mobile ads fill entire first screen. Search ad revenue: $192B.\n\nWe demand max 2 ads per page, clear ad labeling, max 20% screen for ads, quality metrics, and ad-free search option.', targetCompany: 'Google', category: 'Technology', successCriteria: 'Google limits search ads to 2 per page.', creatorId: 'user_008', creatorName: 'Priya Sharma', status: 'active', coSignCount: 22345, tags: ['search', 'ads', 'internet'], escalationStage: 'campaign' },
  { id: 'demand_031', title: 'Pesticide Transparency: Require Full Disclosure on All Produce', description: '70% of conventional produce has pesticide residues. Many chemicals banned in the EU are used in the US.\n\nWe demand pesticide disclosure on all produce, QR codes with info, prioritize low-pesticide suppliers, phase out neonicotinoids, and independent testing.', targetCompany: 'Kroger', category: 'Food', successCriteria: 'Major grocers implement pesticide disclosure.', creatorId: 'user_050', creatorName: 'Luis Gutierrez', status: 'active', coSignCount: 11234, tags: ['pesticides', 'food-safety', 'produce'], escalationStage: 'petition' },
  { id: 'demand_032', title: 'Apple: End Planned Obsolescence in iPhones', description: 'Apple slows older iPhones via updates and makes batteries non-replaceable. Paid $500M settlement but continues.\n\nWe demand 7-year software support, $29 battery replacement forever, no performance throttling, benchmarks showing update impact, and stability mode option.', targetCompany: 'Apple', category: 'Technology', successCriteria: 'Apple commits to 7-year support and affordable battery replacement.', creatorId: 'user_027', creatorName: 'Omar Farouk', status: 'active', coSignCount: 28765, tags: ['planned-obsolescence', 'e-waste', 'sustainability'], escalationStage: 'campaign' },
  { id: 'demand_033', title: 'AI Companies: Mandatory Transparency in AI Training Data', description: 'AI companies train on internet data without consent. Artists and creators get no compensation. No transparency about biases or copyrighted material.\n\nWe demand training data documentation, opt-out mechanisms, creator compensation, independent audits, and AI content labeling.', targetCompany: 'Google', category: 'Technology', successCriteria: 'AI companies publish training data documentation and compensate creators.', creatorId: 'user_052', creatorName: 'Kwame Asante', status: 'active', coSignCount: 33456, tags: ['AI', 'training-data', 'transparency'], escalationStage: 'campaign' },
];

// Comments generator
const COMMENT_TEMPLATES = [
  { userId: 'user_001', name: 'Sarah Chen', texts: ['This is exactly the organized pressure we need.', 'Great progress on co-signers! Keep pushing.'] },
  { userId: 'user_002', name: 'Marcus Johnson', texts: ['Signed and shared with my entire network.', 'Has anyone reached out to media about this?'] },
  { userId: 'user_003', name: 'Emma Rodriguez', texts: ['I see the impact of this every day at work.', 'The success criteria here are really clear.'] },
  { userId: 'user_006', name: 'Aisha Okonkwo', texts: ['From a legal perspective, this demand is solid.', 'We should organize a social media push this weekend.'] },
  { userId: 'user_008', name: 'Priya Sharma', texts: ['The data backs this up completely.', 'If we hit 50k, the media attention alone would be worth it.'] },
  { userId: 'user_010', name: 'Rachel Kim', texts: ['As a parent, this hits close to home.', 'Bringing this up at our next PTA meeting.'] },
  { userId: 'user_012', name: 'Fatima Al-Rashid', texts: ['The financial impact on regular people is staggering.', 'Has anyone calculated total consumer savings?'] },
  { userId: 'user_024', name: 'Hannah Goldstein', texts: ['Legally sound with clear, achievable criteria.', 'I can help draft talking points for media.'] },
  { userId: 'user_029', name: 'Ryan O\'Brien', texts: ['I used to work in this industry. Everything here is accurate.', 'The company knows this is the right thing to do.'] },
  { userId: 'user_042', name: 'Malik Robinson', texts: ['Just shared with my followers. Let\'s make this viral.', 'The power of collective action is real!'] },
  { userId: 'user_045', name: 'Zara Ahmed', texts: ['Working on an article about this demand.', 'The momentum here is incredible.'] },
  { userId: 'user_052', name: 'Kwame Asante', texts: ['Textbook case of market failure. Collective action is the answer.', 'My students are studying this platform.'] },
  { userId: 'user_016', name: 'Sofia Petrov', texts: ['The environmental angle here is huge.', 'Corporations won\'t change unless we make them.'] },
  { userId: 'user_007', name: 'James Whitfield', texts: ['Been waiting for something like this. Count me in.', 'Shared with my community group — all signing.'] },
];

const CORPORATE_RESPONSES = [
  { demandId: 'demand_001', companyName: 'Apple', responderTitle: 'VP of Environmental, Policy and Social Initiatives', message: 'Apple is committed to providing the best service experience. We\'ve expanded our Self Service Repair program and are working with authorized providers.', acceptCount: 234, rejectCount: 4521, insufficientCount: 8934 },
  { demandId: 'demand_002', companyName: 'Google', responderTitle: 'Director of Privacy Engineering', message: 'Privacy is core to everything we do at Google. Our Privacy Checkup tool allows users to review settings in minutes.', acceptCount: 156, rejectCount: 6789, insufficientCount: 12345 },
  { demandId: 'demand_006', companyName: 'Eli Lilly', responderTitle: 'Chief Patient Officer', message: 'Eli Lilly has taken significant steps including our Insulin Value Program capping costs at $35 for commercially insured patients. We recognize more needs to be done.', acceptCount: 3456, rejectCount: 8765, insufficientCount: 15678 },
  { demandId: 'demand_003', companyName: 'Amazon', responderTitle: 'VP of Workplace Health & Safety', message: 'We\'ve invested over $15 billion in safety measures since 2019. Our injury rates have improved 28% over three years.', acceptCount: 567, rejectCount: 9876, insufficientCount: 14567 },
  { demandId: 'demand_005', companyName: 'JPMorgan Chase', responderTitle: 'Head of Consumer Banking', message: 'Chase has eliminated fees on transactions under $5 and provides grace periods. We continue evaluating fee policies.', acceptCount: 890, rejectCount: 5678, insufficientCount: 9012 },
  { demandId: 'demand_008', companyName: 'McDonald\'s', responderTitle: 'Chief People Officer', message: 'We\'ve raised wages to average $15/hr at company-owned locations and offer tuition assistance.', acceptCount: 456, rejectCount: 7890, insufficientCount: 11234 },
  { demandId: 'demand_011', companyName: 'ExxonMobil', responderTitle: 'VP of Sustainability', message: 'We\'ve invested $17 billion in lower-emission technologies. We support the Paris Agreement goals.', acceptCount: 123, rejectCount: 12345, insufficientCount: 18765 },
  { demandId: 'demand_018', companyName: 'Ticketmaster', responderTitle: 'Head of Fan Experience', message: 'We understand frustrations. Dynamic pricing is set by artists, not Ticketmaster. We\'re improving anti-bot technology.', acceptCount: 89, rejectCount: 15678, insufficientCount: 20345 },
  { demandId: 'demand_014', companyName: 'Walmart', responderTitle: 'EVP of People', message: 'We\'ve invested $20B in associate wages. Average hourly wage is now $17.50 with benefits including education assistance.', acceptCount: 567, rejectCount: 8901, insufficientCount: 13456 },
  { demandId: 'demand_017', companyName: 'Netflix', responderTitle: 'VP of Product', message: 'We\'re focused on delivering the best entertainment. Our ad-supported plan offers an affordable option.', acceptCount: 234, rejectCount: 9012, insufficientCount: 12345 },
  { demandId: 'demand_015', companyName: 'AT&T', responderTitle: 'SVP of Consumer Services', message: 'We offer a range of plans. All fees are disclosed in our terms of service.', acceptCount: 178, rejectCount: 6543, insufficientCount: 10987 },
  { demandId: 'demand_007', companyName: 'UnitedHealth Group', responderTitle: 'Chief Medical Officer', message: 'Our clinical review processes involve qualified medical professionals and comply with regulations.', acceptCount: 145, rejectCount: 11234, insufficientCount: 16789 },
  { demandId: 'demand_004', companyName: 'Meta', responderTitle: 'VP of Integrity', message: 'We publish transparency reports and offer Feed controls. We\'re committed to giving people control.', acceptCount: 234, rejectCount: 8901, insufficientCount: 14567 },
  { demandId: 'demand_016', companyName: 'Comcast', responderTitle: 'SVP of Customer Experience', message: 'We\'re investing $20B in network infrastructure. Our xFi tools provide network performance visibility.', acceptCount: 156, rejectCount: 5678, insufficientCount: 9012 },
  { demandId: 'demand_021', companyName: 'Shein', responderTitle: 'Head of ESG', message: 'We take supply chain responsibility seriously. We conduct regular audits of tier-1 suppliers.', acceptCount: 67, rejectCount: 7890, insufficientCount: 12345 },
];

const COALITIONS = [
  { id: 'coalition_001', name: 'Tech Accountability Alliance', description: 'Uniting demands across Apple, Google, Meta, and Amazon for tech reform.', demandIds: ['demand_001', 'demand_002', 'demand_003', 'demand_004', 'demand_026', 'demand_028', 'demand_030', 'demand_032', 'demand_033'], targetCompanies: ['Apple', 'Google', 'Meta', 'Amazon'], creatorId: 'user_001', creatorName: 'Sarah Chen', totalCoSigners: 289432, pressureScore: 94, tags: ['technology', 'accountability'] },
  { id: 'coalition_002', name: 'Healthcare for All Coalition', description: 'Combining demands for insulin pricing, insurance reform, and hospital transparency.', demandIds: ['demand_006', 'demand_007', 'demand_027'], targetCompanies: ['Eli Lilly', 'UnitedHealth Group'], creatorId: 'user_003', creatorName: 'Emma Rodriguez', totalCoSigners: 149566, pressureScore: 91, tags: ['healthcare', 'insurance'] },
  { id: 'coalition_003', name: 'Fair Wages Movement', description: 'Workers deserve living wages and fair treatment across all industries.', demandIds: ['demand_008', 'demand_014', 'demand_003', 'demand_009'], targetCompanies: ['McDonald\'s', 'Walmart', 'Amazon', 'DoorDash'], creatorId: 'user_015', creatorName: 'Derek Foster', totalCoSigners: 143510, pressureScore: 87, tags: ['wages', 'labor'] },
  { id: 'coalition_004', name: 'Internet Freedom Alliance', description: 'Fighting data caps, hidden fees, and the digital divide.', demandIds: ['demand_015', 'demand_016', 'demand_029'], targetCompanies: ['AT&T', 'Comcast'], creatorId: 'user_013', creatorName: 'Nate Sullivan', totalCoSigners: 59479, pressureScore: 72, tags: ['internet', 'broadband'] },
  { id: 'coalition_005', name: 'Food Justice Network', description: 'From farm worker exposure to shrinkflation to delivery exploitation.', demandIds: ['demand_008', 'demand_009', 'demand_010', 'demand_031'], targetCompanies: ['McDonald\'s', 'DoorDash', 'Kroger'], creatorId: 'user_014', creatorName: 'Mei-Lin Wu', totalCoSigners: 83858, pressureScore: 68, tags: ['food', 'transparency'] },
  { id: 'coalition_006', name: 'Climate Corporate Accountability', description: 'Holding fossil fuel companies accountable for their climate commitments.', demandIds: ['demand_011', 'demand_013'], targetCompanies: ['ExxonMobil', 'Tesla'], creatorId: 'user_005', creatorName: 'Lisa Thompson', totalCoSigners: 65554, pressureScore: 79, tags: ['climate', 'energy'] },
];

const SPOKESPERSON_NOMINATIONS = [
  { demandId: 'demand_006', nomineeId: 'user_003', nomineeName: 'Emma Rodriguez', nominatedBy: 'user_001', approveVotes: 234, rejectVotes: 12, reason: 'Healthcare professional with direct insulin pricing experience' },
  { demandId: 'demand_001', nomineeId: 'user_004', nomineeName: 'David Park', nominatedBy: 'user_008', approveVotes: 189, rejectVotes: 8, reason: 'Right-to-repair advocate who created this demand' },
  { demandId: 'demand_002', nomineeId: 'user_025', nomineeName: 'Chris Nakamura', nominatedBy: 'user_004', approveVotes: 167, rejectVotes: 23, reason: 'Cybersecurity professional with deep tracking knowledge' },
  { demandId: 'demand_003', nomineeId: 'user_011', nomineeName: 'Tyler Brooks', nominatedBy: 'user_015', approveVotes: 312, rejectVotes: 15, reason: 'Current Amazon warehouse worker' },
  { demandId: 'demand_005', nomineeId: 'user_012', nomineeName: 'Fatima Al-Rashid', nominatedBy: 'user_029', approveVotes: 145, rejectVotes: 7, reason: 'Financial literacy educator' },
  { demandId: 'demand_011', nomineeId: 'user_005', nomineeName: 'Lisa Thompson', nominatedBy: 'user_032', approveVotes: 278, rejectVotes: 34, reason: 'Environmental journalist covering ExxonMobil' },
  { demandId: 'demand_018', nomineeId: 'user_042', nomineeName: 'Malik Robinson', nominatedBy: 'user_045', approveVotes: 456, rejectVotes: 21, reason: 'Artist with massive platform' },
  { demandId: 'demand_014', nomineeId: 'user_049', nomineeName: 'Tamara Jones', nominatedBy: 'user_015', approveVotes: 198, rejectVotes: 11, reason: 'Union representative' },
  { demandId: 'demand_007', nomineeId: 'user_022', nomineeName: 'Tanya Okafor', nominatedBy: 'user_003', approveVotes: 234, rejectVotes: 19, reason: 'Nurse seeing insurance denial impacts daily' },
  { demandId: 'demand_004', nomineeId: 'user_008', nomineeName: 'Priya Sharma', nominatedBy: 'user_025', approveVotes: 201, rejectVotes: 14, reason: 'Data scientist with algorithmic evidence' },
  { demandId: 'demand_028', nomineeId: 'user_038', nomineeName: 'Michelle Patel', nominatedBy: 'user_010', approveVotes: 345, rejectVotes: 8, reason: 'Pediatrician specializing in child mental health' },
  { demandId: 'demand_033', nomineeId: 'user_052', nomineeName: 'Kwame Asante', nominatedBy: 'user_008', approveVotes: 167, rejectVotes: 12, reason: 'AI governance researcher' },
];

// ============ MAIN SEED ============
async function seed() {
  console.log('🚀 Starting massive seed via REST API...\n');
  
  const token = await getAuthToken();
  console.log('🔑 Authenticated\n');

  // 1. Users
  console.log('👤 Seeding users...');
  for (const user of USERS) {
    await writeDoc(token, 'users', user.id, {
      uid: user.id,
      email: `${user.name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 12)}@demand.app`,
      displayName: user.name,
      bio: user.bio,
      reputation: user.reputation,
      badges: user.badges,
      activityLevel: user.activity,
      verifiedStatus: user.badges.includes('Verified') ? 'verified' : user.reputation > 1500 ? 'trusted' : 'unverified',
      createdAt: randomDate(6),
      photoURL: null,
      coSignedDemands: [],
      createdDemands: [],
    });
  }
  console.log(`  ✅ ${USERS.length} users`);

  // 2. Companies
  console.log('🏢 Seeding companies...');
  for (const company of COMPANIES) {
    await writeDoc(token, 'companies', company.name.toLowerCase().replace(/[^a-z0-9]/g, '-'), {
      name: company.name,
      description: company.description,
      industry: company.industry,
      revenue: company.revenue,
      employees: company.employees,
      pressureScore: company.pressureScore,
      activeDemands: [],
      responseRate: randomInt(10, 80),
      politicalDonations: [],
      controversies: [],
      createdAt: randomDate(6),
    });
  }
  console.log(`  ✅ ${COMPANIES.length} companies`);

  // 3. Demands
  console.log('📋 Seeding demands...');
  for (const demand of DEMANDS) {
    const coSignerIds = USERS.map(u => u.id).filter(id => id !== demand.creatorId).sort(() => Math.random() - 0.5).slice(0, Math.min(demand.coSignCount, 50));
    const createdAt = demand.resolvedAt ? new Date(new Date(demand.resolvedAt).getTime() - randomInt(60, 180) * 86400000) : randomDate(5);

    await writeDoc(token, 'demands', demand.id, {
      title: demand.title,
      description: demand.description,
      targetCompany: demand.targetCompany,
      category: demand.category || 'General',
      successCriteria: demand.successCriteria,
      creatorId: demand.creatorId,
      creatorName: demand.creatorName,
      status: demand.status,
      visibility: 'public',
      coSigners: coSignerIds,
      coSignCount: demand.coSignCount,
      tags: demand.tags,
      escalationStage: demand.escalationStage || 'petition',
      currentSpokespersonId: '',
      spokespersonVotes: [],
      spokespersonVotingOpen: false,
      activeNegotiations: [],
      createdAt: createdAt,
      updatedAt: new Date(),
      ...(demand.status === 'met' ? { resolvedAt: new Date(demand.resolvedAt), victoryStatement: demand.victoryStatement } : {}),
    });
  }
  console.log(`  ✅ ${DEMANDS.length} demands`);

  // 4. Comments
  console.log('💬 Seeding comments...');
  let totalComments = 0;
  for (const demand of DEMANDS) {
    const count = demand.coSignCount > 30000 ? randomInt(6, 12) : randomInt(2, 6);
    for (let i = 0; i < count; i++) {
      const t = randomItem(COMMENT_TEMPLATES);
      await addDoc(token, `demands/${demand.id}/messages`, {
        demandId: demand.id,
        userId: t.userId,
        userName: t.name,
        text: randomItem(t.texts),
        createdAt: randomDate(4),
        likes: randomInt(0, 45),
      });
      totalComments++;
    }
  }
  console.log(`  ✅ ${totalComments} comments`);

  // 5. Corporate Responses
  console.log('🏛️ Seeding corporate responses...');
  for (const r of CORPORATE_RESPONSES) {
    await addDoc(token, `demands/${r.demandId}/corporateResponses`, {
      companyName: r.companyName,
      responderId: `${r.companyName.toLowerCase().replace(/[^a-z]/g, '')}_pr`,
      responderTitle: r.responderTitle,
      message: r.message,
      acceptCount: r.acceptCount,
      rejectCount: r.rejectCount,
      insufficientCount: r.insufficientCount,
      ratings: [],
      createdAt: randomDate(3),
    });
  }
  console.log(`  ✅ ${CORPORATE_RESPONSES.length} responses`);

  // 6. Spokesperson Nominations
  console.log('🎤 Seeding nominations...');
  for (const n of SPOKESPERSON_NOMINATIONS) {
    await addDoc(token, `demands/${n.demandId}/spokespersonNominations`, {
      nomineeId: n.nomineeId,
      nomineeName: n.nomineeName,
      nominatedBy: n.nominatedBy,
      reason: n.reason,
      approveVotes: n.approveVotes,
      rejectVotes: n.rejectVotes,
      createdAt: randomDate(3),
    });
  }
  console.log(`  ✅ ${SPOKESPERSON_NOMINATIONS.length} nominations`);

  // 7. Coalitions
  console.log('🤝 Seeding coalitions...');
  for (const c of COALITIONS) {
    await writeDoc(token, 'coalitions', c.id, {
      ...c,
      createdAt: randomDate(4),
      updatedAt: new Date(),
    });
  }
  console.log(`  ✅ ${COALITIONS.length} coalitions`);

  // 8. Pressure Board
  console.log('📊 Seeding pressure board...');
  for (let i = 0; i < COMPANIES.length; i++) {
    const c = COMPANIES[i];
    await writeDoc(token, 'pressureBoard', c.name.toLowerCase().replace(/[^a-z0-9]/g, '-'), {
      companyName: c.name,
      pressureScore: c.pressureScore,
      activeDemands: randomInt(1, 5),
      totalCoSigners: randomInt(10000, 80000),
      velocity: randomInt(-5, 15),
      rank: i + 1,
      change: randomItem(['up', 'down', 'same']),
      updatedAt: new Date(),
    });
  }
  console.log(`  ✅ ${COMPANIES.length} pressure entries`);

  // 9. Weekly Digests
  console.log('📰 Seeding weekly digests...');
  for (let i = 0; i < 8; i++) {
    const weekStart = new Date(Date.now() - (i + 1) * 604800000);
    const weekEnd = new Date(weekStart.getTime() + 604800000);
    await addDoc(token, 'weeklyDigests', {
      weekStart, weekEnd,
      newDemands: randomInt(2, 8),
      totalCoSigners: randomInt(5000, 25000),
      topDemands: DEMANDS.slice(0, 5).map(d => ({ id: d.id, title: d.title, coSignCount: d.coSignCount })),
      corporateResponses: randomInt(1, 5),
      victories: i < 2 ? randomInt(0, 1) : 0,
      trendingCompanies: ['Apple', 'Google', 'Eli Lilly'].slice(0, randomInt(1, 3)),
      createdAt: weekEnd,
    });
  }
  console.log('  ✅ 8 digests');

  console.log('\n🎉 MASSIVE SEED COMPLETE!');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
