'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import TrendingDemands from '@/components/TrendingDemands';

function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return <div ref={ref}>{count.toLocaleString()}{suffix}</div>;
}

const testimonials = [
  { name: 'Sarah K.', role: 'Consumer Advocate', text: 'We got Ticketmaster to actually respond within 2 weeks. Petitions never did that.', avatar: 'SK' },
  { name: 'Marcus J.', role: 'Community Organizer', text: 'The escalation ladder is genius. Companies can see the pressure building in real-time.', avatar: 'MJ' },
  { name: 'Priya M.', role: 'Environmental Activist', text: 'Finally, a platform where demands have teeth. Clear criteria, real accountability.', avatar: 'PM' },
];

const victories = [
  { company: 'Apple', demand: 'Right to Repair Program', before: 'No self-repair options', after: 'Launched Self Service Repair in 24 countries', signers: '142K' },
  { company: 'Eli Lilly', demand: 'Cap Insulin at $35', before: '$300+ per vial', after: 'Capped at $35 for all patients', signers: '287K' },
  { company: 'Amazon', demand: 'Warehouse Safety Standards', before: '6.8 injuries per 100 workers', after: 'New $300M safety initiative', signers: '198K' },
  { company: 'Microsoft', demand: 'Carbon Negative by 2030', before: 'Vague sustainability promises', after: 'Binding commitment with annual reports', signers: '89K' },
];

