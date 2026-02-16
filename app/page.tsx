import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <h1 className="text-3xl font-bold text-[#00aaff]">Demand</h1>
          <div className="space-x-4">
            <Link href="/login" className="text-gray-300 hover:text-[#00aaff] transition">
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-[#00aaff] text-white px-6 py-2 rounded-lg hover:bg-[#0088cc] transition shadow-lg shadow-[#00aaff]/20"
            >
              Sign Up
            </Link>
          </div>
        </nav>

        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-6xl font-bold text-white mb-6">
            Give Your Voice <span className="text-[#00aaff]">Power</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Organize demands. Force accountability. Win real change from corporations.
          </p>
          <p className="text-lg text-gray-400 mb-12">
            Not just petitions — structured demands with measurable outcomes and democratic collaboration.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/demands"
              className="bg-[#00aaff] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#0088cc] transition shadow-xl shadow-[#00aaff]/30"
            >
              Browse Demands
            </Link>
            <Link
              href="/create"
              className="bg-gray-800 text-[#00aaff] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-700 transition shadow-xl border-2 border-[#00aaff]"
            >
              Create a Demand
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <div className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700 hover:border-[#00aaff] transition">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-3 text-[#00aaff]">Measurable Success</h3>
            <p className="text-gray-300">
              Every demand has clear criteria. Know exactly when you&apos;ve won.
            </p>
          </div>
          <div className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700 hover:border-[#00aaff] transition">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold mb-3 text-[#00aaff]">Collaborate</h3>
            <p className="text-gray-300">
              Democratic editing. Communities refine demands together.
            </p>
          </div>
          <div className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700 hover:border-[#00aaff] transition">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-3 text-[#00aaff]">Company Intel</h3>
            <p className="text-gray-300">
              Research corporate behavior, politics, and controversies in one place.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-8 mt-24 max-w-4xl mx-auto text-center">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="text-4xl font-bold text-[#00aaff]">0</div>
            <div className="text-gray-400 mt-2">Demands Created</div>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="text-4xl font-bold text-[#00aaff]">0</div>
            <div className="text-gray-400 mt-2">Co-Signatures</div>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="text-4xl font-bold text-[#00aaff]">0</div>
            <div className="text-gray-400 mt-2">Active Users</div>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="text-4xl font-bold text-green-500">0</div>
            <div className="text-gray-400 mt-2">Demands Won</div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-white">How It Works</h3>
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="bg-[#00aaff] text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-lg shadow-[#00aaff]/50">
                1
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2 text-white">Create a Demand</h4>
                <p className="text-gray-300">
                  Target a company, state your demand, define measurable success criteria.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="bg-[#00aaff] text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-lg shadow-[#00aaff]/50">
                2
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2 text-white">Build Support</h4>
                <p className="text-gray-300">
                  Others co-sign your demand. Collaborate in message boards. Refine together.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="bg-[#00aaff] text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-lg shadow-[#00aaff]/50">
                3
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2 text-white">Apply Pressure</h4>
                <p className="text-gray-300">
                  Organized co-signers create leverage. Companies can&apos;t ignore coordinated action.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-lg shadow-green-500/50">
                4
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2 text-white">Win</h4>
                <p className="text-gray-300">
                  When success criteria are met, demand closes as WON. Celebrate the victory.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 text-center bg-gradient-to-r from-[#00aaff] to-[#0088cc] rounded-2xl p-12 max-w-3xl mx-auto shadow-2xl shadow-[#00aaff]/30">
          <h3 className="text-3xl font-bold mb-4 text-white">Ready to Make Real Change?</h3>
          <p className="text-lg mb-8 text-blue-50">
            Join the movement. Create your first demand today.
          </p>
          <Link
            href="/signup"
            className="bg-white text-[#00aaff] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition inline-block shadow-xl"
          >
            Get Started — It&apos;s Free
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-24 text-center text-gray-500 text-sm border-t border-gray-800 pt-12">
          <p>&copy; 2026 Demand. Empowering consumers to create change.</p>
          <div className="mt-4 space-x-6">
            <Link href="/about" className="hover:text-[#00aaff] transition">
              About
            </Link>
            <Link href="/how-it-works" className="hover:text-[#00aaff] transition">
              How It Works
            </Link>
            <Link href="/privacy" className="hover:text-[#00aaff] transition">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#00aaff] transition">
              Terms
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
