import { useNavigate } from 'react-router-dom'

const demos = [
  {
    id: 'support',
    icon: '🤖',
    title: 'Customer Support Bot',
    description:
      'Watch AI handle real customer queries instantly — billing issues, order problems, account questions — with empathy and precision.',
    stats: [
      { value: '80%', label: 'Query Automation' },
      { value: '<2s', label: 'Response Time' },
      { value: '24/7', label: 'Availability' },
    ],
    color: 'from-blue-500 to-cyan-500',
    bg: 'from-blue-500/10 to-cyan-500/5',
    border: 'border-blue-500/20',
    path: '/support',
  },
  {
    id: 'document',
    icon: '📄',
    title: 'Document Processing',
    description:
      'Drop in any business document — invoices, contracts, support tickets — and get structured data, summaries, and action items instantly.',
    stats: [
      { value: '99%', label: 'Accuracy' },
      { value: '0.8s', label: 'Processing' },
      { value: '100%', label: 'Automated' },
    ],
    color: 'from-violet-500 to-purple-500',
    bg: 'from-violet-500/10 to-purple-500/5',
    border: 'border-violet-500/20',
    path: '/document',
  },
  {
    id: 'workflow',
    icon: '⚡',
    title: 'Workflow Automation',
    description:
      'See multi-step AI pipelines execute in real time — from lead qualification to invoice processing — with live AI narration at each step.',
    stats: [
      { value: '10×', label: 'Faster Processing' },
      { value: '90%', label: 'Cost Reduction' },
      { value: '0', label: 'Manual Steps' },
    ],
    color: 'from-emerald-500 to-teal-500',
    bg: 'from-emerald-500/10 to-teal-500/5',
    border: 'border-emerald-500/20',
    path: '/workflow',
  },
]

const overallStats = [
  { value: '80%+', label: 'Tasks Automated', icon: '⚡' },
  { value: '$2.4M', label: 'Avg. Annual Savings', icon: '💰' },
  { value: '3 weeks', label: 'Avg. Time to Deploy', icon: '🚀' },
  { value: '99.9%', label: 'Uptime SLA', icon: '🛡️' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-800/60 bg-[#030712]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-sm">
              🤖
            </div>
            <span className="font-bold text-gray-100 tracking-tight">
              AI Automation
            </span>
            <span className="px-2 py-0.5 text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
              DEMO
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {demos.map((d) => (
              <button
                key={d.id}
                onClick={() => navigate(d.path)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-gray-100 hover:bg-gray-800/60 rounded-lg transition-all"
              >
                {d.title}
              </button>
            ))}
          </nav>
          <button
            onClick={() => navigate('/support')}
            className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 rounded-lg transition-all shadow-lg shadow-blue-500/20"
          >
            Try Live Demo →
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm text-blue-400 mb-8">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          Powered by Claude AI · Live Demo
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
          <span className="text-gray-100">AI Automation</span>
          <br />
          <span className="gradient-text">That Actually Works</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          See how intelligent automation handles your real business workflows —
          support, documents, pipelines — with genuine AI, not scripts.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={() => navigate('/support')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
          >
            Start Interactive Demo
          </button>
          <button
            onClick={() =>
              document
                .getElementById('demos')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl font-semibold transition-all border border-gray-700"
          >
            See All Demos ↓
          </button>
        </div>

        {/* Trust stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {overallStats.map((s) => (
            <div
              key={s.label}
              className="p-4 bg-gray-900/60 border border-gray-800 rounded-xl text-center"
            >
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold text-gray-100">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Demo Cards */}
      <section id="demos" className="max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-100 mb-3">
            Three Live Demos
          </h2>
          <p className="text-gray-400">
            Each demo uses real AI — click through and see genuine responses
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {demos.map((demo, i) => (
            <div
              key={demo.id}
              onClick={() => navigate(demo.path)}
              className={`relative p-6 bg-gradient-to-b ${demo.bg} border ${demo.border} rounded-2xl cursor-pointer transition-all duration-300 card-glow card-glow-hover group`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Icon */}
              <div className="text-4xl mb-4">{demo.icon}</div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-100 mb-2">
                {demo.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                {demo.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {demo.stats.map((s) => (
                  <div key={s.label} className="text-center">
                    <div
                      className={`text-lg font-bold bg-gradient-to-r ${demo.color} bg-clip-text text-transparent`}
                    >
                      {s.value}
                    </div>
                    <div className="text-xs text-gray-500">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                className={`w-full py-2.5 bg-gradient-to-r ${demo.color} rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg`}
              >
                Try Live Demo →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-600">
          Built with Claude AI · This is a live demo using real AI responses
        </div>
      </footer>
    </div>
  )
}
