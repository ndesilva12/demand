import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notifications - Demand',
  description: 'Stay updated on your demands, co-signs, and corporate responses.',
};

export default function NotificationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
