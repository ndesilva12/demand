import Link from 'next/link';
import TrendingDemands from '@/components/TrendingDemands';
import DemandOfTheDay from '@/components/DemandOfTheDay';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="pt-12 sm:pt-24 pb-16 sm:pb-20 text-center max-w-3xl mx-auto animate-fade-in">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#222222] bg-[#1a1a1a] text-[#a0a0a0] text-xs tracking-wide uppercase">
            Consumer-Powered Corporate Accountability
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6 sm:mb-8">
            Give Your Voice{' '}
            <span className="text-[#00aaff]">Real Power</span>
          </h1>
          <p className="text-lg sm:text-xl text-[#a0a0a0] leading-relaxed mb-10 max-w-2xl mx-auto">
            Create structured demands with measurable outcomes. Build coalitions. 
            Force corporations to change. This isn&apos;t a petition — it&apos;s organized pressure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/demands"
              className="bg-[#00aaff] hover:bg-[#0088cc] text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:shadow-xl hover:shadow-[#00aaff]/30 hover:-translate-y-0.5"
            >
              Browse Demands
            </Link>
            <Link
              href="/create"
              className="bg-[#1a1a1a] border border-[#222222] text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:border-[#00aaff] hover:text-[#00aaff] hover:-translate-y-0.5"
            >
              Start a Demand
            </Link>
          </div>
        </div>

        {/* Demand of the Day */}
        <DemandOfTheDay />

        {/* Trending Demands */}
        <div className="mb-24">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              🔥 Trending <span className="text-[#00aaff]">Demands</span>
            </h2>
            <Link href="/demands" className="text-[#00aaff] hover:underline text-sm font-medium">
              View all →
            </Link>
          </div>
          <TrendingDemands />
        </div>

        {/* Victory Showcase */}
        <div className="mb-24">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              🏆 <span className="text-[#00aaff]">Victories</span>
            </h2>
            <Link href="/victories" className="text-[#00aaff] hover:underline text-sm font-medium">
              View all →
            </Link>
          </div>
          <div className="bg-gradient-to-br from-[#00aaff]/5 to-transparent border border-[#00aaff]/20 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">✊</div>
            <h3 className="text-2xl font-bold text-white mb-3">People Power Works</h3>
            <p className="text-[#a0a0a0] max-w-xl mx-auto mb-6">
              When enough people organize around clear demands with measurable outcomes, corporations listen. 
              Check back as our community grows and victories start rolling in.
            </p>
            <Link
              href="/victories"
              className="inline-block bg-[#1a1a1a] border border-[#222222] text-[#00aaff] px-6 py-3 rounded-lg text-sm font-medium hover:border-[#00aaff] transition-all"
            >
              See Victory Showcase →
            </Link>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto mb-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-16">
            How <span className="text-[#00aaff]">Demand</span> Works
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { step: '01', title: 'Create', desc: 'Write a demand with clear, measurable success criteria targeting a specific corporation.', icon: '🎯' },
              { step: '02', title: 'Rally', desc: 'Build support. Co-signers amplify the demand and add legitimacy.', icon: '✊' },
              { step: '03', title: 'Negotiate', desc: 'Your elected spokesperson talks directly with the corporation.', icon: '🤝' },
              { step: '04', title: 'Win', desc: 'When success criteria are met, the demand closes as won. Celebrate.', icon: '🏆' },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="text-[#00aaff] text-xs font-mono tracking-widest mb-2">{item.step}</div>
                <h3 className="text-lg font-bold mb-2 text-white group-hover:text-[#00aaff] transition-colors">{item.title}</h3>
                <p className="text-[#a0a0a0] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="max-w-5xl mx-auto mb-24">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Measurable Outcomes', desc: 'Every demand has clear success criteria. No vague asks — know exactly when you\'ve won.', icon: '📊' },
              { title: 'Democratic Governance', desc: 'Elect spokespersons. Vote on edits. Community-driven demands with real accountability.', icon: '🗳️' },
              { title: 'Company Intelligence', desc: 'Deep research on corporate behavior, political donations, and controversies.', icon: '🔍' },
              { title: 'Spokesperson System', desc: 'Elected representatives negotiate directly with corporations on behalf of co-signers.', icon: '📢' },
              { title: 'Real-Time Collaboration', desc: 'Message boards, edit proposals, and live voting on every demand.', icon: '💬' },
              { title: 'Victory Tracking', desc: 'Celebrate wins. Track which corporations respond and which ignore the people.', icon: '🏅' },
            ].map((feature) => (
              <div key={feature.title} className="bg-[#1a1a1a] border border-[#1e1e1e] rounded-xl p-6 hover:border-[#00aaff]/30 transition-all hover:-translate-y-1 group">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-base font-bold mb-2 text-white group-hover:text-[#00aaff] transition-colors">{feature.title}</h3>
                <p className="text-[#a0a0a0] text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-3xl mx-auto mb-24 text-center">
          <div className="bg-gradient-to-br from-[#00aaff]/10 to-[#0088cc]/10 border border-[#00aaff]/20 rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Make Change?</h2>
            <p className="text-[#a0a0a0] mb-8 text-lg">
              Join thousands organizing for corporate accountability.
            </p>
            <Link
              href="/signup"
              className="bg-[#00aaff] hover:bg-[#0088cc] text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:shadow-xl hover:shadow-[#00aaff]/30 inline-block"
            >
              Create Your Account
            </Link>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="max-w-4xl mx-auto mb-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Active Demands', value: '33+', icon: '📋' },
              { label: 'Co-signers', value: '892K+', icon: '✊' },
              { label: 'Companies Targeted', value: '22', icon: '🏢' },
              { label: 'Victories Won', value: '4', icon: '🏆' },
            ].map(stat => (
              <div key={stat.label} className="bg-[#1a1a1a] border border-[#1e1e1e] rounded-xl p-4 text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold text-[#00aaff]">{stat.value}</div>
                <div className="text-xs text-[#666666] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
