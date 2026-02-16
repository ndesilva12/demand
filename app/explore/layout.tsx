import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Demands - Demand',
  description: 'Discover trending demands, browse by category, and find causes near you.',
  openGraph: {
    title: 'Explore Demands - Demand',
    description: 'Discover trending demands, browse by category, and find causes near you.',
  },
};

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return children;
}
