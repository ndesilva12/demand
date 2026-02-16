import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Demand',
  description: 'Privacy policy for the Demand platform.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold mb-2">Privacy Policy</h1>
        <p className="text-[#666666] text-sm mb-8">Last updated: February 16, 2026</p>
        
        <div className="space-y-6 text-[#a0a0a0] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
            <p>We collect information you provide when creating an account (email, display name), demands you create, and co-signatures you make. We also collect standard analytics data including device type, browser, and usage patterns.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. How We Use Your Information</h2>
            <p>Your information is used to operate the platform, display your public contributions (demands, co-signatures), communicate platform updates, and improve our services. We never sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Public Information</h2>
            <p>Demands, co-signatures, and discussion posts are public by design. Your display name is visible on demands you create or co-sign. Email addresses are never publicly displayed.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Data Security</h2>
            <p>We use industry-standard security measures including encryption in transit and at rest. Authentication is handled through Firebase Authentication with secure token management.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Your Rights</h2>
            <p>You can access, update, or delete your account data at any time through your dashboard. You may request a full data export or account deletion by contacting us.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Contact</h2>
            <p>For privacy-related inquiries, reach out to privacy@demandchange.org.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
