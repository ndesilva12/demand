/**
 * Static fallback data for when Firestore collections are empty or inaccessible.
 * This makes the platform look alive even before Firestore rules are fully configured.
 */

export const STATIC_COMPANIES = [
  { name: 'Apple', industry: 'Technology', revenue: '$394B', employees: 164000, description: 'Consumer electronics and software giant known for iPhone, Mac, and services ecosystem.', pressureScore: 78, responseRate: 35 },
  { name: 'Google', industry: 'Technology', revenue: '$307B', employees: 182000, description: 'Search, advertising, and cloud computing giant. Parent company Alphabet.', pressureScore: 85, responseRate: 28 },
  { name: 'Amazon', industry: 'E-Commerce / Technology', revenue: '$575B', employees: 1540000, description: 'E-commerce and cloud computing behemoth with massive logistics operations.', pressureScore: 92, responseRate: 22 },
  { name: 'Meta', industry: 'Technology / Social Media', revenue: '$135B', employees: 67000, description: 'Social media conglomerate operating Facebook, Instagram, and WhatsApp.', pressureScore: 88, responseRate: 31 },
  { name: 'Microsoft', industry: 'Technology', revenue: '$245B', employees: 228000, description: 'Enterprise software, cloud computing, and AI powerhouse.', pressureScore: 45, responseRate: 65 },
  { name: 'JPMorgan Chase', industry: 'Financial Services', revenue: '$178B', employees: 309000, description: 'Largest US bank by assets. Consumer and investment banking.', pressureScore: 72, responseRate: 40 },
  { name: 'Bank of America', industry: 'Financial Services', revenue: '$99B', employees: 217000, description: 'Second-largest US bank with extensive consumer banking operations.', pressureScore: 68, responseRate: 25 },
  { name: 'Eli Lilly', industry: 'Pharmaceuticals', revenue: '$41B', employees: 43000, description: 'Major pharmaceutical company and leading insulin manufacturer.', pressureScore: 95, responseRate: 45 },
  { name: 'UnitedHealth Group', industry: 'Healthcare / Insurance', revenue: '$372B', employees: 400000, description: 'Largest US health insurer and healthcare services company.', pressureScore: 90, responseRate: 18 },
  { name: 'McDonald\'s', industry: 'Food / Restaurant', revenue: '$25B', employees: 150000, description: 'World\'s largest fast food chain by revenue.', pressureScore: 65, responseRate: 42 },
  { name: 'DoorDash', industry: 'Technology / Food Delivery', revenue: '$8.6B', employees: 19000, description: 'Leading food delivery platform.', pressureScore: 58, responseRate: 15 },
  { name: 'Kroger', industry: 'Retail / Grocery', revenue: '$150B', employees: 430000, description: 'Largest US supermarket chain by revenue.', pressureScore: 42, responseRate: 20 },
  { name: 'ExxonMobil', industry: 'Energy / Oil & Gas', revenue: '$344B', employees: 62000, description: 'Largest publicly traded oil and gas company.', pressureScore: 88, responseRate: 12 },
  { name: 'Duke Energy', industry: 'Energy / Utilities', revenue: '$29B', employees: 27600, description: 'Major US electric utility holding company.', pressureScore: 55, responseRate: 30 },
  { name: 'Tesla', industry: 'Automotive / Energy', revenue: '$97B', employees: 140000, description: 'Electric vehicle and clean energy company.', pressureScore: 52, responseRate: 35 },
  { name: 'Walmart', industry: 'Retail', revenue: '$648B', employees: 2100000, description: 'World\'s largest company by revenue.', pressureScore: 70, responseRate: 38 },
  { name: 'AT&T', industry: 'Telecommunications', revenue: '$122B', employees: 160000, description: 'Major US telecommunications provider.', pressureScore: 75, responseRate: 22 },
  { name: 'Comcast', industry: 'Telecommunications / Media', revenue: '$121B', employees: 186000, description: 'Largest US cable company and ISP.', pressureScore: 80, responseRate: 18 },
  { name: 'Netflix', industry: 'Entertainment / Streaming', revenue: '$39B', employees: 13000, description: 'Leading streaming entertainment service.', pressureScore: 48, responseRate: 28 },
  { name: 'Ticketmaster', industry: 'Entertainment / Events', revenue: '$23B', employees: 44000, description: 'Dominant ticket sales platform. Subsidiary of Live Nation.', pressureScore: 93, responseRate: 8 },
  { name: 'Navient', industry: 'Financial Services / Education', revenue: '$3.2B', employees: 5400, description: 'Major student loan servicer.', pressureScore: 82, responseRate: 15 },
  { name: 'Shein', industry: 'Retail / Fashion', revenue: '$45B', employees: 16000, description: 'Fast fashion e-commerce giant.', pressureScore: 76, responseRate: 10 },
];

export function getStaticCompany(name: string) {
  return STATIC_COMPANIES.find(c => c.name.toLowerCase() === name.toLowerCase());
}
