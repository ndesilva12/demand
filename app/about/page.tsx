import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - Demand',
  description: 'Learn about Demand, the consumer-powered corporate accountability platform.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold mb-8">About <span className="text-[#00aaff]">Demand</span></h1>
        
        <div className="space-y-6 text-[#a0a0a0] leading-relaxed">
          <p className="text-lg">
            Demand is a consumer-powered corporate accountability platform. We believe that when people organize around clear, 
            measurable demands, corporations have no choice but to listen.
          </p>
          
          <h2 className="text-2xl font-bold text-white pt-4">Why We Exist</h2>
          <p>
            Online petitions have a response rate of less than 1%. They&apos;re easy to ignore because they lack structure, 
            accountability, and escalation. Demand changes that equation.
          </p>
          <p>
            Every demand on our platform has measurable success criteria, an escalation ladder that increases pressure as 
            support grows, and democratic governance through elected spokespersons.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">How It Works</h2>
          <div className="grid gap-4">
            {[
              { step: 'Create', desc: 'Write a demand with specific, measurable success criteria targeting a corporation.' },
              { step: 'Rally', desc: 'Build support through co-signing. Each signature unlocks new escalation stages.' },
              { step: 'Negotiate', desc: 'Elected spokespersons represent co-signers in direct corporate dialogue.' },
              { step: 'Win', desc: 'When success criteria are met, the demand closes as won. Real, measurable change.' },
            ].map(s => (
              <div key={s.step} className="bg-[#1a1a1a] border border-[#1e1e1e] rounded-xl p-4">
                <span className="font-bold text-[#00aaff]">{s.step}:</span> {s.desc}
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-white pt-4">Our Values</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong className="text-white">Transparency</strong> — Every demand, vote, and corporate response is public.</li>
            <li><strong className="text-white">Accountability</strong> — Clear criteria mean no moving goalposts.</li>
            <li><strong className="text-white">Democracy</strong> — Communities govern their own demands.</li>
            <li><strong className="text-white">Impact</strong> — We measure wins, not signatures.</li>
          </ul>

          <div className="pt-8">
            <Link href="/demands" className="bg-[#00aaff] hover:bg-[#0088cc] text-white px-6 py-3 rounded-xl font-semibold transition-all">
              Browse Active Demands →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
