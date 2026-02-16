import { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  return {
    title: `Demand #${id} - Demand Platform`,
    description: 'View this demand, co-sign to add your voice, and help force corporate accountability.',
    openGraph: {
      title: `Demand - View and Co-sign`,
      description: 'Join this demand for corporate accountability. Every co-signer increases the pressure.',
      url: `https://demandchange.vercel.app/demands/${id}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Demand - Corporate Accountability',
      description: 'Join this demand and help force real change.',
    },
  };
}

export default function DemandLayout({ children }: { children: React.ReactNode }) {
  return children;
}
