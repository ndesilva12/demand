import Link from 'next/link';
import TrendingDemands from '@/components/TrendingDemands';

export default function Home() {
  return (
    <div className="min-h-screen bg-surface-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <nav className="flex justify-between items-center py-6">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            <span className="text-brand">demand</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/demands" className="text-text-secondary hover:text-text-primary transition-colors text-sm">
              Browse
            </Link>
            <Link href="/login" className="text-text-secondary hover:text-text-primary transition-colors text-sm">
              Log in
            </Link>
            <Link
              href="/signup"
              className="bg-brand hover:bg-brand-dark text-white px-5 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-lg hover:shadow-brand/20"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <div className="pt-24 pb-20 text-center max-w-3xl mx-auto">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-border-default bg-surface-raised text-text-secondary text-xs tracking-wide uppercase">
            Consumer-Powered Corporate Accountability
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-8">
            Give Your Voice{' '}
            <span className="text-brand">Real Power</span>
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary leading-relaxed mb-10 max-w-2xl mx-auto">
            Create structured demands with measurable outcomes. Build coalitions. 
            Force corporations to change. This isn&apos;t a petition — it&apos;s organized pressure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/demands"
              className="bg-brand hover:bg-brand-dark text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:shadow-xl hover:shadow-brand/30 hover:-translate-y-0.5"
            >
              Browse Demands
            </Link>
            <Link
              href="/create"
              className="bg-surface-raised border border-border-default text-text-primary px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:border-brand hover:text-brand hover:-translate-y-0.5"
            >
              Start a Demand
            </Link>
          </div>
        </div>

        {/* Trending Demands */}
        <div className="mb-24">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              🔥 Trending <span className="text-brand">Demands</span>
            </h2>
            <Link href="/demands" className="text-brand hover:underline text-sm font-medium">
              View all →
            </Link>
          </div>
          <TrendingDemands />
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto mb-24">
          <h2 className="text-3xl font-bold text-center mb-16">
            How <span className="text-brand">Demand</span> Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Create', desc: 'Write a demand with clear, measurable success criteria targeting a specific corporation.', icon: '🎯' },
              { step: '02', title: 'Rally', desc: 'Build support. Co-signers amplify the demand and add legitimacy.', icon: '✊' },
              { step: '03', title: 'Negotiate', desc: 'Your elected spokesperson talks directly with the corporation.', icon: '🤝' },
              { step: '04', title: 'Win', desc: 'When success criteria are met, the demand closes as won. Celebrate.', icon: '🏆' },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="text-brand text-xs font-mono tracking-widest mb-2">{item.step}</div>
                <h3 className="text-lg font-bold mb-2 text-text-primary group-hover:text-brand transition-colors">{item.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
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
              <div key={feature.title} className="bg-surface-raised border border-border-subtle rounded-xl p-6 hover:border-brand/30 transition-all hover:-translate-y-1 group">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-base font-bold mb-2 text-text-primary group-hover:text-brand transition-colors">{feature.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-3xl mx-auto mb-24 text-center">
          <div className="bg-gradient-to-br from-brand/10 to-brand-dark/10 border border-brand/20 rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Make Change?</h2>
            <p className="text-text-secondary mb-8 text-lg">
              Join thousands organizing for corporate accountability.
            </p>
            <Link
              href="/signup"
              className="bg-brand hover:bg-brand-dark text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:shadow-xl hover:shadow-brand/30 inline-block"
            >
              Create Your Account
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-border-subtle py-12 text-center">
          <div className="text-text-muted text-sm">
            <span className="text-brand font-semibold">demand</span>
            <span className="mx-2">·</span>
            &copy; 2026
            <span className="mx-2">·</span>
            Empowering consumers to create change.
          </div>
          <div className="mt-4 flex gap-6 justify-center text-xs text-text-muted">
            <Link href="/about" className="hover:text-brand transition-colors">About</Link>
            <Link href="/privacy" className="hover:text-brand transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-brand transition-colors">Terms</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