export default function Home() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#00aaff]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-[#0066cc]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-28 pb-20 sm:pb-32 relative">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-[#222222] bg-[#1a1a1a]/80 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
              <span className="text-[#a0a0a0] text-xs tracking-wide">Live now — 892,431 people demanding change</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] mb-8">
              Stop Asking.
              <br />
              <span className="gradient-text">Start Demanding.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-[#a0a0a0] leading-relaxed mb-12 max-w-2xl mx-auto">
              Petitions get ignored. Demands get results. Create structured demands with measurable outcomes, 
              build coalitions, and force corporations to change.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/create"
                className="bg-gradient-to-r from-[#00aaff] to-[#0066cc] hover:from-[#0088cc] hover:to-[#0055aa] text-white px-10 py-4 rounded-xl text-lg font-bold transition-all hover:shadow-2xl hover:shadow-[#00aaff]/30 hover:-translate-y-0.5 text-center"
              >
                Start a Demand — It&apos;s Free
              </Link>
              <Link
                href="/demands"
                className="bg-[#1a1a1a] border border-[#222222] text-white px-10 py-4 rounded-xl text-lg font-semibold transition-all hover:border-[#00aaff] hover:text-[#00aaff] hover:-translate-y-0.5 text-center"
              >
                Browse Demands
              </Link>
            </div>

            {/* Live Stats Counter */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-white">
                  <AnimatedCounter end={892431} suffix="+" />
                </div>
                <div className="text-xs sm:text-sm text-[#666666] mt-1 uppercase tracking-wider">Co-signers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-white">
                  <AnimatedCounter end={33} />
                </div>
                <div className="text-xs sm:text-sm text-[#666666] mt-1 uppercase tracking-wider">Active Demands</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#22c55e]">
                  <AnimatedCounter end={4} />
                </div>
                <div className="text-xs sm:text-sm text-[#666666] mt-1 uppercase tracking-wider">Victories Won</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="border-y border-[#1e1e1e] bg-[#111111]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-40">
            {['TechCrunch', 'The Verge', 'Wired', 'Fast Company', 'Bloomberg', 'Reuters'].map(pub => (
              <span key={pub} className="text-sm sm:text-base font-bold tracking-wider text-white uppercase">{pub}</span>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-4">
            How <span className="text-[#00aaff]">Demand</span> Works
          </h2>
          <p className="text-[#a0a0a0] text-lg max-w-xl mx-auto">Three steps from frustration to victory</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-[#00aaff]/50 via-[#00aaff] to-[#22c55e]/50" />
          
          {[
            { step: '01', title: 'Create', desc: 'Write a demand with clear, measurable success criteria targeting a specific corporation.', icon: '🎯', color: '#00aaff' },
            { step: '02', title: 'Rally', desc: 'Build a coalition. Every co-signer increases pressure and triggers new escalation stages.', icon: '✊', color: '#f59e0b' },
            { step: '03', title: 'Win', desc: 'Corporations respond. When success criteria are met, celebrate your victory.', icon: '🏆', color: '#22c55e' },
          ].map((item) => (
            <div key={item.step} className="relative text-center group">
              <div className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-[#1a1a1a] border border-[#222222] flex items-center justify-center text-5xl group-hover:border-[#00aaff]/30 group-hover:scale-105 transition-all duration-300">
                {item.icon}
              </div>
              <div className="text-xs font-mono tracking-widest mb-2" style={{ color: item.color }}>STEP {item.step}</div>
              <h3 className="text-2xl font-bold mb-3 text-white">{item.title}</h3>
              <p className="text-[#a0a0a0] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA 1 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-[#00aaff]/10 to-transparent border border-[#00aaff]/20 rounded-2xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-2">Ready to make your voice heard?</h3>
            <p className="text-[#a0a0a0]">Join thousands already demanding corporate accountability.</p>
          </div>
          <Link href="/create" className="shrink-0 bg-[#00aaff] hover:bg-[#0088cc] text-white px-8 py-4 rounded-xl font-bold transition-all hover:shadow-xl hover:shadow-[#00aaff]/30">
            Create a Demand
          </Link>
        </div>
      </section>

      {/* Featured / Trending Demands */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-2">🔥 Trending Demands</h2>
            <p className="text-[#a0a0a0]">The demands gaining the most momentum right now</p>
          </div>
          <Link href="/demands" className="text-[#00aaff] hover:underline text-sm font-medium hidden sm:block">
            View all →
          </Link>
        </div>
        <TrendingDemands />
        <div className="text-center mt-8 sm:hidden">
          <Link href="/demands" className="text-[#00aaff] hover:underline text-sm font-medium">
            View all demands →
          </Link>
        </div>
      </section>

      {/* Victories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-4">
            🏆 <span className="text-[#22c55e]">Victories</span> That Matter
          </h2>
          <p className="text-[#a0a0a0] text-lg max-w-xl mx-auto">Real change won by real people. Here&apos;s the proof.</p>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {victories.map((v) => (
            <div key={v.demand} className="bg-[#1a1a1a] border border-[#1e1e1e] rounded-2xl p-6 hover:border-[#22c55e]/30 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#22c55e]/10 flex items-center justify-center text-[#22c55e] font-bold text-xs">✓</div>
                <div>
                  <div className="font-bold text-white">{v.demand}</div>
                  <div className="text-xs text-[#666666]">vs {v.company} · {v.signers} co-signers</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#ef4444]/5 border border-[#ef4444]/10 rounded-lg p-3">
                  <div className="text-[10px] uppercase tracking-wider text-[#ef4444] mb-1">Before</div>
                  <div className="text-xs text-[#a0a0a0]">{v.before}</div>
                </div>
                <div className="bg-[#22c55e]/5 border border-[#22c55e]/10 rounded-lg p-3">
                  <div className="text-[10px] uppercase tracking-wider text-[#22c55e] mb-1">After</div>
                  <div className="text-xs text-[#a0a0a0]">{v.after}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link href="/victories" className="text-[#00aaff] hover:underline font-medium">
            See all victories →
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">What People Are Saying</h2>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#1a1a1a] border border-[#222222] rounded-2xl p-8 sm:p-10 text-center relative">
            <div className="text-4xl text-[#00aaff]/20 absolute top-4 left-6">&ldquo;</div>
            <p className="text-lg sm:text-xl text-white leading-relaxed mb-6 relative z-10">
              {testimonials[activeTestimonial].text}
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#00aaff] flex items-center justify-center font-bold text-white text-sm">
                {testimonials[activeTestimonial].avatar}
              </div>
              <div className="text-left">
                <div className="font-semibold text-white text-sm">{testimonials[activeTestimonial].name}</div>
                <div className="text-xs text-[#666666]">{testimonials[activeTestimonial].role}</div>
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === activeTestimonial ? 'bg-[#00aaff] w-6' : 'bg-[#333333]'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-4">Built for <span className="text-[#00aaff]">Impact</span></h2>
          <p className="text-[#a0a0a0] text-lg">Every feature designed to maximize corporate accountability</p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { title: 'Measurable Outcomes', desc: 'Every demand has clear success criteria. Know exactly when you\'ve won.', icon: '📊' },
            { title: 'Escalation Ladder', desc: 'Pressure builds automatically as more people co-sign. Companies see it coming.', icon: '📈' },
            { title: 'Company Intel', desc: 'Deep research on corporate behavior, donations, and controversies.', icon: '🔍' },
            { title: 'Democratic Governance', desc: 'Elect spokespersons. Vote on edits. Community-driven accountability.', icon: '🗳️' },
            { title: 'Coalition Building', desc: 'Unite demands across companies and industries for maximum impact.', icon: '🤝' },
            { title: 'Victory Tracking', desc: 'Celebrate wins. Track which corporations respond and which ignore.', icon: '🏅' },
          ].map((f) => (
            <div key={f.title} className="bg-[#1a1a1a] border border-[#1e1e1e] rounded-xl p-6 hover:border-[#00aaff]/30 transition-all hover:-translate-y-1 group card-hover">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold mb-2 text-white group-hover:text-[#00aaff] transition-colors">{f.title}</h3>
              <p className="text-[#a0a0a0] text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 mb-8">
        <div className="bg-gradient-to-br from-[#00aaff]/10 to-[#0088cc]/5 border border-[#00aaff]/20 rounded-3xl p-12 sm:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00aaff]/5 rounded-full blur-[80px]" />
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 relative z-10">
            Ready to <span className="text-[#00aaff]">Demand</span> Change?
          </h2>
          <p className="text-[#a0a0a0] text-lg mb-10 max-w-lg mx-auto relative z-10">
            Join 892,000+ people who stopped asking nicely and started demanding results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link
              href="/signup"
              className="bg-[#00aaff] hover:bg-[#0088cc] text-white px-10 py-4 rounded-xl text-lg font-bold transition-all hover:shadow-2xl hover:shadow-[#00aaff]/30"
            >
              Create Your Free Account
            </Link>
            <Link
              href="/explore"
              className="border border-[#222222] text-white px-10 py-4 rounded-xl text-lg font-semibold transition-all hover:border-[#00aaff] hover:text-[#00aaff]"
            >
              Explore Demands
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
