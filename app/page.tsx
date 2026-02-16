import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <h1 className="text-3xl font-bold text-purple-600">Demand</h1>
          <div className="flex items-center space-x-6">
            <Link href="/demands" className="text-gray-700 hover:text-purple-600">
              Browse
            </Link>
            <Link href="/victories" className="text-gray-700 hover:text-purple-600">
              Victories
            </Link>
            <Link href="/login" className="text-gray-700 hover:text-purple-600">
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Sign Up
            </Link>
          </div>
        </nav>

        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-6xl font-bold text-gray-900 mb-6">
            Give Your Voice <span className="text-purple-600">Power</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Organize demands. Force accountability. Win real change from corporations.
          </p>
          <p className="text-lg text-gray-500 mb-12">
            Not just petitions — structured demands with measurable outcomes and democratic collaboration.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/demands"
              className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition shadow-lg"
            >
              Browse Demands
            </Link>
            <Link
              href="/create"
              className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition shadow-lg border-2 border-purple-600"
            >
              Create a Demand
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-3">Measurable Success</h3>
            <p className="text-gray-600">
              Every demand has clear criteria. Know exactly when you&apos;ve won.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold mb-3">Collaborate</h3>
            <p className="text-gray-600">
              Democratic editing. Communities refine demands together.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-3">Company Intel</h3>
            <p className="text-gray-600">
              Research corporate behavior, politics, and controversies in one place.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-8 mt-24 max-w-4xl mx-auto text-center">
          <div>
            <div className="text-4xl font-bold text-purple-600">0</div>
            <div className="text-gray-600 mt-2">Demands Created</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600">0</div>
            <div className="text-gray-600 mt-2">Co-Signatures</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600">0</div>
            <div className="text-gray-600 mt-2">Active Users</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600">0</div>
            <div className="text-gray-600 mt-2">Demands Won</div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Create a Demand</h4>
                <p className="text-gray-600">
                  Target a company, state your demand, define measurable success criteria.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Build Support</h4>
                <p className="text-gray-600">
                  Others co-sign your demand. Collaborate in message boards. Refine together.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Apply Pressure</h4>
                <p className="text-gray-600">
                  Organized co-signers create leverage. Companies can&apos;t ignore coordinated action.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                4
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Win</h4>
                <p className="text-gray-600">
                  When success criteria are met, demand closes as WON. Celebrate the victory.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 text-center bg-purple-600 text-white rounded-2xl p-12 max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold mb-4">Ready to Make Real Change?</h3>
          <p className="text-lg mb-8 opacity-90">
            Join the movement. Create your first demand today.
          </p>
          <Link
            href="/signup"
            className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition inline-block shadow-lg"
          >
            Get Started — It&apos;s Free
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-24 text-center text-gray-500 text-sm">
          <p>&copy; 2026 Demand. Empowering consumers to create change.</p>
          <div className="mt-4 space-x-6">
            <Link href="/about" className="hover:text-purple-600">
              About
            </Link>
            <Link href="/how-it-works" className="hover:text-purple-600">
              How It Works
            </Link>
            <Link href="/privacy" className="hover:text-purple-600">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-purple-600">
              Terms
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
