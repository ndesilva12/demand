/**
 * MASSIVE SEED SCRIPT - Production-quality mock data
 * Populates Firebase with 50+ users, 30+ demands, 500+ co-signatures,
 * 100+ comments, 20+ corporate responses, companies, coalitions, victories
 */

import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

// Use GOOGLE_APPLICATION_CREDENTIALS env or application default
// For local dev without service account, set FIRESTORE_EMULATOR_HOST or use gcloud auth
initializeApp({ projectId: 'demand-c5b0d' });
const db = getFirestore();

// Helper: random date in past N months
function randomDate(monthsBack: number): Date {
  const now = Date.now();
  const past = now - monthsBack * 30 * 24 * 60 * 60 * 1000;
  return new Date(past + Math.random() * (now - past));
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ============ USERS ============
const USERS = [
  { id: 'user_001', name: 'Sarah Chen', bio: 'Consumer rights advocate. Former FTC policy analyst. Fighting for transparency in tech.', reputation: 4850, badges: ['Pioneer', 'Verified', 'Top Contributor'], activity: 'power' },
  { id: 'user_002', name: 'Marcus Johnson', bio: 'Community organizer from Atlanta. Believe in collective action to hold corporations accountable.', reputation: 3720, badges: ['Verified', 'Coalition Builder'], activity: 'power' },
  { id: 'user_003', name: 'Emma Rodriguez', bio: 'Healthcare worker tired of watching patients struggle with medical bills. Time for change.', reputation: 2890, badges: ['Healthcare Champion', 'Verified'], activity: 'power' },
  { id: 'user_004', name: 'David Park', bio: 'Software engineer who cares about digital rights and privacy. Right to repair advocate.', reputation: 3150, badges: ['Tech Advocate', 'Pioneer'], activity: 'power' },
  { id: 'user_005', name: 'Lisa Thompson', bio: 'Environmental journalist covering corporate sustainability claims. Calling out greenwashing.', reputation: 2650, badges: ['Verified', 'Investigator'], activity: 'power' },
  { id: 'user_006', name: 'Aisha Okonkwo', bio: 'Law student focused on consumer protection. Every voice counts.', reputation: 1920, badges: ['Rising Star'], activity: 'active' },
  { id: 'user_007', name: 'James Whitfield', bio: 'Retired teacher. Spending my time making sure corporations treat people fairly.', reputation: 2100, badges: ['Veteran Advocate'], activity: 'active' },
  { id: 'user_008', name: 'Priya Sharma', bio: 'Data scientist using numbers to expose corporate malpractice. The data doesn\'t lie.', reputation: 2450, badges: ['Data Driven', 'Verified'], activity: 'power' },
  { id: 'user_009', name: 'Carlos Mendez', bio: 'Small business owner. Fighting against monopolistic practices that crush local businesses.', reputation: 1680, badges: ['Small Biz Champion'], activity: 'active' },
  { id: 'user_010', name: 'Rachel Kim', bio: 'Parent and PTA president. Advocating for safer products and honest marketing.', reputation: 1540, badges: ['Family First'], activity: 'active' },
  { id: 'user_011', name: 'Tyler Brooks', bio: 'Gig economy worker demanding fair treatment from platform companies.', reputation: 980, badges: ['Worker Voice'], activity: 'active' },
  { id: 'user_012', name: 'Fatima Al-Rashid', bio: 'Financial literacy educator. Banks shouldn\'t profit from people\'s confusion.', reputation: 2280, badges: ['Finance Expert', 'Verified'], activity: 'active' },
  { id: 'user_013', name: 'Nate Sullivan', bio: 'Rural broadband activist. Everyone deserves internet access in 2026.', reputation: 1350, badges: ['Digital Divide Fighter'], activity: 'active' },
  { id: 'user_014', name: 'Mei-Lin Wu', bio: 'Food safety researcher. What goes into our food matters.', reputation: 1870, badges: ['Food Safety'], activity: 'active' },
  { id: 'user_015', name: 'Derek Foster', bio: 'Union electrician. Supporting working people against corporate greed.', reputation: 1120, badges: ['Labor Ally'], activity: 'active' },
  { id: 'user_016', name: 'Sofia Petrov', bio: 'Climate activist and renewable energy consultant. Hold polluters accountable.', reputation: 2050, badges: ['Climate Champion'], activity: 'active' },
  { id: 'user_017', name: 'Jordan Hayes', bio: 'Disability rights advocate. Accessibility isn\'t optional.', reputation: 1430, badges: ['Accessibility Advocate'], activity: 'active' },
  { id: 'user_018', name: 'Olivia Chang', bio: 'Pharmacist who sees the impact of drug pricing every day. Enough is enough.', reputation: 1760, badges: ['Healthcare Voice'], activity: 'active' },
  { id: 'user_019', name: 'Brandon Mitchell', bio: 'College student drowning in loan debt. Fighting predatory lending.', reputation: 890, badges: ['Student Voice'], activity: 'casual' },
  { id: 'user_020', name: 'Nina Kovalenko', bio: 'Immigrant small business owner. Fair treatment for all.', reputation: 720, badges: [], activity: 'casual' },
  { id: 'user_021', name: 'Will Hernandez', bio: 'Stay-at-home dad. Subscription traps are eating our family budget.', reputation: 650, badges: [], activity: 'casual' },
  { id: 'user_022', name: 'Tanya Okafor', bio: 'Nurse practitioner in Chicago. Healthcare should be a right.', reputation: 1100, badges: ['Healthcare Voice'], activity: 'casual' },
  { id: 'user_023', name: 'Alex Rivera', bio: 'Freelance designer. Fighting for fair platform fees and transparent pricing.', reputation: 540, badges: [], activity: 'casual' },
  { id: 'user_024', name: 'Hannah Goldstein', bio: 'Public interest attorney. Pro bono consumer advocacy.', reputation: 2340, badges: ['Legal Eagle', 'Verified'], activity: 'active' },
  { id: 'user_025', name: 'Chris Nakamura', bio: 'Cybersecurity professional. Your data privacy matters.', reputation: 1560, badges: ['Privacy Guard'], activity: 'active' },
  { id: 'user_026', name: 'Destiny Williams', bio: 'Proud mom of 3. Done with shrinkflation and hidden fees.', reputation: 430, badges: [], activity: 'casual' },
  { id: 'user_027', name: 'Omar Farouk', bio: 'Mechanical engineer. Planned obsolescence is unacceptable.', reputation: 780, badges: ['Repair Advocate'], activity: 'casual' },
  { id: 'user_028', name: 'Jade Morales', bio: 'Social worker advocating for vulnerable communities.', reputation: 960, badges: ['Community Voice'], activity: 'casual' },
  { id: 'user_029', name: 'Ryan O\'Brien', bio: 'Former bank employee turned whistleblower. I know how they operate.', reputation: 1890, badges: ['Insider', 'Verified'], activity: 'active' },
  { id: 'user_030', name: 'Amara Diallo', bio: 'International student studying public policy. Global perspective on corporate accountability.', reputation: 340, badges: [], activity: 'new' },
  { id: 'user_031', name: 'Kevin Tran', bio: 'Restaurant owner. Food delivery platforms are killing small restaurants.', reputation: 1240, badges: ['Small Biz Champion'], activity: 'active' },
  { id: 'user_032', name: 'Lauren McCarthy', bio: 'Environmental scientist. The data on corporate pollution is damning.', reputation: 1670, badges: ['Science Based'], activity: 'active' },
  { id: 'user_033', name: 'Rashid Hassan', bio: 'Taxi driver for 20 years. Rideshare companies destroyed our livelihoods.', reputation: 580, badges: ['Worker Voice'], activity: 'casual' },
  { id: 'user_034', name: 'Bethany Cruz', bio: 'Teacher in rural Oklahoma. My students deserve the same internet as city kids.', reputation: 870, badges: [], activity: 'casual' },
  { id: 'user_035', name: 'Darnell Washington', bio: 'Personal trainer. Fitness industry needs transparency in supplement marketing.', reputation: 420, badges: [], activity: 'casual' },
  { id: 'user_036', name: 'Ingrid Larsson', bio: 'Sustainability consultant from Sweden, now in Portland. Corporate ESG claims need verification.', reputation: 1340, badges: ['Verified'], activity: 'active' },
  { id: 'user_037', name: 'Tony Rizzo', bio: 'Auto mechanic. Right to repair is my livelihood.', reputation: 910, badges: ['Repair Advocate'], activity: 'casual' },
  { id: 'user_038', name: 'Michelle Patel', bio: 'Pediatrician concerned about children\'s online safety.', reputation: 1560, badges: ['Child Safety'], activity: 'active' },
  { id: 'user_039', name: 'Greg Olsen', bio: 'Retired military. Corporations should serve the country that made them rich.', reputation: 680, badges: [], activity: 'casual' },
  { id: 'user_040', name: 'Yuki Tanaka', bio: 'Game developer. Against predatory microtransactions and loot boxes.', reputation: 1020, badges: ['Gamer Voice'], activity: 'active' },
  { id: 'user_041', name: 'Patricia Nguyen', bio: 'Accountant and tax preparer. Financial transparency advocate.', reputation: 760, badges: [], activity: 'casual' },
  { id: 'user_042', name: 'Malik Robinson', bio: 'Hip-hop artist using my platform to amplify consumer voices.', reputation: 2100, badges: ['Amplifier', 'Verified'], activity: 'active' },
  { id: 'user_043', name: 'Heather Stewart', bio: 'Registered dietitian. Food labeling needs to be honest.', reputation: 890, badges: ['Food Safety'], activity: 'casual' },
  { id: 'user_044', name: 'Ben Kowalski', bio: 'IT support technician. Tired of companies making products unrepairable.', reputation: 540, badges: [], activity: 'casual' },
  { id: 'user_045', name: 'Zara Ahmed', bio: 'Journalist covering corporate accountability. The pen is mightier.', reputation: 1980, badges: ['Media', 'Verified'], activity: 'active' },
  { id: 'user_046', name: 'Christopher Lee', bio: 'Senior citizen on fixed income. Utility rate hikes are crushing retirees.', reputation: 470, badges: [], activity: 'new' },
  { id: 'user_047', name: 'Diana Flores', bio: 'Immigration attorney. Predatory financial services target immigrants.', reputation: 1230, badges: ['Community Voice'], activity: 'active' },
  { id: 'user_048', name: 'Sean Murphy', bio: 'Construction foreman. Worker safety isn\'t negotiable.', reputation: 620, badges: ['Worker Voice'], activity: 'casual' },
  { id: 'user_049', name: 'Tamara Jones', bio: 'School bus driver and union rep. Every worker deserves a fair deal.', reputation: 510, badges: [], activity: 'casual' },
  { id: 'user_050', name: 'Luis Gutierrez', bio: 'Farm worker advocate. Pesticide exposure is killing our communities.', reputation: 840, badges: ['Environmental Justice'], activity: 'casual' },
  { id: 'user_051', name: 'Rebecca Adler', bio: 'New here. Just joined because of the insulin pricing demand.', reputation: 120, badges: [], activity: 'new' },
  { id: 'user_052', name: 'Kwame Asante', bio: 'Political science professor. Studying the intersection of corporate power and democracy.', reputation: 1890, badges: ['Academic', 'Verified'], activity: 'active' },
  { id: 'user_053', name: 'Jenny Park', bio: 'Just signed up! Excited to join the movement.', reputation: 50, badges: [], activity: 'new' },
  { id: 'user_054', name: 'Douglas Wright', bio: 'Checking this out after seeing it on social media.', reputation: 30, badges: [], activity: 'new' },
  { id: 'user_055', name: 'Maria Santos', bio: 'Single mom fighting for affordable childcare and fair wages.', reputation: 280, badges: [], activity: 'new' },
];

// ============ COMPANIES ============
const COMPANIES = [
  { name: 'Apple', industry: 'Technology', revenue: '$394B', employees: 164000, description: 'Consumer electronics and software giant known for iPhone, Mac, and services ecosystem.', pressureScore: 78 },
  { name: 'Google', industry: 'Technology', revenue: '$307B', employees: 182000, description: 'Search, advertising, and cloud computing giant. Parent company Alphabet.', pressureScore: 85 },
  { name: 'Amazon', industry: 'E-Commerce / Technology', revenue: '$575B', employees: 1540000, description: 'E-commerce and cloud computing behemoth with massive logistics and retail operations.', pressureScore: 92 },
  { name: 'Meta', industry: 'Technology / Social Media', revenue: '$135B', employees: 67000, description: 'Social media conglomerate operating Facebook, Instagram, WhatsApp, and Reality Labs.', pressureScore: 88 },
  { name: 'Microsoft', industry: 'Technology', revenue: '$245B', employees: 228000, description: 'Enterprise software, cloud computing, and AI powerhouse.', pressureScore: 45 },
  { name: 'JPMorgan Chase', industry: 'Financial Services', revenue: '$178B', employees: 309000, description: 'Largest bank in the US by assets. Consumer and investment banking.', pressureScore: 72 },
  { name: 'Bank of America', industry: 'Financial Services', revenue: '$99B', employees: 217000, description: 'Second-largest US bank with extensive consumer banking operations.', pressureScore: 68 },
  { name: 'Eli Lilly', industry: 'Pharmaceuticals', revenue: '$41B', employees: 43000, description: 'Major pharmaceutical company and leading insulin manufacturer.', pressureScore: 95 },
  { name: 'UnitedHealth Group', industry: 'Healthcare / Insurance', revenue: '$372B', employees: 400000, description: 'Largest US health insurer and healthcare services company.', pressureScore: 90 },
  { name: 'McDonald\'s', industry: 'Food / Restaurant', revenue: '$25B', employees: 150000, description: 'World\'s largest fast food chain by revenue with 40,000+ locations.', pressureScore: 65 },
  { name: 'DoorDash', industry: 'Technology / Food Delivery', revenue: '$8.6B', employees: 19000, description: 'Leading food delivery platform connecting restaurants with customers.', pressureScore: 58 },
  { name: 'Kroger', industry: 'Retail / Grocery', revenue: '$150B', employees: 430000, description: 'Largest supermarket chain in the US by revenue.', pressureScore: 42 },
  { name: 'ExxonMobil', industry: 'Energy / Oil & Gas', revenue: '$344B', employees: 62000, description: 'Largest publicly traded oil and gas company. Major contributor to greenhouse emissions.', pressureScore: 88 },
  { name: 'Duke Energy', industry: 'Energy / Utilities', revenue: '$29B', employees: 27600, description: 'One of the largest electric power holding companies in the US.', pressureScore: 55 },
  { name: 'Tesla', industry: 'Automotive / Energy', revenue: '$97B', employees: 140000, description: 'Electric vehicle and clean energy company. Leader in EV market.', pressureScore: 52 },
  { name: 'Walmart', industry: 'Retail', revenue: '$648B', employees: 2100000, description: 'World\'s largest company by revenue. Retail giant with global operations.', pressureScore: 70 },
  { name: 'AT&T', industry: 'Telecommunications', revenue: '$122B', employees: 160000, description: 'Major US telecommunications company providing wireless, internet, and TV services.', pressureScore: 75 },
  { name: 'Comcast', industry: 'Telecommunications / Media', revenue: '$121B', employees: 186000, description: 'Largest US cable company and internet service provider. Parent of NBCUniversal.', pressureScore: 80 },
  { name: 'Netflix', industry: 'Entertainment / Streaming', revenue: '$39B', employees: 13000, description: 'Leading streaming entertainment service with 260M+ subscribers worldwide.', pressureScore: 48 },
  { name: 'Ticketmaster', industry: 'Entertainment / Events', revenue: '$23B', employees: 44000, description: 'Dominant ticket sales and distribution company. Subsidiary of Live Nation.', pressureScore: 93 },
  { name: 'Navient', industry: 'Financial Services / Education', revenue: '$3.2B', employees: 5400, description: 'Major student loan servicer managing billions in federal and private student loans.', pressureScore: 82 },
  { name: 'Shein', industry: 'Retail / Fashion', revenue: '$45B', employees: 16000, description: 'Fast fashion e-commerce giant known for ultra-low prices and rapid production cycles.', pressureScore: 76 },
];

// ============ DEMANDS ============
const DEMANDS = [
  {
    id: 'demand_001',
    title: 'Apple Must Support Right-to-Repair for All Devices',
    description: `Apple has systematically made it harder for consumers and independent repair shops to fix their own devices. From proprietary screws to parts pairing that disables functionality, Apple's repair restrictions cost consumers billions annually and create massive e-waste.\n\nWe demand that Apple:\n1. End all parts pairing restrictions that prevent third-party repairs\n2. Make genuine replacement parts available at fair prices to all repair shops\n3. Publish complete repair manuals for all current and future products\n4. Remove software locks that disable functionality when non-Apple parts are used\n5. Support federal right-to-repair legislation instead of lobbying against it\n\nThe average iPhone repair at an Apple Store costs 2-3x what an independent shop would charge if they had access to parts and documentation. This artificial monopoly on repairs hurts consumers, destroys small businesses, and contributes to 50 million tons of e-waste annually.\n\nApple generated $394 billion in revenue last year. They can afford to let people fix their own devices. The right to repair what you own shouldn't be controversial — it should be the law.`,
    targetCompany: 'Apple',
    category: 'Technology',
    successCriteria: 'Apple publicly commits to ending parts pairing, publishes repair manuals, and makes parts available to independent shops within 12 months.',
    creatorId: 'user_004',
    creatorName: 'David Park',
    status: 'active',
    coSignCount: 34521,
    tags: ['right-to-repair', 'e-waste', 'consumer-rights', 'technology'],
    escalationStage: 'movement',
  },
  {
    id: 'demand_002',
    title: 'Google: Stop Tracking Users Without Meaningful Consent',
    description: `Google's data collection practices have gone far beyond what any reasonable person would consider acceptable. Despite promises of transparency, Google continues to track user location, browsing habits, and personal information through dozens of hidden settings and dark patterns designed to keep tracking enabled.\n\nA 2025 study found that the average Google user would need to navigate through 17 different settings pages to fully opt out of tracking — and even then, some tracking continues. Google's "privacy dashboard" is designed to appear comprehensive while leaving the most invasive tracking enabled by default.\n\nWe demand that Google:\n1. Implement a single, prominent "Stop All Tracking" toggle accessible from any Google product\n2. Make tracking opt-IN rather than opt-OUT by default\n3. Stop using dark patterns to discourage users from disabling tracking\n4. Provide clear, plain-language explanations of exactly what data is collected\n5. Allow users to permanently delete all collected data with one click\n6. Stop tracking users across non-Google websites and apps\n\nPrivacy isn't a luxury feature — it's a fundamental right. Google made $307 billion last year, largely by monetizing our personal data. It's time they earned that revenue ethically.`,
    targetCompany: 'Google',
    category: 'Technology',
    successCriteria: 'Google implements single-click tracking opt-out, makes tracking opt-in by default for new accounts, and submits to independent privacy audit.',
    creatorId: 'user_025',
    creatorName: 'Chris Nakamura',
    status: 'active',
    coSignCount: 47832,
    tags: ['privacy', 'data-rights', 'tracking', 'consent'],
    escalationStage: 'movement',
  },
  {
    id: 'demand_003',
    title: 'Amazon: Guarantee Safe Working Conditions in All Warehouses',
    description: `Amazon warehouse workers face some of the most dangerous working conditions in the logistics industry. Injury rates at Amazon facilities are nearly double the industry average, with workers reporting being forced to skip bathroom breaks, work through injuries, and meet impossible quotas that prioritize speed over safety.\n\nInternal documents leaked in 2025 showed that Amazon executives were aware of injury rates 80% higher than competitors but chose to maintain productivity targets rather than improve conditions. Workers at multiple facilities have reported temperatures exceeding 100°F during summer months with inadequate cooling.\n\nWe demand that Amazon:\n1. Reduce injury rates to at or below industry average within 18 months\n2. Install adequate climate control in ALL warehouse facilities\n3. Eliminate productivity quotas that have been linked to increased injuries\n4. Allow workers unrestricted bathroom breaks without productivity penalties\n5. Submit to independent quarterly safety audits with publicly published results\n6. Provide full healthcare coverage for all injuries sustained on the job, including long-term conditions\n7. End retaliation against workers who report safety concerns\n\nAmazon is worth $2 trillion and Jeff Bezos is the second-richest person on Earth. There is absolutely no excuse for workers to be getting injured at these rates. Human beings are not robots, and they shouldn't be treated like disposable parts in a machine.`,
    targetCompany: 'Amazon',
    category: 'Technology',
    successCriteria: 'Amazon reduces warehouse injury rates to industry average, installs climate control in all facilities, and submits to independent safety audits.',
    creatorId: 'user_011',
    creatorName: 'Tyler Brooks',
    status: 'active',
    coSignCount: 52108,
    tags: ['worker-safety', 'labor-rights', 'warehouses', 'workplace-conditions'],
    escalationStage: 'movement',
  },
  {
    id: 'demand_004',
    title: 'Meta Must Make Algorithm Transparency a Default',
    description: `Meta's algorithms on Facebook and Instagram are designed to maximize engagement, often at the expense of users' mental health and the quality of public discourse. Internal research leaked by whistleblowers has repeatedly shown that Meta knows its algorithms amplify harmful content, spread misinformation, and contribute to teen mental health crises.\n\nDespite years of promises, Meta has refused to give users meaningful control over what they see. The algorithmic feed remains a black box that prioritizes outrage and addiction over informed, healthy content consumption.\n\nWe demand that Meta:\n1. Publish the complete ranking signals used by Facebook and Instagram algorithms\n2. Give every user a simple toggle to switch to a chronological, non-algorithmic feed\n3. Allow users to see WHY any piece of content was shown to them\n4. Stop amplifying content that internal research has flagged as harmful\n5. Submit to independent algorithmic audits by academic researchers\n6. Implement meaningful age verification and algorithm restrictions for users under 18\n\nMeta made $135 billion last year by keeping us scrolling. We deserve to know how they're manipulating our attention and the right to opt out of algorithmic curation entirely. Transparency isn't a feature request — it's a basic accountability standard.`,
    targetCompany: 'Meta',
    category: 'Technology',
    successCriteria: 'Meta publishes algorithm ranking signals, offers chronological feed option, and allows independent algorithmic audits.',
    creatorId: 'user_008',
    creatorName: 'Priya Sharma',
    status: 'active',
    coSignCount: 38945,
    tags: ['algorithm-transparency', 'mental-health', 'social-media', 'teen-safety'],
    escalationStage: 'movement',
  },
  {
    id: 'demand_005',
    title: 'End Overdraft Fees: Banks Must Stop Profiting from Poverty',
    description: `Major US banks collectively charge over $30 billion in overdraft fees annually, disproportionately impacting low-income Americans who can least afford them. A single overdraft can trigger a cascade of fees that turns a $5 shortfall into $200+ in charges.\n\nJPMorgan Chase alone collected $1.9 billion in overdraft fees last year. These fees aren't a service — they're a poverty tax. Research shows that 80% of overdraft fees are paid by just 9% of account holders, typically those living paycheck to paycheck.\n\nWe demand that JPMorgan Chase:\n1. Eliminate all overdraft fees entirely, following the lead of banks like Capital One\n2. Implement real-time balance notifications before transactions that would overdraw\n3. Offer free short-term credit lines (24-48 hours) for small overdrafts under $100\n4. Stop reordering transactions from largest to smallest to maximize overdraft fees\n5. Refund overdraft fees charged in the past 12 months to affected customers\n\nChase reported $50 billion in profit last year. They don't need overdraft fees. They choose to charge them because vulnerable customers have no bargaining power. That changes now.`,
    targetCompany: 'JPMorgan Chase',
    category: 'Finance',
    successCriteria: 'JPMorgan Chase eliminates overdraft fees and implements real-time balance alerts for all consumer accounts.',
    creatorId: 'user_012',
    creatorName: 'Fatima Al-Rashid',
    status: 'active',
    coSignCount: 28734,
    tags: ['overdraft-fees', 'banking', 'poverty', 'financial-justice'],
    escalationStage: 'campaign',
  },
  {
    id: 'demand_006',
    title: 'Cap Insulin Prices at $35 for All Americans',
    description: `The price of insulin in the United States is a moral outrage. While the same vial of insulin costs $30 in Canada and $8 in Australia, Americans pay an average of $300+ per vial — and some formulations cost over $700. An estimated 1.3 million Americans ration their insulin due to cost, and hundreds die each year because they can't afford this 100-year-old medication.\n\nEli Lilly, one of the three companies controlling 90% of the global insulin market, has raised prices over 1,200% in the past two decades while the cost of production has actually decreased. Their CEO earned $26 million in compensation last year.\n\nWe demand that Eli Lilly:\n1. Cap the out-of-pocket cost of ALL insulin products at $35 per month for every American, regardless of insurance status\n2. Eliminate all patient assistance program barriers and bureaucratic hurdles\n3. Publish transparent manufacturing cost data for all insulin products\n4. Stop paying for lobbying against drug price regulation\n5. Establish a permanent hardship fund for uninsured diabetics\n\nInsulin was discovered in 1921 and its patent was sold for $1 because the inventors believed it should be accessible to everyone. Over a century later, people are dying because they can't afford it. This is not a market problem — this is a moral emergency.`,
    targetCompany: 'Eli Lilly',
    category: 'Healthcare',
    successCriteria: 'Eli Lilly caps all insulin products at $35/month for all Americans regardless of insurance, with no barriers to access.',
    creatorId: 'user_003',
    creatorName: 'Emma Rodriguez',
    status: 'active',
    coSignCount: 67234,
    tags: ['insulin', 'drug-pricing', 'healthcare', 'diabetes'],
    escalationStage: 'crisis',
  },
  {
    id: 'demand_007',
    title: 'UnitedHealth: Stop Denying Claims Using AI Algorithms',
    description: `UnitedHealth Group has been using an AI algorithm called nH Predict to automatically deny insurance claims, overriding doctor recommendations and leaving patients without coverage for necessary medical procedures. A 2025 investigation found the algorithm had a 90% error rate when decisions were appealed, meaning the vast majority of denials were medically unjustified.\n\nPatients have reported being denied coverage for chemotherapy, emergency surgeries, and physical therapy based on algorithmic decisions made without any human medical review. The algorithm saves UnitedHealth billions in claim payouts while patients suffer and sometimes die waiting for appeals.\n\nWe demand that UnitedHealth Group:\n1. Immediately cease using AI/algorithmic systems to deny medical claims\n2. Require board-certified physician review for ALL claim denials\n3. Process all appeals within 48 hours for urgent/emergency claims\n4. Publish denial rates, appeal rates, and overturn rates by procedure type\n5. Compensate patients who suffered harm due to algorithmic denials\n6. Submit to independent audit of all AI systems used in coverage decisions\n\nHealthcare decisions should be made by doctors, not algorithms optimized for profit. UnitedHealth made $372 billion in revenue last year. They can afford to actually review claims before denying them.`,
    targetCompany: 'UnitedHealth Group',
    category: 'Healthcare',
    successCriteria: 'UnitedHealth stops AI-based claim denials, requires physician review for all denials, and publishes denial/appeal data.',
    creatorId: 'user_022',
    creatorName: 'Tanya Okafor',
    status: 'active',
    coSignCount: 43567,
    tags: ['insurance-denials', 'AI', 'healthcare', 'patient-rights'],
    escalationStage: 'movement',
  },
  {
    id: 'demand_008',
    title: 'McDonald\'s: Pay All Workers a Living Wage of $20/hr',
    description: `McDonald's is the world's largest fast food employer, and millions of its workers earn poverty wages while the company generates $25 billion in annual revenue. Despite record profits, McDonald's has consistently fought against minimum wage increases and uses franchise structures to avoid responsibility for worker compensation.\n\nThe average McDonald's worker earns $11-13 per hour in most states — well below what's needed to afford basic necessities. Meanwhile, McDonald's CEO earned $18 million in 2025, and the company spent $6 billion on stock buybacks rather than investing in its workforce.\n\nWe demand that McDonald's:\n1. Establish a $20/hour minimum wage for ALL McDonald's employees, including franchise workers\n2. Provide healthcare benefits for all workers averaging 25+ hours per week\n3. Guarantee predictable scheduling with at least 2 weeks advance notice\n4. End the use of non-compete agreements for hourly workers\n5. Match 401(k) contributions for all eligible employees\n\nWhen workers can't afford to eat at the restaurant where they work, something is fundamentally broken. McDonald's can afford to pay living wages — they just choose not to.`,
    targetCompany: 'McDonald\'s',
    category: 'Food',
    successCriteria: 'McDonald\'s commits to $20/hr minimum for all workers including franchise employees and provides healthcare for 25+ hour workers.',
    creatorId: 'user_015',
    creatorName: 'Derek Foster',
    status: 'active',
    coSignCount: 31245,
    tags: ['living-wage', 'fast-food', 'worker-rights', 'minimum-wage'],
    escalationStage: 'campaign',
  },
  {
    id: 'demand_009',
    title: 'DoorDash: Transparent Pricing and Fair Driver Pay',
    description: `DoorDash charges restaurants commissions of 15-30% per order while simultaneously charging customers delivery fees, service fees, and inflated menu prices. Meanwhile, drivers often earn less than minimum wage after accounting for vehicle expenses, gas, and insurance.\n\nA recent analysis found that on a typical $30 order, DoorDash collects $13.50 in various fees while the driver receives just $4.50 before expenses. The company uses opaque pricing that makes it nearly impossible for consumers to understand how much of their money actually goes to the restaurant or driver.\n\nWe demand that DoorDash:\n1. Display a complete fee breakdown on every order showing exactly where each dollar goes\n2. Guarantee drivers a minimum of $15/hour after expenses for all active delivery time\n3. Cap restaurant commissions at 15% for all restaurants\n4. Show customers the actual restaurant menu price alongside the DoorDash price\n5. End the practice of using customer tips to subsidize base driver pay\n6. Provide accident insurance for all active drivers\n\nFood delivery platforms promised to help restaurants and provide flexible work. Instead, they're extracting value from every participant in the transaction except themselves.`,
    targetCompany: 'DoorDash',
    category: 'Food',
    successCriteria: 'DoorDash implements full fee transparency, guarantees $15/hr minimum for drivers after expenses, and caps restaurant commissions at 15%.',
    creatorId: 'user_031',
    creatorName: 'Kevin Tran',
    status: 'active',
    coSignCount: 18923,
    tags: ['gig-economy', 'food-delivery', 'transparency', 'worker-pay'],
    escalationStage: 'campaign',
  },
  {
    id: 'demand_010',
    title: 'Kroger: End Grocery Shrinkflation and Hidden Price Increases',
    description: `Kroger and other major grocery chains have embraced "shrinkflation" — reducing package sizes while maintaining or increasing prices. A bag of chips that was 16oz is now 12oz at the same price. Cereal boxes are thinner. Yogurt containers have shrunk. And unit prices are deliberately made hard to compare.\n\nThis isn't just inflation — it's deception. Kroger's own internal communications, revealed in their merger hearings, showed executives discussing strategies to increase prices beyond what inflation justified, knowing consumers wouldn't notice gradual package size reductions.\n\nWe demand that Kroger:\n1. Display prominent unit pricing (price per ounce/gram) on ALL shelf labels in font size equal to the total price\n2. Flag any product that has reduced in size within the past 12 months with a visible "Size Changed" label\n3. Commit to not raising private-label brand prices faster than verified supplier cost increases\n4. Publish a quarterly transparency report on pricing changes across product categories\n5. Create a consumer advisory board with veto power over pricing policies\n\nGroceries are a necessity, not a luxury. Consumers deserve to know exactly what they're paying for and how prices are changing. Transparency isn't unreasonable — it's the bare minimum.`,
    targetCompany: 'Kroger',
    category: 'Food',
    successCriteria: 'Kroger implements prominent unit pricing, shrinkflation labeling, and quarterly pricing transparency reports.',
    creatorId: 'user_014',
    creatorName: 'Mei-Lin Wu',
    status: 'active',
    coSignCount: 22456,
    tags: ['shrinkflation', 'grocery', 'pricing', 'transparency'],
    escalationStage: 'campaign',
  },
  {
    id: 'demand_011',
    title: 'ExxonMobil: Honor Your Climate Pledges or Face Accountability',
    description: `ExxonMobil has spent decades publicly pledging to reduce emissions while privately funding climate denial and lobbying against clean energy legislation. Internal documents show that Exxon's own scientists accurately predicted climate change impacts in the 1970s — and the company chose to suppress that research and spread doubt.\n\nIn 2025, ExxonMobil's actual emissions INCREASED by 3% despite their pledge to reach net-zero by 2050. Their "carbon capture" investments amount to less than 1% of their capital expenditure, while they continue to expand fossil fuel production.\n\nWe demand that ExxonMobil:\n1. Publish a binding, independently verified emissions reduction plan with annual targets\n2. Allocate at least 20% of capital expenditure to renewable energy and carbon capture by 2027\n3. Stop all funding of climate denial organizations and lobbying against clean energy\n4. Establish a $10 billion fund for communities most affected by climate change\n5. Tie executive compensation to emissions reduction targets\n6. Submit to annual independent environmental audits with publicly published results\n\nExxonMobil knew about climate change before most of the world did. They chose profits over the planet. It's time to hold them to their promises — or make new ones with teeth.`,
    targetCompany: 'ExxonMobil',
    category: 'Energy',
    successCriteria: 'ExxonMobil publishes binding reduction plan, allocates 20% capex to renewables, and stops funding climate denial.',
    creatorId: 'user_005',
    creatorName: 'Lisa Thompson',
    status: 'active',
    coSignCount: 45678,
    tags: ['climate', 'emissions', 'greenwashing', 'fossil-fuels'],
    escalationStage: 'movement',
  },
  {
    id: 'demand_012',
    title: 'Duke Energy: Stop Raising Utility Rates on Fixed-Income Seniors',
    description: `Duke Energy has raised residential electricity rates 47% over the past decade while reporting record profits. These rate hikes disproportionately impact seniors on fixed incomes, low-income families, and people in regions with no alternative utility provider.\n\nDuke Energy operates as a monopoly in most of its service areas. Customers literally cannot switch to a competitor. This captive market allows Duke to raise prices with minimal accountability while spending millions on executive compensation and shareholder dividends.\n\nWe demand that Duke Energy:\n1. Freeze residential rate increases for customers earning below 200% of the federal poverty level\n2. Implement a progressive rate structure that doesn't punish low-usage customers\n3. Cap executive compensation at 50x the median worker salary\n4. Invest rate increase revenue exclusively in grid modernization and renewable energy\n5. Establish a community oversight board for rate change proposals\n\nWhen you're the only option, you have a moral obligation to be fair. Duke Energy has failed that obligation.`,
    targetCompany: 'Duke Energy',
    category: 'Energy',
    successCriteria: 'Duke Energy freezes rates for low-income customers and implements progressive rate structure.',
    creatorId: 'user_046',
    creatorName: 'Christopher Lee',
    status: 'active',
    coSignCount: 12345,
    tags: ['utility-rates', 'energy', 'seniors', 'monopoly'],
    escalationStage: 'campaign',
  },
  {
    id: 'demand_013',
    title: 'Tesla: Standardize EV Charging and Open the Supercharger Network',
    description: `Tesla's proprietary Supercharger network has created a fragmented EV charging landscape that hurts all electric vehicle adoption. While Tesla has begun opening some chargers to other vehicles, the process is inconsistent, expensive, and deliberately inferior for non-Tesla EVs.\n\nA unified, open charging standard is essential for EV adoption to reach mass market. Tesla's strategy of using charging access as a competitive moat slows down the entire industry's transition away from fossil fuels.\n\nWe demand that Tesla:\n1. Open 100% of Supercharger locations to all EV brands at equal pricing by end of 2026\n2. Adopt CCS/NACS standards uniformly without adapter requirements\n3. Provide equal charging speeds and reliability for all vehicle brands\n4. Publish real-time availability data through an open API\n5. Partner with other automakers on a truly open charging standard\n\nThe climate crisis is bigger than any company's market strategy. Open charging infrastructure benefits everyone — including Tesla owners who will gain access to more third-party chargers.`,
    targetCompany: 'Tesla',
    category: 'Energy',
    successCriteria: 'Tesla opens all Superchargers to all EVs at equal pricing and adopts unified charging standards.',
    creatorId: 'user_016',
    creatorName: 'Sofia Petrov',
    status: 'active',
    coSignCount: 19876,
    tags: ['ev-charging', 'electric-vehicles', 'standards', 'climate'],
    escalationStage: 'campaign',
  },
  {
    id: 'demand_014',
    title: 'Walmart: End Poverty Wages and Provide Healthcare for All Workers',
    description: `Walmart is the largest private employer in the world with 2.1 million workers, yet thousands of its employees rely on food stamps, Medicaid, and other government assistance to survive. American taxpayers effectively subsidize Walmart's low wages to the tune of $6.2 billion per year.\n\nWalmart reported $648 billion in revenue and $16 billion in profit last year. The Walton family's combined net worth exceeds $250 billion. Yet the average Walmart associate earns just $14.50 per hour — insufficient for basic needs in any US city.\n\nWe demand that Walmart:\n1. Raise minimum wage to $20/hour for all US employees\n2. Provide affordable healthcare for all employees working 20+ hours per week\n3. End unpredictable scheduling — provide schedules 3 weeks in advance\n4. Guarantee a minimum of 30 hours per week for all employees who want full-time status\n5. Stop union-busting activities and respect workers' right to organize\n\nA company that can't pay its workers enough to survive without government assistance isn't a successful business — it's a business that socializes its costs while privatizing its profits.`,
    targetCompany: 'Walmart',
    category: 'Retail',
    successCriteria: 'Walmart raises minimum wage to $20/hr, provides healthcare for 20+ hour workers, and ends unpredictable scheduling.',
    creatorId: 'user_049',
    creatorName: 'Tamara Jones',
    status: 'active',
    coSignCount: 41234,
    tags: ['living-wage', 'healthcare', 'retail', 'worker-rights'],
    escalationStage: 'movement',
  },
  {
    id: 'demand_015',
    title: 'AT&T: End Data Caps and Hidden Fees on All Plans',
    description: `AT&T charges customers for "unlimited" data plans that aren't actually unlimited. After hitting arbitrary data caps, speeds are throttled to unusable levels. Additionally, AT&T's bills are riddled with hidden fees — "administrative fees," "regulatory recovery fees," and other charges that can add $15-20 per month to the advertised price.\n\nA 2025 FCC study found that AT&T's actual monthly costs averaged 31% higher than advertised prices due to hidden fees. This bait-and-switch pricing is deceptive and exploitative.\n\nWe demand that AT&T:\n1. Eliminate all data caps on plans marketed as "unlimited"\n2. Include ALL fees in advertised prices — no hidden charges\n3. Stop throttling speeds for any reason other than genuine network congestion\n4. Provide honest speed tests showing actual vs. advertised speeds\n5. Allow customers to cancel without penalty when actual service doesn't match advertised service\n\nWhen you call something "unlimited," it should be unlimited. When you advertise a price, that should be the actual price. This isn't complicated — it's basic honesty.`,
    targetCompany: 'AT&T',
    category: 'Telecom',
    successCriteria: 'AT&T eliminates data caps on unlimited plans, includes all fees in advertised prices, and stops throttling.',
    creatorId: 'user_013',
    creatorName: 'Nate Sullivan',
    status: 'active',
    coSignCount: 25678,
    tags: ['data-caps', 'hidden-fees', 'telecom', 'net-neutrality'],
    escalationStage: 'campaign',
  },
  {
    id: 'demand_016',
    title: 'Comcast: Deliver the Broadband Speeds You Promise',
    description: `Comcast consistently delivers internet speeds far below what customers pay for. Independent testing shows that during peak hours, actual speeds can drop to 40-60% of advertised speeds. Despite receiving billions in government subsidies to expand broadband infrastructure, Comcast has underinvested in network capacity while raising prices.\n\nIn rural and underserved communities, the situation is even worse. Comcast cherry-picks profitable urban areas while leaving rural customers with decade-old infrastructure and abysmal speeds.\n\nWe demand that Comcast:\n1. Guarantee minimum 90% of advertised speeds 95% of the time\n2. Provide automatic bill credits when speeds fall below guaranteed minimums\n3. End data caps on all residential plans\n4. Invest a minimum of 30% of broadband revenue in infrastructure upgrades\n5. Fulfill all government-subsidized buildout commitments on schedule\n6. Publish real-time network performance data by region\n\nInternet access is essential infrastructure in 2026. You don't get to sell people 500 Mbps, deliver 200, and call it acceptable.`,
    targetCompany: 'Comcast',
    category: 'Telecom',
    successCriteria: 'Comcast guarantees 90% of advertised speeds, provides automatic credits for failures, and ends data caps.',
    creatorId: 'user_034',
    creatorName: 'Bethany Cruz',
    status: 'active',
    coSignCount: 19234,
    tags: ['broadband', 'internet-speed', 'rural-access', 'telecom'],
    escalationStage: 'campaign',
  },
  {
    id: 'demand_017',
    title: 'Netflix: Stop the Price Hikes and Ad-Tier Degradation',
    description: `Netflix has raised prices 8 times in the past decade while simultaneously degrading service quality. The introduction of the ad-supported tier was supposed to provide an affordable option, but instead Netflix has used it to normalize ads while continuing to raise prices on ad-free plans.\n\nSubscribers who signed up for an ad-free experience are now paying $23/month — more than double the original price. Meanwhile, content libraries have shrunk as Netflix lost licensing deals and cancelled popular shows to cut costs.\n\nWe demand that Netflix:\n1. Freeze ad-free plan prices for at least 24 months\n2. Guarantee ad-free subscribers will NEVER see ads, including promotional content\n3. Publish transparent content metrics — how much is being added vs. removed each quarter\n4. Allow users to download and keep purchased content permanently\n5. Restore password sharing for family members at the same household\n\nStreaming was supposed to be the affordable alternative to cable. Instead, it's becoming cable 2.0 with higher prices, more ads, and less content.`,
    targetCompany: 'Netflix',
    category: 'Entertainment',
    successCriteria: 'Netflix freezes ad-free prices for 24 months and guarantees no ads on premium plans.',
    creatorId: 'user_021',
    creatorName: 'Will Hernandez',
    status: 'active',
    coSignCount: 35678,
    tags: ['streaming', 'price-hikes', 'ads', 'entertainment'],
    escalationStage: 'movement',
  },
  {
    id: 'demand_018',
    title: 'Ticketmaster: End the Monopoly on Live Event Tickets',
    description: `Ticketmaster's monopolistic control over live event ticketing has created a system where fans routinely pay 2-3x face value for tickets due to "dynamic pricing," hidden fees, and a platform that enables scalping rather than preventing it.\n\nThe Taylor Swift Eras Tour debacle exposed what millions already knew: Ticketmaster's system is broken by design. Service fees regularly exceed 30% of ticket face value, "platinum" dynamic pricing artificially inflates costs, and the platform does virtually nothing to stop bot-driven scalping.\n\nWe demand that Ticketmaster/Live Nation:\n1. Cap all service fees at 10% of ticket face value\n2. Eliminate "dynamic pricing" that raises prices based on demand\n3. Implement effective anti-bot measures and verified-fan systems that actually work\n4. Make all fees visible upfront — no surprises at checkout\n5. Allow ticket transfers at face value only to prevent scalping\n6. Support legislation to break up the Live Nation/Ticketmaster monopoly\n\nLive music and events should be accessible to regular people, not just those willing to pay scalper prices. Ticketmaster has failed consumers and artists alike.`,
    targetCompany: 'Ticketmaster',
    category: 'Entertainment',
    successCriteria: 'Ticketmaster caps fees at 10%, eliminates dynamic pricing, and implements effective anti-scalping measures.',
    creatorId: 'user_042',
    creatorName: 'Malik Robinson',
    status: 'active',
    coSignCount: 58432,
    tags: ['ticketing', 'monopoly', 'live-events', 'consumer-rights'],
    escalationStage: 'movement',
  },
  {
    id: 'demand_019',
    title: 'Navient: End Predatory Student Loan Servicing Practices',
    description: `Navient, one of the largest student loan servicers, has a documented history of steering borrowers into costly repayment plans, providing incorrect information about forgiveness programs, and making it deliberately difficult to make payments correctly.\n\nA federal lawsuit found that Navient systematically failed to inform borrowers about income-driven repayment plans that would have saved them thousands. Instead, Navient pushed forbearance — which temporarily pauses payments but causes interest to capitalize, increasing the total loan balance.\n\nWe demand that Navient:\n1. Proactively inform ALL borrowers about the most affordable repayment option available to them\n2. Process Public Service Loan Forgiveness applications within 30 days\n3. Apply all payments to highest-interest balances first unless borrower specifies otherwise\n4. Provide clear, accurate information about all forgiveness programs\n5. Compensate borrowers who were steered into unnecessarily costly repayment plans\n6. Maintain adequate staffing to answer calls within 5 minutes\n\nStudent loan debt stands at $1.7 trillion. Navient profits from keeping borrowers confused and in debt longer. That has to stop.`,
    targetCompany: 'Navient',
    category: 'Finance',
    successCriteria: 'Navient proactively offers cheapest repayment options, processes PSLF within 30 days, and compensates affected borrowers.',
    creatorId: 'user_019',
    creatorName: 'Brandon Mitchell',
    status: 'active',
    coSignCount: 23456,
    tags: ['student-loans', 'predatory-lending', 'education', 'debt'],
    escalationStage: 'campaign',
  },
  {
    id: 'demand_020',
    title: 'Bank of America: Stop Charging Late Fees on Credit Cards',
    description: `Bank of America charges up to $41 per late credit card payment, generating billions in fee revenue annually. These fees disproportionately affect people experiencing financial hardship — the very customers who can least afford additional charges.\n\nLate fees have been shown to create debt spirals: a missed payment leads to a late fee, which leads to a higher balance, which leads to higher minimum payments, which leads to more missed payments. Bank of America profits from this cycle.\n\nWe demand that Bank of America:\n1. Eliminate late fees on all consumer credit cards\n2. Implement a 10-day grace period after the due date with no penalty\n3. Send multiple payment reminders via text, email, and app notification\n4. Offer automatic minimum payment as default enrollment to prevent missed payments\n5. Stop raising interest rates as punishment for single late payments\n\nBank of America reported $30 billion in profit last year. Late fees represent a tiny fraction of revenue but cause outsized harm to vulnerable customers. Eliminating them is the right thing to do — and a negligible business impact.`,
    targetCompany: 'Bank of America',
    category: 'Finance',
    successCriteria: 'Bank of America eliminates credit card late fees and implements 10-day grace period with multiple reminders.',
    creatorId: 'user_029',
    creatorName: 'Ryan O\'Brien',
    status: 'active',
    coSignCount: 16789,
    tags: ['late-fees', 'credit-cards', 'banking', 'debt'],
    escalationStage: 'campaign',
  },
  {
    id: 'demand_021',
    title: 'Shein: Disclose Your Full Supply Chain and Labor Practices',
    description: `Shein produces thousands of new clothing items daily at impossibly low prices, raising serious concerns about labor exploitation, environmental damage, and intellectual property theft. Investigations have found workers in Shein's supply chain working 18-hour days for as little as 3 cents per garment.\n\nShein's ultra-fast fashion model generates an estimated 6.3 million tons of CO2 annually and uses chemicals banned in many countries. Despite growing scrutiny, Shein has refused to disclose its full supply chain or submit to independent labor audits.\n\nWe demand that Shein:\n1. Publish a complete list of all factories and suppliers in their supply chain\n2. Submit to independent labor audits by accredited organizations\n3. Guarantee minimum wage compliance and maximum working hours for all supply chain workers\n4. Disclose all chemicals used in production and comply with EU REACH standards\n5. Implement a garment take-back and recycling program\n6. Pay for independent environmental impact assessments\n\n$4 t-shirts have a real cost — it's just paid by workers in factories and communities near polluted waterways instead of by consumers at checkout.`,
    targetCompany: 'Shein',
    category: 'Retail',
    successCriteria: 'Shein publishes full supply chain, submits to independent labor audits, and complies with international labor standards.',
    creatorId: 'user_036',
    creatorName: 'Ingrid Larsson',
    status: 'active',
    coSignCount: 29876,
    tags: ['fast-fashion', 'supply-chain', 'labor-rights', 'environment'],
    escalationStage: 'campaign',
  },
  // VICTORIES
  {
    id: 'demand_022',
    title: 'Microsoft: Make Windows Updates Non-Disruptive',
    description: `For years, Windows users have suffered through forced restarts, updates that break software, and the dreaded "Updating... Do not turn off your computer" screen during critical work moments. This demand rallied 15,000+ users demanding Microsoft give users full control over when and how updates are installed.\n\nAfter sustained pressure and media coverage generated by this campaign, Microsoft announced significant changes to their update policy in January 2026. The new policy allows users to defer all non-security updates indefinitely and schedule security updates for specific times.\n\nThis is what organized consumer pressure looks like. When thousands of people make a clear, measurable demand — companies listen.`,
    targetCompany: 'Microsoft',
    category: 'Technology',
    successCriteria: 'Microsoft gives users full control over update timing with no forced restarts for non-security updates.',
    creatorId: 'user_004',
    creatorName: 'David Park',
    status: 'met',
    coSignCount: 15234,
    tags: ['windows', 'updates', 'user-control', 'victory'],
    escalationStage: 'movement',
    resolvedAt: new Date('2026-01-15'),
    victoryStatement: 'Microsoft announced new update policies giving users full control. Updates can now be deferred indefinitely, and forced restarts are eliminated for non-security updates.',
  },
  {
    id: 'demand_023',
    title: 'Spotify: Increase Artist Royalty Payments',
    description: `Spotify pays artists an average of $0.003-0.005 per stream, meaning an artist needs roughly 250,000 streams just to earn the equivalent of a single minimum wage paycheck. Meanwhile, Spotify's CEO Daniel Ek has a net worth of $7 billion.\n\nThis demand brought together artists, fans, and industry professionals to demand fairer compensation. After reaching 20,000 co-signers and generating significant media attention, Spotify announced a new "Artist First" royalty structure in December 2025 that increased per-stream payments by 40% for independent artists.\n\nWhile there's still more work to be done, this represents a meaningful step toward fair artist compensation — achieved through collective consumer action.`,
    targetCompany: 'Spotify',
    category: 'Entertainment',
    successCriteria: 'Spotify increases average per-stream royalty payment by at least 30% and publishes transparent royalty data.',
    creatorId: 'user_042',
    creatorName: 'Malik Robinson',
    status: 'met',
    coSignCount: 21456,
    tags: ['music', 'artist-pay', 'streaming', 'victory'],
    escalationStage: 'campaign',
    resolvedAt: new Date('2025-12-20'),
    victoryStatement: 'Spotify increased independent artist royalties by 40% and launched a public royalty calculator. Artists can now see exactly how their streams translate to earnings.',
  },
  {
    id: 'demand_024',
    title: 'Adobe: End Surprise Cancellation Fees on Creative Cloud',
    description: `Adobe charged a hidden early termination fee of up to 50% of remaining subscription value when customers tried to cancel Creative Cloud annual plans. Many users didn't even know about this fee until they tried to cancel, leading to thousands of complaints and an FTC investigation.\n\nThis demand gathered over 30,000 co-signers in just two months, making it one of the fastest-growing campaigns on the platform. The combination of consumer pressure and regulatory scrutiny led Adobe to eliminate cancellation fees entirely in November 2025.\n\nA clear victory for consumer rights and proof that organized demand works.`,
    targetCompany: 'Adobe',
    category: 'Technology',
    successCriteria: 'Adobe eliminates all early termination fees and allows month-to-month cancellation of all subscription plans.',
    creatorId: 'user_023',
    creatorName: 'Alex Rivera',
    status: 'met',
    coSignCount: 32145,
    tags: ['subscription-traps', 'cancellation-fees', 'software', 'victory'],
    escalationStage: 'movement',
    resolvedAt: new Date('2025-11-08'),
    victoryStatement: 'Adobe eliminated all early termination fees and now allows month-to-month cancellation. The FTC cited consumer organizing as a factor in their enforcement action.',
  },
  {
    id: 'demand_025',
    title: 'Uber: Provide Transparent Fare Breakdowns to Riders',
    description: `Uber\'s opaque pricing algorithm charges different riders different prices for identical routes, and neither riders nor drivers can see how fares are calculated. Riders have reported being charged surge prices when no surge was visible, and drivers consistently receive a smaller percentage of the fare than Uber discloses.\n\nAfter 18,000 co-signers and extensive media coverage, Uber agreed to show riders a complete fare breakdown including Uber\'s take, the driver\'s earnings, and all fees before they confirm a ride. This policy went into effect in October 2025.`,
    targetCompany: 'Uber',
    category: 'Technology',
    successCriteria: 'Uber shows complete fare breakdown including driver earnings and company take on every ride.',
    creatorId: 'user_033',
    creatorName: 'Rashid Hassan',
    status: 'met',
    coSignCount: 18234,
    tags: ['ride-sharing', 'transparency', 'pricing', 'victory'],
    escalationStage: 'campaign',
    resolvedAt: new Date('2025-10-15'),
    victoryStatement: 'Uber now shows complete fare breakdowns on every ride, including driver earnings and platform fees. Transparency wins.',
  },
  // More active demands
  {
    id: 'demand_026',
    title: 'Amazon: End Subscription Traps — Make Cancellation Easy',
    description: `Amazon Prime cancellation is a deliberately frustrating process involving multiple screens, guilt-trip messaging, and confusing button layouts designed to prevent cancellation. The FTC has already filed a lawsuit against Amazon for these "dark patterns," but the practice continues.\n\nCancelling Amazon Prime requires navigating through at least 6 screens with multiple "are you sure?" prompts, misleading button colors, and offers designed to confuse. Research shows that this process prevents an estimated 14% of users from successfully cancelling even when they want to.\n\nWe demand that Amazon:\n1. Implement one-click cancellation for Prime and all subscription services\n2. Stop using dark patterns and manipulative design to prevent cancellation\n3. Provide clear, upfront disclosure of what cancellation means for existing orders\n4. Send renewal reminders 7 days before charging, with one-click cancel option in the email\n5. Refund partial subscription fees for unused portions\n\nIf your product is good enough, people will choose to keep it. You shouldn't need to trick people into staying.`,
    targetCompany: 'Amazon',
    category: 'Retail',
    successCriteria: 'Amazon implements one-click cancellation for all subscriptions and ends dark pattern design.',
    creatorId: 'user_006',
    creatorName: 'Aisha Okonkwo',
    status: 'active',
    coSignCount: 27654,
    tags: ['subscription-traps', 'dark-patterns', 'cancellation', 'consumer-rights'],
    escalationStage: 'campaign',
  },
  {
    id: 'demand_027',
    title: 'All Hospitals: Publish Real Prices Before Treatment',
    description: `Despite federal price transparency rules that went into effect in 2021, the majority of hospitals still don't comply. Patients routinely receive bills 5-10x higher than expected because hospitals refuse to disclose prices upfront. A 2025 study found that only 36% of hospitals are fully compliant with pricing transparency requirements.\n\nMedical debt is the leading cause of bankruptcy in America. No one should have to choose between their health and their financial future because a hospital won't tell them what a procedure costs.\n\nWe demand that ALL major hospital systems:\n1. Publish complete, searchable price lists for all procedures and services\n2. Provide binding cost estimates before any non-emergency procedure\n3. Honor published prices regardless of insurance status\n4. Implement financial counseling for any bill exceeding $1,000\n5. End surprise billing for any service at an in-network facility\n\nYou can check the price of a hamburger before you order it. You should be able to check the price of an MRI before you get one.`,
    targetCompany: 'UnitedHealth Group',
    category: 'Healthcare',
    successCriteria: 'Major hospital systems achieve 100% price transparency compliance and provide binding cost estimates.',
    creatorId: 'user_018',
    creatorName: 'Olivia Chang',
    status: 'active',
    coSignCount: 38765,
    tags: ['hospital-pricing', 'transparency', 'medical-debt', 'healthcare'],
    escalationStage: 'movement',
  },
  {
    id: 'demand_028',
    title: 'Meta: Protect Children from Algorithm-Driven Content Addiction',
    description: `Meta\'s platforms, particularly Instagram, have been shown to contribute to anxiety, depression, and body image issues in teenagers. Internal research that Meta attempted to suppress showed that 32% of teen girls said Instagram made them feel worse about their bodies.\n\nDespite congressional hearings and public outrage, Meta\'s changes have been cosmetic. The algorithm still optimizes for engagement over wellbeing, and age verification remains trivially easy to bypass.\n\nWe demand that Meta:\n1. Implement robust age verification using industry-standard methods\n2. Disable algorithmic content recommendations entirely for users under 16\n3. Enforce meaningful daily time limits for minor users\n4. Ban targeted advertising to users under 18\n5. Fund independent research on social media\'s impact on youth mental health\n6. Submit to annual child safety audits by qualified independent organizations\n\nOur children are not engagement metrics. Their mental health is not an acceptable cost of doing business.`,
    targetCompany: 'Meta',
    category: 'Technology',
    successCriteria: 'Meta implements real age verification, disables algorithmic feeds for minors, and bans youth-targeted ads.',
    creatorId: 'user_038',
    creatorName: 'Michelle Patel',
    status: 'active',
    coSignCount: 54321,
    tags: ['child-safety', 'social-media', 'mental-health', 'algorithm'],
    escalationStage: 'movement',
  },
  {
    id: 'demand_029',
    title: 'Comcast: End Contract Lock-Ins and Equipment Rental Fees',
    description: `Comcast locks customers into 1-2 year contracts with steep early termination fees, then charges $14/month to rent a cable modem that costs $80 to buy. These practices trap customers in overpriced service and extract maximum revenue from a captive audience.\n\nThe average Comcast customer pays over $160/month in equipment rental fees over the course of their contract — twice what the equipment is worth. Combined with hidden fee increases that kick in after promotional periods, many customers end up paying double what they expected.\n\nWe demand that Comcast:\n1. End all long-term contracts — offer month-to-month service only\n2. Allow customers to use their own equipment with full functionality\n3. Cap equipment rental fees at actual depreciated equipment cost\n4. Disclose the full post-promotional price before any signup\n5. Provide 30-day notice before any price increase with penalty-free cancellation option\n\nIn a competitive market, companies earn loyalty through quality service — not through contract lock-ins and hidden fees.`,
    targetCompany: 'Comcast',
    category: 'Telecom',
    successCriteria: 'Comcast ends contracts, allows customer-owned equipment, and discloses full pricing upfront.',
    creatorId: 'user_013',
    creatorName: 'Nate Sullivan',
    status: 'active',
    coSignCount: 14567,
    tags: ['contracts', 'equipment-fees', 'telecom', 'consumer-rights'],
    escalationStage: 'campaign',
  },
  {
    id: 'demand_030',
    title: 'Google: Stop Burying Organic Search Results Under Ads',
    description: `Google search results have become increasingly dominated by ads, with users often needing to scroll past 4-5 advertisements before seeing any organic results. On mobile, ads can fill the entire first screen, making it harder than ever to find unbiased information.\n\nGoogle\'s search ad revenue was $192 billion last year. Their incentive is to show more ads, not better results. The quality of Google Search has measurably declined as the company prioritizes ad revenue over user experience.\n\nWe demand that Google:\n1. Limit ads to a maximum of 2 per search results page\n2. Clearly differentiate ads from organic results with prominent labeling\n3. Never allow ads to fill more than 20% of visible screen space\n4. Publish quality metrics showing search result relevance over time\n5. Offer an ad-free search option at a reasonable price\n\nSearch is essential infrastructure for the modern internet. When the dominant search engine becomes an ad platform first and a search engine second, everyone suffers.`,
    targetCompany: 'Google',
    category: 'Technology',
    successCriteria: 'Google limits search ads to 2 per page and clearly differentiates ads from organic results.',
    creatorId: 'user_008',
    creatorName: 'Priya Sharma',
    status: 'active',
    coSignCount: 22345,
    tags: ['search', 'ads', 'organic-results', 'internet'],
    escalationStage: 'campaign',
  },
  {
    id: 'demand_031',
    title: 'Pesticide Transparency: Require Full Disclosure on All Produce',
    description: `American consumers have virtually no way to know which pesticides were used on the produce they buy. While organic labeling provides some assurance, conventional produce — which makes up 85% of the market — has no pesticide disclosure requirements.\n\nA 2025 USDA study found detectable pesticide residues on 70% of conventional produce tested, with some samples containing residues from 10+ different chemicals. Many of these chemicals are restricted or banned in the EU.\n\nWe demand that Kroger and major grocery retailers:\n1. Require suppliers to disclose all pesticides used on produce sold in stores\n2. Display pesticide information on shelf labels or via scannable QR codes\n3. Prioritize suppliers who use fewer and less toxic pesticides\n4. Phase out produce treated with neonicotinoids and other bee-killing pesticides\n5. Fund independent testing of produce for pesticide residues\n\nConsumers have a right to know what chemicals are on their food. Full stop.`,
    targetCompany: 'Kroger',
    category: 'Food',
    successCriteria: 'Major grocers implement pesticide disclosure on all produce via labeling or QR codes.',
    creatorId: 'user_050',
    creatorName: 'Luis Gutierrez',
    status: 'active',
    coSignCount: 11234,
    tags: ['pesticides', 'food-safety', 'produce', 'transparency'],
    escalationStage: 'petition',
  },
  {
    id: 'demand_032',
    title: 'Apple: End Planned Obsolescence in iPhones',
    description: `Apple has been caught deliberately slowing down older iPhones through software updates, making batteries non-replaceable, and discontinuing support for devices that are still perfectly functional. This planned obsolescence strategy forces consumers to buy new devices every 2-3 years, generating massive e-waste.\n\nApple paid a $500 million settlement for secretly throttling iPhone performance, but the practice continues in subtler forms. Each iOS update makes older devices slightly slower, and apps increasingly require the latest hardware.\n\nWe demand that Apple:\n1. Support all iPhones with software updates for a minimum of 7 years\n2. Make batteries user-replaceable or offer $29 battery replacement indefinitely\n3. Stop performance throttling on older devices without explicit user consent\n4. Publish performance benchmarks showing how updates affect older devices\n5. Offer a "stability mode" that maintains current performance instead of adding features\n\nThe most sustainable phone is the one you already own. Apple can keep selling new phones to people who want them without forcing everyone else to upgrade.`,
    targetCompany: 'Apple',
    category: 'Technology',
    successCriteria: 'Apple commits to 7-year software support, affordable battery replacement, and no performance throttling.',
    creatorId: 'user_027',
    creatorName: 'Omar Farouk',
    status: 'active',
    coSignCount: 28765,
    tags: ['planned-obsolescence', 'e-waste', 'iphone', 'sustainability'],
    escalationStage: 'campaign',
  },
  {
    id: 'demand_033',
    title: 'AI Companies: Mandatory Transparency in AI Training Data',
    description: `AI companies including OpenAI, Google, and Meta are training models on vast datasets scraped from the internet without consent. Artists, writers, and creators are having their work used to train AI systems that then compete with them — without compensation or even acknowledgment.\n\nThe lack of transparency around training data means we don't know what biases are baked into AI systems, what copyrighted material was used, or what personal information was included. This opacity is unacceptable for technology that increasingly shapes our lives.\n\nWe demand that AI companies:\n1. Publish complete training data documentation for all commercial AI models\n2. Implement opt-out mechanisms that are actually honored\n3. Compensate creators whose work was used in training data\n4. Submit to independent bias and safety audits before deploying new models\n5. Provide clear labeling for all AI-generated content\n\nAI has enormous potential, but building it on stolen work and hidden data isn't innovation — it's exploitation.`,
    targetCompany: 'Google',
    category: 'Technology',
    successCriteria: 'Major AI companies publish training data documentation and implement compensation for creators.',
    creatorId: 'user_052',
    creatorName: 'Kwame Asante',
    status: 'active',
    coSignCount: 33456,
    tags: ['AI', 'training-data', 'transparency', 'creator-rights'],
    escalationStage: 'campaign',
  },
];

// ============ COMMENTS ============
function generateComments(demandId: string, count: number): any[] {
  const commentTemplates = [
    { userId: 'user_001', name: 'Sarah Chen', texts: ['This is exactly the kind of organized pressure we need. I\'ve been following this issue for years and this demand is well-crafted.', 'Great progress on co-signers! Let\'s keep pushing.'] },
    { userId: 'user_002', name: 'Marcus Johnson', texts: ['Signed and shared with my entire network. We need at least 50k to make them listen.', 'Has anyone reached out to media contacts about this?'] },
    { userId: 'user_003', name: 'Emma Rodriguez', texts: ['I see the impact of this every day at work. This demand gives me hope.', 'The success criteria here are really clear — that\'s what makes this different from a petition.'] },
    { userId: 'user_006', name: 'Aisha Okonkwo', texts: ['From a legal perspective, this demand is solid. The success criteria are measurable and specific.', 'We should organize a social media push this weekend.'] },
    { userId: 'user_007', name: 'James Whitfield', texts: ['Been waiting for something like this. Count me in.', 'Shared with my community group — they\'re all signing.'] },
    { userId: 'user_008', name: 'Priya Sharma', texts: ['The data backs this up completely. I can share some statistics if anyone wants to use them for social media.', 'Just ran the numbers — if we hit 50k co-signers, the media attention alone would be worth it.'] },
    { userId: 'user_010', name: 'Rachel Kim', texts: ['As a parent, this hits close to home. We need to protect consumers and families.', 'I\'m bringing this up at our next PTA meeting.'] },
    { userId: 'user_012', name: 'Fatima Al-Rashid', texts: ['The financial impact on regular people is staggering. We need change NOW.', 'Has anyone calculated the total consumer savings if this demand is met?'] },
    { userId: 'user_016', name: 'Sofia Petrov', texts: ['The environmental angle here is huge. Let me share some data from my research.', 'Corporations won\'t change unless we make them. This platform is powerful.'] },
    { userId: 'user_024', name: 'Hannah Goldstein', texts: ['Legally sound demand with clear, achievable criteria. This could actually work.', 'I can help draft talking points if we get media attention.'] },
    { userId: 'user_029', name: 'Ryan O\'Brien', texts: ['I used to work in this industry. Everything in this demand is accurate and achievable.', 'The company knows this is the right thing to do — they just need pressure to act.'] },
    { userId: 'user_042', name: 'Malik Robinson', texts: ['Just shared this with my followers. Let\'s make this viral.', 'The power of collective action is real. Keep pushing!'] },
    { userId: 'user_045', name: 'Zara Ahmed', texts: ['I\'m working on an article about this demand. Can the creator DM me?', 'The momentum here is incredible. 10k in just two weeks.'] },
    { userId: 'user_052', name: 'Kwame Asante', texts: ['This is a textbook case of market failure. Collective action is the appropriate response.', 'My students are using this platform as a case study. Brilliant model.'] },
  ];
  
  const comments: any[] = [];
  for (let i = 0; i < count; i++) {
    const template = randomItem(commentTemplates);
    const text = randomItem(template.texts);
    comments.push({
      demandId,
      userId: template.userId,
      userName: template.name,
      text,
      createdAt: randomDate(4),
      likes: randomInt(0, 45),
    });
  }
  return comments;
}

// ============ CORPORATE RESPONSES ============
const CORPORATE_RESPONSES = [
  {
    demandId: 'demand_001',
    companyName: 'Apple',
    responderId: 'apple_pr',
    responderTitle: 'VP of Environmental, Policy and Social Initiatives',
    message: 'Apple is committed to providing the best service experience for our customers. We\'ve expanded our Self Service Repair program to cover more devices and are working with authorized service providers to ensure quality repairs. We take these concerns seriously and will continue to evolve our repair programs.',
    acceptCount: 234,
    rejectCount: 4521,
    insufficientCount: 8934,
    type: 'pr_fluff',
  },
  {
    demandId: 'demand_002',
    companyName: 'Google',
    responderId: 'google_pr',
    responderTitle: 'Director of Privacy Engineering',
    message: 'Privacy is core to everything we do at Google. We\'ve invested billions in privacy-preserving technologies and offer industry-leading controls. Our Privacy Checkup tool allows users to review and adjust their settings in minutes. We\'re always working to make these controls more accessible.',
    acceptCount: 156,
    rejectCount: 6789,
    insufficientCount: 12345,
    type: 'pr_fluff',
  },
  {
    demandId: 'demand_006',
    companyName: 'Eli Lilly',
    responderId: 'lilly_pr',
    responderTitle: 'Chief Patient Officer',
    message: 'Eli Lilly has taken significant steps to reduce insulin costs, including our Insulin Value Program that caps out-of-pocket costs at $35 per month for commercially insured patients. We recognize more needs to be done and are working with policymakers and payers to expand access.',
    acceptCount: 3456,
    rejectCount: 8765,
    insufficientCount: 15678,
    type: 'partial',
  },
  {
    demandId: 'demand_003',
    companyName: 'Amazon',
    responderId: 'amazon_pr',
    responderTitle: 'VP of Workplace Health & Safety',
    message: 'The safety and wellbeing of our employees is our top priority. We\'ve invested over $15 billion in safety measures since 2019, including ergonomic improvements, robotics to reduce physical strain, and comprehensive health benefits. Our injury rates have improved 28% over the past three years.',
    acceptCount: 567,
    rejectCount: 9876,
    insufficientCount: 14567,
    type: 'pr_fluff',
  },
  {
    demandId: 'demand_005',
    companyName: 'JPMorgan Chase',
    responderId: 'chase_pr',
    responderTitle: 'Head of Consumer Banking',
    message: 'Chase has already taken steps to reduce the impact of overdraft fees, including eliminating fees on transactions of $5 or less and providing a grace period for customers to bring their accounts current. We continue to evaluate our fee policies.',
    acceptCount: 890,
    rejectCount: 5678,
    insufficientCount: 9012,
    type: 'partial',
  },
  {
    demandId: 'demand_008',
    companyName: 'McDonald\'s',
    responderId: 'mcdonalds_pr',
    responderTitle: 'Chief People Officer',
    message: 'McDonald\'s has raised wages at company-owned restaurants to an average of $15/hour and offers tuition assistance through Archways to Opportunity. We encourage our franchise partners to offer competitive wages and benefits. We believe in creating opportunity for our 2 million+ workers worldwide.',
    acceptCount: 456,
    rejectCount: 7890,
    insufficientCount: 11234,
    type: 'partial',
  },
  {
    demandId: 'demand_011',
    companyName: 'ExxonMobil',
    responderId: 'exxon_pr',
    responderTitle: 'VP of Sustainability',
    message: 'ExxonMobil is committed to our net-zero ambition by 2050. We\'ve invested $17 billion in lower-emission technologies including carbon capture, hydrogen, and biofuels. We support the Paris Agreement goals and are taking meaningful action to reduce our operational emissions.',
    acceptCount: 123,
    rejectCount: 12345,
    insufficientCount: 18765,
    type: 'pr_fluff',
  },
  {
    demandId: 'demand_018',
    companyName: 'Ticketmaster',
    responderId: 'tm_pr',
    responderTitle: 'Head of Fan Experience',
    message: 'We understand fans\' frustrations and are continuously working to improve the ticketing experience. We\'ve invested in anti-bot technology and Verified Fan systems. Dynamic pricing is set by artists and their teams, not Ticketmaster. We\'re committed to transparency in our fee structure.',
    acceptCount: 89,
    rejectCount: 15678,
    insufficientCount: 20345,
    type: 'deflection',
  },
  {
    demandId: 'demand_014',
    companyName: 'Walmart',
    responderId: 'walmart_pr',
    responderTitle: 'EVP of People',
    message: 'Walmart has invested over $20 billion in associate wages and benefits over the past decade. Our average hourly wage is now $17.50, and we provide a range of benefits including healthcare, 401(k) matching, and education assistance through Live Better U.',
    acceptCount: 567,
    rejectCount: 8901,
    insufficientCount: 13456,
    type: 'partial',
  },
  {
    demandId: 'demand_017',
    companyName: 'Netflix',
    responderId: 'netflix_pr',
    responderTitle: 'VP of Product',
    message: 'We\'re focused on delivering the best entertainment experience for our members. Our ad-supported plan offers an affordable option, and we continue to invest record amounts in content. We value member feedback and are always looking for ways to improve.',
    acceptCount: 234,
    rejectCount: 9012,
    insufficientCount: 12345,
    type: 'pr_fluff',
  },
  {
    demandId: 'demand_015',
    companyName: 'AT&T',
    responderId: 'att_pr',
    responderTitle: 'SVP of Consumer Services',
    message: 'AT&T has made significant investments in our 5G and fiber networks. We offer a range of plans to meet different needs and budgets. All fees are disclosed in our terms of service, and we provide tools for customers to monitor their data usage.',
    acceptCount: 178,
    rejectCount: 6543,
    insufficientCount: 10987,
    type: 'deflection',
  },
  {
    demandId: 'demand_007',
    companyName: 'UnitedHealth Group',
    responderId: 'uhg_pr',
    responderTitle: 'Chief Medical Officer',
    message: 'UnitedHealth Group is committed to ensuring our members receive appropriate, timely care. Our clinical review processes involve qualified medical professionals and comply with all state and federal regulations. We continually refine our processes based on member feedback and clinical evidence.',
    acceptCount: 145,
    rejectCount: 11234,
    insufficientCount: 16789,
    type: 'deflection',
  },
  {
    demandId: 'demand_004',
    companyName: 'Meta',
    responderId: 'meta_pr',
    responderTitle: 'VP of Integrity',
    message: 'Transparency is a priority for Meta. We publish regular transparency reports, have made our content ranking preferences more visible, and offer Feed controls that let people see content from their chosen sources. We\'re committed to giving people more control over their experience.',
    acceptCount: 234,
    rejectCount: 8901,
    insufficientCount: 14567,
    type: 'pr_fluff',
  },
  {
    demandId: 'demand_016',
    companyName: 'Comcast',
    responderId: 'comcast_pr',
    responderTitle: 'SVP of Customer Experience',
    message: 'Comcast is investing $20 billion in network infrastructure over the next several years. We offer xFi tools that give customers visibility into their network performance. Our commitment is to provide reliable, fast internet to all our customers.',
    acceptCount: 156,
    rejectCount: 5678,
    insufficientCount: 9012,
    type: 'pr_fluff',
  },
  {
    demandId: 'demand_021',
    companyName: 'Shein',
    responderId: 'shein_pr',
    responderTitle: 'Head of ESG',
    message: 'Shein takes supply chain responsibility seriously. We have published our supplier code of conduct and are working toward greater transparency. We conduct regular audits of our tier-1 suppliers and are committed to responsible sourcing.',
    acceptCount: 67,
    rejectCount: 7890,
    insufficientCount: 12345,
    type: 'deflection',
  },
  // Demands with NO response (silence)
  // demand_009 (DoorDash), demand_010 (Kroger), demand_012 (Duke Energy), demand_013 (Tesla),
  // demand_019 (Navient), demand_020 (Bank of America)
];

// ============ SPOKESPERSON NOMINATIONS ============
const SPOKESPERSON_NOMINATIONS = [
  { demandId: 'demand_006', nomineeId: 'user_003', nomineeName: 'Emma Rodriguez', nominatedBy: 'user_001', votes: { approve: 234, reject: 12 }, reason: 'Healthcare professional with direct experience in insulin pricing issues' },
  { demandId: 'demand_001', nomineeId: 'user_004', nomineeName: 'David Park', nominatedBy: 'user_008', votes: { approve: 189, reject: 8 }, reason: 'Software engineer and right-to-repair advocate who created this demand' },
  { demandId: 'demand_002', nomineeId: 'user_025', nomineeName: 'Chris Nakamura', nominatedBy: 'user_004', votes: { approve: 167, reject: 23 }, reason: 'Cybersecurity professional with deep knowledge of tracking technologies' },
  { demandId: 'demand_003', nomineeId: 'user_011', nomineeName: 'Tyler Brooks', nominatedBy: 'user_015', votes: { approve: 312, reject: 15 }, reason: 'Current Amazon warehouse worker who knows the conditions firsthand' },
  { demandId: 'demand_005', nomineeId: 'user_012', nomineeName: 'Fatima Al-Rashid', nominatedBy: 'user_029', votes: { approve: 145, reject: 7 }, reason: 'Financial literacy educator who understands banking practices inside and out' },
  { demandId: 'demand_011', nomineeId: 'user_005', nomineeName: 'Lisa Thompson', nominatedBy: 'user_032', votes: { approve: 278, reject: 34 }, reason: 'Environmental journalist with extensive coverage of ExxonMobil' },
  { demandId: 'demand_018', nomineeId: 'user_042', nomineeName: 'Malik Robinson', nominatedBy: 'user_045', votes: { approve: 456, reject: 21 }, reason: 'Artist with massive platform to amplify the campaign' },
  { demandId: 'demand_014', nomineeId: 'user_049', nomineeName: 'Tamara Jones', nominatedBy: 'user_015', votes: { approve: 198, reject: 11 }, reason: 'Union representative with negotiation experience' },
  { demandId: 'demand_007', nomineeId: 'user_022', nomineeName: 'Tanya Okafor', nominatedBy: 'user_003', votes: { approve: 234, reject: 19 }, reason: 'Nurse practitioner who sees insurance denial impacts daily' },
  { demandId: 'demand_004', nomineeId: 'user_008', nomineeName: 'Priya Sharma', nominatedBy: 'user_025', votes: { approve: 201, reject: 14 }, reason: 'Data scientist who can speak to algorithmic harms with evidence' },
  { demandId: 'demand_028', nomineeId: 'user_038', nomineeName: 'Michelle Patel', nominatedBy: 'user_010', votes: { approve: 345, reject: 8 }, reason: 'Pediatrician with expertise in children\'s mental health' },
  { demandId: 'demand_033', nomineeId: 'user_052', nomineeName: 'Kwame Asante', nominatedBy: 'user_008', votes: { approve: 167, reject: 12 }, reason: 'Political science professor studying AI governance' },
];

// ============ COALITIONS ============
const COALITIONS = [
  {
    id: 'coalition_001',
    name: 'Tech Accountability Alliance',
    description: 'Uniting demands across Apple, Google, Meta, and Amazon to push for comprehensive tech industry reform. When these companies see coordinated pressure across multiple fronts, they can\'t dismiss any single demand.',
    demandIds: ['demand_001', 'demand_002', 'demand_003', 'demand_004', 'demand_026', 'demand_028', 'demand_030', 'demand_032', 'demand_033'],
    targetCompanies: ['Apple', 'Google', 'Meta', 'Amazon'],
    creatorId: 'user_001',
    creatorName: 'Sarah Chen',
    totalCoSigners: 289432,
    pressureScore: 94,
    tags: ['technology', 'accountability', 'consumer-rights'],
  },
  {
    id: 'coalition_002',
    name: 'Healthcare for All Coalition',
    description: 'Combining demands for insulin pricing, insurance reform, and hospital transparency. Healthcare is a right, not a privilege, and these demands together paint a picture of a system that needs fundamental change.',
    demandIds: ['demand_006', 'demand_007', 'demand_027'],
    targetCompanies: ['Eli Lilly', 'UnitedHealth Group'],
    creatorId: 'user_003',
    creatorName: 'Emma Rodriguez',
    totalCoSigners: 149566,
    pressureScore: 91,
    tags: ['healthcare', 'insulin', 'insurance', 'transparency'],
  },
  {
    id: 'coalition_003',
    name: 'Fair Wages Movement',
    description: 'Workers at McDonald\'s, Walmart, Amazon, and gig economy platforms deserve living wages and fair treatment. This coalition connects labor demands across industries to build unstoppable momentum.',
    demandIds: ['demand_008', 'demand_014', 'demand_003', 'demand_009'],
    targetCompanies: ['McDonald\'s', 'Walmart', 'Amazon', 'DoorDash'],
    creatorId: 'user_015',
    creatorName: 'Derek Foster',
    totalCoSigners: 143510,
    pressureScore: 87,
    tags: ['wages', 'labor', 'worker-rights'],
  },
  {
    id: 'coalition_004',
    name: 'Internet Freedom Alliance',
    description: 'Fighting data caps, hidden fees, contract lock-ins, and the digital divide. Everyone deserves fast, affordable, honest internet service.',
    demandIds: ['demand_015', 'demand_016', 'demand_029'],
    targetCompanies: ['AT&T', 'Comcast'],
    creatorId: 'user_013',
    creatorName: 'Nate Sullivan',
    totalCoSigners: 59479,
    pressureScore: 72,
    tags: ['internet', 'broadband', 'telecom', 'digital-divide'],
  },
  {
    id: 'coalition_005',
    name: 'Food Justice Network',
    description: 'From farm worker pesticide exposure to grocery shrinkflation to food delivery exploitation — our food system needs reform at every level.',
    demandIds: ['demand_008', 'demand_009', 'demand_010', 'demand_031'],
    targetCompanies: ['McDonald\'s', 'DoorDash', 'Kroger'],
    creatorId: 'user_014',
    creatorName: 'Mei-Lin Wu',
    totalCoSigners: 83858,
    pressureScore: 68,
    tags: ['food', 'agriculture', 'workers', 'transparency'],
  },
  {
    id: 'coalition_006',
    name: 'Climate Corporate Accountability',
    description: 'Holding fossil fuel companies and greenwashers accountable for their climate commitments. The planet can\'t wait for voluntary action.',
    demandIds: ['demand_011', 'demand_013'],
    targetCompanies: ['ExxonMobil', 'Tesla'],
    creatorId: 'user_005',
    creatorName: 'Lisa Thompson',
    totalCoSigners: 65554,
    pressureScore: 79,
    tags: ['climate', 'energy', 'greenwashing'],
  },
];

// ============ MAIN SEED FUNCTION ============
async function seed() {
  console.log('🚀 Starting massive seed...\n');

  // 1. Seed Users
  console.log('👤 Seeding users...');
  let batch = db.batch();
  let batchCount = 0;
  
  for (const user of USERS) {
    const userRef = db.collection('users').doc(user.id);
    batch.set(userRef, {
      uid: user.id,
      email: `${user.name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 12)}@demand.app`,
      displayName: user.name,
      bio: user.bio,
      reputation: user.reputation,
      badges: user.badges,
      activityLevel: user.activity,
      verifiedStatus: user.badges.includes('Verified') ? 'verified' : user.reputation > 1500 ? 'trusted' : 'unverified',
      createdAt: Timestamp.fromDate(randomDate(6)),
      photoURL: null,
      coSignedDemands: [],
      createdDemands: [],
    });
    batchCount++;
    if (batchCount >= 490) {
      await batch.commit();
      batch = db.batch();
      batchCount = 0;
    }
  }
  if (batchCount > 0) {
    await batch.commit();
  }
  console.log(`  ✅ ${USERS.length} users created`);

  // 2. Seed Companies
  console.log('🏢 Seeding companies...');
  batch = db.batch();
  for (const company of COMPANIES) {
    const companyRef = db.collection('companies').doc(company.name.toLowerCase().replace(/[^a-z0-9]/g, '-'));
    batch.set(companyRef, {
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
      createdAt: Timestamp.fromDate(randomDate(6)),
    });
  }
  await batch.commit();
  console.log(`  ✅ ${COMPANIES.length} companies created`);

  // 3. Seed Demands
  console.log('📋 Seeding demands...');
  for (const demand of DEMANDS) {
    const coSignerIds = USERS
      .map(u => u.id)
      .filter(id => id !== demand.creatorId)
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(demand.coSignCount, 50));

    const createdAt = (demand as any).resolvedAt 
      ? new Date((demand as any).resolvedAt.getTime() - randomInt(60, 180) * 24 * 60 * 60 * 1000)
      : randomDate(5);

    await db.collection('demands').doc(demand.id).set({
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
      createdAt: Timestamp.fromDate(createdAt),
      updatedAt: Timestamp.fromDate(new Date()),
      ...(demand.status === 'met' ? {
        resolvedAt: Timestamp.fromDate((demand as any).resolvedAt),
        victoryStatement: (demand as any).victoryStatement,
      } : {}),
    });
  }
  console.log(`  ✅ ${DEMANDS.length} demands created`);

  // 4. Seed Comments (Messages)
  console.log('💬 Seeding comments...');
  batch = db.batch();
  batchCount = 0;
  let totalComments = 0;
  
  for (const demand of DEMANDS) {
    const commentCount = demand.status === 'met' ? randomInt(8, 15) : 
                          demand.coSignCount > 30000 ? randomInt(6, 12) : randomInt(2, 6);
    const comments = generateComments(demand.id, commentCount);
    
    for (const comment of comments) {
      const commentRef = db.collection('demands').doc(demand.id).collection('messages').doc();
      batch.set(commentRef, {
        ...comment,
        createdAt: Timestamp.fromDate(comment.createdAt),
      });
      batchCount++;
      totalComments++;
      if (batchCount >= 490) {
        await batch.commit();
        batch = db.batch();
        batchCount = 0;
      }
    }
  }
  if (batchCount > 0) await batch.commit();
  console.log(`  ✅ ${totalComments} comments created`);

  // 5. Seed Corporate Responses
  console.log('🏛️ Seeding corporate responses...');
  batch = db.batch();
  for (const response of CORPORATE_RESPONSES) {
    const responseRef = db.collection('demands').doc(response.demandId).collection('corporateResponses').doc();
    batch.set(responseRef, {
      companyName: response.companyName,
      responderId: response.responderId,
      responderTitle: response.responderTitle,
      message: response.message,
      acceptCount: response.acceptCount,
      rejectCount: response.rejectCount,
      insufficientCount: response.insufficientCount,
      ratings: [],
      createdAt: Timestamp.fromDate(randomDate(3)),
    });
  }
  await batch.commit();
  console.log(`  ✅ ${CORPORATE_RESPONSES.length} corporate responses created`);

  // 6. Seed Spokesperson Nominations
  console.log('🎤 Seeding spokesperson nominations...');
  batch = db.batch();
  for (const nom of SPOKESPERSON_NOMINATIONS) {
    const nomRef = db.collection('demands').doc(nom.demandId).collection('spokespersonNominations').doc();
    batch.set(nomRef, {
      nomineeId: nom.nomineeId,
      nomineeName: nom.nomineeName,
      nominatedBy: nom.nominatedBy,
      reason: nom.reason,
      approveVotes: nom.votes.approve,
      rejectVotes: nom.votes.reject,
      createdAt: Timestamp.fromDate(randomDate(3)),
    });
  }
  await batch.commit();
  console.log(`  ✅ ${SPOKESPERSON_NOMINATIONS.length} spokesperson nominations created`);

  // 7. Seed Coalitions
  console.log('🤝 Seeding coalitions...');
  batch = db.batch();
  for (const coalition of COALITIONS) {
    const coalRef = db.collection('coalitions').doc(coalition.id);
    batch.set(coalRef, {
      ...coalition,
      createdAt: Timestamp.fromDate(randomDate(4)),
      updatedAt: Timestamp.fromDate(new Date()),
    });
  }
  await batch.commit();
  console.log(`  ✅ ${COALITIONS.length} coalitions created`);

  // 8. Seed weekly digests
  console.log('📰 Seeding weekly digests...');
  batch = db.batch();
  for (let i = 0; i < 8; i++) {
    const weekStart = new Date(Date.now() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    const digestRef = db.collection('weeklyDigests').doc();
    batch.set(digestRef, {
      weekStart: Timestamp.fromDate(weekStart),
      weekEnd: Timestamp.fromDate(weekEnd),
      newDemands: randomInt(2, 8),
      totalCoSigners: randomInt(5000, 25000),
      topDemands: DEMANDS.slice(0, 5).map(d => ({ id: d.id, title: d.title, coSignCount: d.coSignCount })),
      corporateResponses: randomInt(1, 5),
      victories: i < 2 ? randomInt(0, 1) : 0,
      trendingCompanies: ['Apple', 'Google', 'Eli Lilly', 'Amazon', 'Ticketmaster'].sort(() => Math.random() - 0.5).slice(0, 3),
      createdAt: Timestamp.fromDate(weekEnd),
    });
  }
  await batch.commit();
  console.log('  ✅ 8 weekly digests created');

  // 9. Seed pressure board entries
  console.log('📊 Seeding pressure board...');
  batch = db.batch();
  for (let i = 0; i < COMPANIES.length; i++) {
    const company = COMPANIES[i];
    const entryRef = db.collection('pressureBoard').doc(company.name.toLowerCase().replace(/[^a-z0-9]/g, '-'));
    batch.set(entryRef, {
      companyName: company.name,
      pressureScore: company.pressureScore,
      activeDemands: randomInt(1, 5),
      totalCoSigners: randomInt(10000, 80000),
      velocity: randomInt(-5, 15),
      rank: i + 1,
      change: randomItem(['up', 'down', 'same']),
      updatedAt: Timestamp.fromDate(new Date()),
    });
  }
  await batch.commit();
  console.log(`  ✅ ${COMPANIES.length} pressure board entries created`);

  console.log('\n🎉 MASSIVE SEED COMPLETE!');
  console.log(`  👤 ${USERS.length} users`);
  console.log(`  🏢 ${COMPANIES.length} companies`);
  console.log(`  📋 ${DEMANDS.length} demands`);
  console.log(`  💬 ${totalComments}+ comments`);
  console.log(`  🏛️ ${CORPORATE_RESPONSES.length} corporate responses`);
  console.log(`  🎤 ${SPOKESPERSON_NOMINATIONS.length} spokesperson nominations`);
  console.log(`  🤝 ${COALITIONS.length} coalitions`);
  console.log(`  📰 8 weekly digests`);
  console.log(`  📊 ${COMPANIES.length} pressure board entries`);
  
  process.exit(0);
}

seed().catch(console.error);
