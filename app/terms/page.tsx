import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Demand',
  description: 'Terms of service for the Demand platform.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold mb-2">Terms of Service</h1>
        <p className="text-[#666666] text-sm mb-8">Last updated: February 16, 2026</p>
        
        <div className="space-y-6 text-[#a0a0a0] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p>By using Demand, you agree to these terms. If you don&apos;t agree, please don&apos;t use the platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. User Conduct</h2>
            <p>You agree to use Demand for lawful purposes only. Demands must target corporate behavior, not individuals. Harassment, threats, or illegal activity will result in account termination.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Content Ownership</h2>
            <p>You retain ownership of demands you create. By posting on Demand, you grant us a non-exclusive license to display your content on the platform and in promotional materials.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Democratic Governance</h2>
            <p>Demands with elected spokespersons operate under democratic governance. Co-signers may vote on edits, spokesperson elections, and demand direction. These votes are binding within the platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Corporate Responses</h2>
            <p>Demand facilitates communication between consumers and corporations but does not guarantee corporate responses. Victory determinations are made based on stated success criteria.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Limitation of Liability</h2>
            <p>Demand is provided &quot;as is&quot; without warranties. We are not liable for actions taken by corporations, users, or third parties in response to platform activity.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Contact</h2>
            <p>For questions about these terms, reach out to legal@demandchange.org.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
