'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Template {
  id: string;
  title: string;
  category: string;
  description: string;
  template: {
    title: string;
    description: string;
    successCriteria: string;
  };
  examples: string[];
  usageCount: number;
}

const TEMPLATES: Template[] = [
  {
    id: 'living-wage',
    title: 'Living Wage Campaign',
    category: 'Labor Rights',
    description: 'Demand a company pay all employees (including contractors) a living wage',
    template: {
      title: '[COMPANY] Must Pay a Living Wage',
      description: 'We demand that [COMPANY] pay all employees, including contract workers and supply chain workers, a living wage of at least $[AMOUNT]/hour.\n\nCurrently, [COMPANY] pays many workers below poverty wages while [CEO NAME] earns [CEO COMPENSATION]. This is unacceptable.\n\nA living wage allows workers to afford housing, food, healthcare, and basic necessities without government assistance.\n\nSources:\n- [Link to wage data]\n- [Link to CEO compensation]\n- [Link to living wage calculation]',
      successCriteria: '1. Public announcement committing to $[AMOUNT]/hour minimum wage for all employees and contractors\n2. Implementation timeline published (no later than [DATE])\n3. Third-party audit confirming compliance within 90 days of implementation',
    },
    examples: ['Amazon warehouse workers', 'Walmart employees', 'McDonald\'s franchise workers'],
    usageCount: 234,
  },
  {
    id: 'environmental-sustainability',
    title: 'Environmental Sustainability',
    category: 'Climate Action',
    description: 'Push a company to adopt sustainable practices and reduce carbon footprint',
    template: {
      title: '[COMPANY] Must Achieve Carbon Neutrality',
      description: 'We demand that [COMPANY] commit to achieving carbon neutrality by [YEAR].\n\n[COMPANY] is responsible for [X TONS] of CO2 emissions annually, contributing to climate change. As one of the largest companies in [INDUSTRY], they have the resources and responsibility to lead on climate.\n\nWe demand:\n- Detailed carbon reduction plan\n- Investment in renewable energy\n- Supply chain sustainability requirements\n- Annual public reporting on progress\n\nSources:\n- [Link to emissions data]\n- [Link to industry standards]\n- [Link to climate science]',
      successCriteria: '1. Public commitment to carbon neutrality by [YEAR]\n2. Detailed roadmap published within 90 days\n3. Third-party verification of progress annually\n4. Investment of at least [AMOUNT] in renewable energy/offsets',
    },
    examples: ['Amazon shipping emissions', 'Fast fashion carbon footprint', 'Tech company data center energy'],
    usageCount: 189,
  },
  {
    id: 'data-privacy',
    title: 'Data Privacy Protection',
    category: 'Digital Rights',
    description: 'Demand stronger data privacy protections and user control',
    template: {
      title: '[COMPANY] Must Stop Selling User Data',
      description: 'We demand that [COMPANY] immediately stop selling user data to third parties and give users full control over their information.\n\n[COMPANY] collects [TYPES OF DATA] and shares it with [NUMBER] third-party companies without meaningful consent. This violates user privacy and trust.\n\nWe demand:\n- End all data sales to third parties\n- Opt-in (not opt-out) consent for data collection\n- Easy-to-use data deletion tools\n- Transparency reports on data requests\n\nSources:\n- [Link to privacy policy]\n- [Link to third-party sharing evidence]\n- [Link to user complaints]',
      successCriteria: '1. Updated privacy policy ending third-party data sales\n2. Implementation within 60 days\n3. User dashboard showing all collected data and deletion options\n4. Quarterly transparency reports published',
    },
    examples: ['Facebook data sharing', 'Google tracking', 'TikTok data collection'],
    usageCount: 156,
  },
  {
    id: 'supply-chain-ethics',
    title: 'Ethical Supply Chain',
    category: 'Human Rights',
    description: 'End forced labor, child labor, or unsafe conditions in supply chain',
    template: {
      title: '[COMPANY] Must End [UNETHICAL PRACTICE] in Supply Chain',
      description: 'We demand that [COMPANY] immediately end [UNETHICAL PRACTICE] in their supply chain and ensure all suppliers meet ethical labor standards.\n\nInvestigations have revealed that [COMPANY]\'s suppliers in [LOCATION] engage in [SPECIFIC ABUSES]. This is unacceptable and violates [LAWS/STANDARDS].\n\nWe demand:\n- Immediate suspension of contracts with [SUPPLIER NAME] until practices change\n- Third-party audits of all suppliers\n- Public supplier list\n- Worker protection guarantees\n\nSources:\n- [Link to investigation]\n- [Link to evidence]\n- [Link to standards]',
      successCriteria: '1. Public acknowledgment of the issue\n2. Suspension of contracts with violating suppliers\n3. Third-party audit of entire supply chain published within 180 days\n4. Ongoing monitoring program established',
    },
    examples: ['Nike sweatshops', 'Apple supplier conditions', 'Fashion industry labor'],
    usageCount: 142,
  },
  {
    id: 'product-safety',
    title: 'Product Safety Recall',
    category: 'Consumer Safety',
    description: 'Force a recall or safety fix for dangerous products',
    template: {
      title: '[COMPANY] Must Recall Unsafe [PRODUCT]',
      description: 'We demand that [COMPANY] immediately recall [PRODUCT] due to [SAFETY ISSUE] that puts consumers at risk.\n\n[NUMBER] consumers have reported [INJURIES/ISSUES]. [COMPANY] has been aware of this problem since [DATE] but has not taken action.\n\nWe demand:\n- Immediate recall of all affected units\n- Full refunds or safe replacements\n- Public apology\n- Compensation for injured consumers\n\nSources:\n- [Link to safety reports]\n- [Link to consumer complaints]\n- [Link to injury documentation]',
      successCriteria: '1. Public recall announcement within 14 days\n2. Free returns/replacements for all affected consumers\n3. Root cause analysis published\n4. Design changes implemented to prevent future issues',
    },
    examples: ['Tesla safety issues', 'Baby product recalls', 'Food contamination'],
    usageCount: 98,
  },
  {
    id: 'monopoly-abuse',
    title: 'Anti-Competitive Practices',
    category: 'Market Competition',
    description: 'Challenge monopolistic behavior or anti-competitive practices',
    template: {
      title: '[COMPANY] Must Stop Anti-Competitive Practices',
      description: 'We demand that [COMPANY] immediately stop [ANTI-COMPETITIVE PRACTICE] that harms consumers, competitors, and the market.\n\n[COMPANY] uses its market dominance to [SPECIFIC PRACTICE], which:\n- Raises prices for consumers\n- Prevents competition\n- Stifles innovation\n- Violates antitrust principles\n\nWe demand:\n- End [PRACTICE] immediately\n- Level playing field for competitors\n- Consumer choice protection\n- Regulatory compliance\n\nSources:\n- [Link to evidence]\n- [Link to competitor complaints]\n- [Link to antitrust analysis]',
      successCriteria: '1. Public commitment to end the practice\n2. Implementation within 90 days\n3. Third-party monitoring of compliance\n4. Compensation fund for harmed competitors',
    },
    examples: ['Amazon marketplace practices', 'Google search favoritism', 'Apple App Store fees'],
    usageCount: 87,
  },
];

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(TEMPLATES.map(t => t.category)))];

  const filteredTemplates = selectedCategory === 'all' 
    ? TEMPLATES 
    : TEMPLATES.filter(t => t.category === selectedCategory);

  const handleUseTemplate = (template: Template) => {
    // Store template in localStorage and redirect to create page
    localStorage.setItem('demandTemplate', JSON.stringify(template.template));
    router.push('/create');
  };

  return (
    <div className="min-h-screen bg-surface-deep">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-2xl font-bold text-brand">demand</Link>
          <Link href="/demands" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
            Browse Demands
          </Link>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-3">📋 Demand Templates</h1>
          <p className="text-text-secondary max-w-3xl">
            Start with proven demand structures. These templates have been used successfully to create winning campaigns.
            Customize them for your target company and issue.
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-brand text-white'
                  : 'bg-surface-raised border border-border-subtle text-text-secondary hover:border-brand hover:text-brand'
              }`}
            >
              {category === 'all' ? 'All Templates' : category}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="bg-surface-raised border border-border-subtle rounded-xl p-6 hover:border-brand transition-all">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-bold text-text-primary mb-1">{template.title}</h3>
                  <span className="text-xs px-2 py-1 bg-brand/10 text-brand border border-brand/20 rounded-full">
                    {template.category}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-brand font-bold text-sm">{template.usageCount}</div>
                  <div className="text-text-muted text-xs">uses</div>
                </div>
              </div>

              <p className="text-text-secondary text-sm mb-4 leading-relaxed">
                {template.description}
              </p>

              {/* Examples */}
              <div className="mb-4">
                <div className="text-xs text-text-muted uppercase tracking-wider mb-2">Example Uses:</div>
                <div className="flex flex-wrap gap-2">
                  {template.examples.map((example, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-surface-overlay rounded text-text-secondary">
                      {example}
                    </span>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <details className="mb-4">
                <summary className="text-xs text-brand cursor-pointer hover:underline">
                  Preview template →
                </summary>
                <div className="mt-3 p-3 bg-surface-overlay border border-border-subtle rounded text-xs">
                  <div className="font-semibold text-text-primary mb-2">{template.template.title}</div>
                  <div className="text-text-muted line-clamp-4">{template.template.description}</div>
                </div>
              </details>

              {/* Action */}
              <button
                onClick={() => handleUseTemplate(template)}
                className="w-full px-4 py-2 bg-brand hover:bg-brand-dark text-white font-semibold rounded-lg transition-all"
              >
                Use This Template
              </button>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-brand/10 to-brand-dark/10 border border-brand/30 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-3">Don't see your use case?</h2>
          <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
            Create a custom demand from scratch. Every successful demand can become a template for others.
          </p>
          <Link
            href="/create"
            className="inline-block px-8 py-3 bg-brand hover:bg-brand-dark text-white font-semibold rounded-lg transition-all"
          >
            Create Custom Demand
          </Link>
        </div>
      </div>
    </div>
  );
}
