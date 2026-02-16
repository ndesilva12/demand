'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const slides = [
  {
    icon: '🎯',
    title: 'Create Demands',
    desc: 'Write structured demands with clear success criteria targeting specific corporations. No vague asks — just actionable change.',
  },
  {
    icon: '✊',
    title: 'Rally Support',
    desc: 'Build coalitions by co-signing demands. Each signature increases pressure and unlocks new escalation stages.',
  },
  {
    icon: '🏆',
    title: 'Win Change',
    desc: 'When corporations meet your success criteria, celebrate your victory. Track real impact, not empty promises.',
  },
];

export default function WelcomeModal() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem('demand-welcome-seen');
    if (!seen) {
      setTimeout(() => setShow(true), 1500);
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem('demand-welcome-seen', 'true');
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={dismiss} />
      <div className="relative bg-[#1a1a1a] border border-[#222222] rounded-2xl max-w-md w-full p-8 animate-fade-in">
        <button onClick={dismiss} className="absolute top-4 right-4 text-[#666666] hover:text-white text-xl">×</button>
        
        <div className="text-center">
          <div className="text-6xl mb-6">{slides[step].icon}</div>
          <h2 className="text-2xl font-bold text-white mb-3">{slides[step].title}</h2>
          <p className="text-[#a0a0a0] leading-relaxed mb-8">{slides[step].desc}</p>
          
          {/* Dots */}
          <div className="flex justify-center gap-2 mb-8">
            {slides.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-[#00aaff]' : 'w-1.5 bg-[#333333]'}`} />
            ))}
          </div>
          
          <div className="flex gap-3">
            {step < slides.length - 1 ? (
              <>
                <button onClick={dismiss} className="flex-1 py-3 rounded-xl text-sm font-medium text-[#666666] hover:text-white transition-colors">
                  Skip
                </button>
                <button onClick={() => setStep(step + 1)} className="flex-1 bg-[#00aaff] hover:bg-[#0088cc] text-white py-3 rounded-xl text-sm font-bold transition-all">
                  Next
                </button>
              </>
            ) : (
              <Link href="/demands" onClick={dismiss} className="flex-1 bg-[#00aaff] hover:bg-[#0088cc] text-white py-3 rounded-xl text-sm font-bold transition-all text-center">
                Start Exploring
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
