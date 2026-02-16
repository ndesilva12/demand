import Link from 'next/link';
import { DemandStats } from '@/components/DemandStats';

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

        {/* Real-time Stats */}
        <div className="mt-24">
          <h3 className="text-3xl font-bold text-center mb-8 text-white">Platform Impact</h3>
          <DemandStats />
        </div>

        {/* Rest of the homepage remains the same as previous version */}
        
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

        {/* CTA and Footer remain same as previous version */}
      </div>
    </div>
  );
}