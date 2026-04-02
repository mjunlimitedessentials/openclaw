import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

interface Step {
  id: string
  name: string
  icon: string
  description: string
  inputData: string
  status: 'idle' | 'running' | 'done'
  output: string
}

interface Scenario {
  id: string
  label: string
  icon: string
  description: string
  steps: Omit<Step, 'status' | 'output'>[]
}

const scenarios: Scenario[] = [
  {
    id: 'lead',
    label: 'Lead Qualification',
    icon: '🎯',
    description: 'Inbound email → AI scoring → CRM update → Personalized follow-up',
    steps: [
      {
        id: 'ingest',
        name: 'Ingest Lead',
        icon: '📧',
        description: 'Parse inbound inquiry from website form',
        inputData:
          'New contact: David Park, VP Engineering at TechCorp (500 employees). Message: "Looking for an enterprise AI solution to automate our customer support. Budget ~$50k/yr. Need to evaluate Q4."',
      },
      {
        id: 'score',
        name: 'AI Scoring',
        icon: '🧠',
        description: 'Score lead using ICP match, intent signals, and firmographics',
        inputData:
          'Contact: David Park, VP Engineering, TechCorp (500 emp, SaaS, Series B). Budget: $50k, Timeline: Q4, Use case: customer support automation.',
      },
      {
        id: 'crm',
        name: 'CRM Update',
        icon: '📊',
        description: 'Create opportunity and update Salesforce with AI analysis',
        inputData:
          'Score: 87/100 (A-tier). Stage: SQL. Owner: assign to enterprise team. Next action: demo within 48h.',
      },
      {
        id: 'email',
        name: 'Send Follow-Up',
        icon: '✉️',
        description: 'Draft and send personalized outreach email',
        inputData:
          'Recipient: David Park. Context: VP Eng, 500-person SaaS company, budget $50k, needs customer support AI in Q4.',
      },
    ],
  },
  {
    id: 'support',
    label: 'Ticket Triage',
    icon: '🎫',
    description: 'Incoming ticket → AI classification → Auto-route → Draft response',
    steps: [
      {
        id: 'receive',
        name: 'Receive Ticket',
        icon: '📥',
        description: 'Capture support ticket from any channel',
        inputData:
          'Channel: Live chat. Customer: Emma Liu (Enterprise, $120k ARR). Message: "The bulk export feature is broken — it just spins forever. We have a board presentation in 2 hours that depends on this data."',
      },
      {
        id: 'classify',
        name: 'AI Classification',
        icon: '🧠',
        description: 'Classify type, severity, and sentiment',
        inputData:
          'Ticket from Emma Liu. Content: bulk export broken, time-sensitive, board presentation in 2h. Customer tier: Enterprise ($120k ARR).',
      },
      {
        id: 'route',
        name: 'Smart Routing',
        icon: '🔀',
        description: 'Route to correct team with full context',
        inputData:
          'Type: Bug/Critical. Priority: P1 (enterprise + time-sensitive). Sentiment: urgent. Route to: Senior Eng + CSM.',
      },
      {
        id: 'respond',
        name: 'Draft Response',
        icon: '💬',
        description: 'Generate empathetic acknowledgment with ETA',
        inputData:
          'Customer: Emma Liu, Enterprise. Issue: bulk export broken. Urgency: board presentation in 2h. Team: alerted.',
      },
    ],
  },
  {
    id: 'invoice',
    label: 'Invoice Processing',
    icon: '💰',
    description: 'Document upload → AI extraction → Validation → Approval queue',
    steps: [
      {
        id: 'scan',
        name: 'Scan Document',
        icon: '📄',
        description: 'Extract text and structure from uploaded invoice',
        inputData:
          'Uploaded: INV-2024-0892.pdf. Vendor: Apex Cloud Solutions. Amount: $47,740.00. PO: PO-2024-0156.',
      },
      {
        id: 'extract',
        name: 'AI Extraction',
        icon: '🧠',
        description: 'Extract and validate all invoice fields',
        inputData:
          'Invoice #INV-2024-0892. Vendor: Apex Cloud Solutions (Tax ID: 82-4401729). Amount: $47,740.00. Terms: Net 30. PO reference: PO-2024-0156.',
      },
      {
        id: 'validate',
        name: 'PO Matching',
        icon: '✅',
        description: 'Match against purchase orders and flag discrepancies',
        inputData:
          'Invoice: $47,740.00. PO-2024-0156 approved amount: $47,740.00. Line items: ✓ match. Vendor on approved list: ✓.',
      },
      {
        id: 'queue',
        name: 'Approval Queue',
        icon: '📋',
        description: 'Route to approver with context and recommendation',
        inputData:
          'Invoice validated. Amount: $47,740 (>$25k threshold). Route to: CFO for approval. Recommendation: approve — all checks passed.',
      },
    ],
  },
]

async function streamText(
  url: string,
  body: object,
  onChunk: (text: string) => void,
): Promise<void> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.body) return
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      if (line.startsWith('data: ') && line !== 'data: [DONE]') {
        try {
          const data = JSON.parse(line.slice(6)) as { text: string }
          onChunk(data.text)
        } catch {}
      }
    }
  }
}

export default function WorkflowDemo() {
  const navigate = useNavigate()
  const [selectedScenario, setSelectedScenario] = useState(scenarios[0])
  const [steps, setSteps] = useState<Step[]>(
    scenarios[0].steps.map((s) => ({ ...s, status: 'idle' as const, output: '' })),
  )
  const [isRunning, setIsRunning] = useState(false)
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const [totalTime, setTotalTime] = useState<string | null>(null)

  const selectScenario = (scenario: Scenario) => {
    if (isRunning) return
    setSelectedScenario(scenario)
    setSteps(scenario.steps.map((s) => ({ ...s, status: 'idle', output: '' })))
    setActiveStep(null)
    setTotalTime(null)
  }

  const runAutomation = useCallback(async () => {
    if (isRunning) return
    setIsRunning(true)
    setTotalTime(null)
    const start = Date.now()

    const freshSteps = selectedScenario.steps.map((s) => ({
      ...s,
      status: 'idle' as const,
      output: '',
    }))
    setSteps(freshSteps)

    for (let i = 0; i < freshSteps.length; i++) {
      setActiveStep(i)
      setSteps((prev) => {
        const updated = [...prev]
        updated[i] = { ...updated[i], status: 'running', output: '' }
        return updated
      })

      await streamText(
        '/api/workflow',
        {
          scenario: selectedScenario.label,
          stepName: freshSteps[i].name,
          stepDescription: freshSteps[i].description,
          inputData: freshSteps[i].inputData,
        },
        (chunk) => {
          setSteps((prev) => {
            const updated = [...prev]
            updated[i] = { ...updated[i], output: updated[i].output + chunk }
            return updated
          })
        },
      )

      setSteps((prev) => {
        const updated = [...prev]
        updated[i] = { ...updated[i], status: 'done' }
        return updated
      })

      // Small pause between steps for visual effect
      if (i < freshSteps.length - 1) {
        await new Promise((r) => setTimeout(r, 400))
      }
    }

    setTotalTime(((Date.now() - start) / 1000).toFixed(1))
    setActiveStep(null)
    setIsRunning(false)
  }, [isRunning, selectedScenario])

  const allDone = steps.every((s) => s.status === 'done')

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800/60 bg-[#030712]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-gray-100 transition-colors text-sm flex items-center gap-1"
            >
              ← Back
            </button>
            <div className="w-px h-4 bg-gray-700" />
            <span className="font-semibold text-gray-100">⚡ Workflow Automation</span>
          </div>
          {totalTime && (
            <div className="text-sm text-gray-400">
              Completed in{' '}
              <span className="text-emerald-400 font-semibold">{totalTime}s</span>
              {' '}· {steps.length} steps automated
            </div>
          )}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 flex-1 w-full">
        {/* Scenario Picker */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => selectScenario(s)}
              disabled={isRunning}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm border transition-all disabled:opacity-50 ${
                selectedScenario.id === s.id
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                  : 'bg-gray-900 border-gray-700 text-gray-400 hover:text-gray-200'
              }`}
            >
              <span>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Pipeline Header */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-100 mb-1">
            {selectedScenario.icon} {selectedScenario.label}
          </h2>
          <p className="text-sm text-gray-500">{selectedScenario.description}</p>
        </div>

        {/* Pipeline Visualization */}
        <div className="relative mb-8">
          {/* Connector line */}
          <div className="absolute top-8 left-8 right-8 h-px bg-gray-800 hidden md:block" />
          <div
            className="absolute top-8 left-8 h-px bg-gradient-to-r from-emerald-500 to-teal-500 hidden md:block transition-all duration-1000"
            style={{
              right: `${100 - (((steps.filter((s) => s.status === 'done').length) / steps.length) * 100 * (steps.length - 1) / steps.length + (1 / steps.length) * 100)}%`,
            }}
          />

          <div className="grid grid-cols-4 gap-4 relative">
            {steps.map((step, i) => (
              <div key={step.id} className="flex flex-col items-center text-center">
                {/* Node */}
                <div
                  className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-2xl mb-3 transition-all duration-300 relative z-10 ${
                    step.status === 'done'
                      ? 'bg-emerald-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                      : step.status === 'running'
                        ? 'bg-blue-500/10 border-blue-500/50 pipeline-step-active'
                        : activeStep !== null && i < activeStep
                          ? 'bg-emerald-500/10 border-emerald-500/50'
                          : 'bg-gray-900 border-gray-700'
                  }`}
                >
                  {step.status === 'done' ? (
                    <span className="text-emerald-400">✓</span>
                  ) : step.status === 'running' ? (
                    <span className="animate-spin text-sm">⚙️</span>
                  ) : (
                    step.icon
                  )}
                </div>

                {/* Step number */}
                <div className={`text-xs font-medium mb-0.5 ${
                  step.status === 'done' ? 'text-emerald-400' :
                  step.status === 'running' ? 'text-blue-400' :
                  'text-gray-500'
                }`}>
                  Step {i + 1}
                </div>

                {/* Name */}
                <div className="text-sm font-semibold text-gray-100">{step.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{step.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Run Button */}
        <div className="flex items-center justify-center mb-8">
          <button
            onClick={runAutomation}
            disabled={isRunning}
            className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 flex items-center gap-3"
          >
            {isRunning ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Running Automation...
              </>
            ) : allDone ? (
              '🔄 Run Again'
            ) : (
              '▶ Run Automation'
            )}
          </button>
        </div>

        {/* Step Outputs */}
        {steps.some((s) => s.output) && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Live Execution Log
            </h3>
            {steps.map((step, i) => (
              step.output ? (
                <div
                  key={step.id}
                  className={`p-4 rounded-xl border transition-all animate-fade-in ${
                    step.status === 'running'
                      ? 'bg-blue-500/5 border-blue-500/20'
                      : 'bg-gray-900/60 border-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        step.status === 'done'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm font-semibold text-gray-200">
                      {step.icon} {step.name}
                    </span>
                    {step.status === 'done' && (
                      <span className="text-xs text-emerald-400 ml-auto">✓ Complete</span>
                    )}
                  </div>
                  <p className={`text-sm text-gray-300 leading-relaxed ${
                    step.status === 'running' ? 'typing-cursor' : ''
                  }`}>
                    {step.output}
                  </p>
                </div>
              ) : null
            ))}
          </div>
        )}

        {allDone && totalTime && (
          <div className="mt-6 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-emerald-400">🎉</span>
              <span className="text-sm font-semibold text-emerald-400">
                Automation Complete
              </span>
            </div>
            <p className="text-sm text-gray-400">
              All {steps.length} steps completed in <strong className="text-emerald-400">{totalTime}s</strong>.
              The same process manually would take{' '}
              <strong className="text-gray-300">15–45 minutes</strong> and require{' '}
              <strong className="text-gray-300">3–5 people</strong>.
            </p>
          </div>
        )}

        {/* Value prop */}
        <div className="mt-6 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-start gap-3">
          <span className="text-emerald-400 text-lg">💡</span>
          <div>
            <p className="text-sm font-medium text-emerald-400 mb-1">Business Impact</p>
            <p className="text-sm text-gray-400">
              Multi-step workflows that require coordination between teams (sales, support, finance)
              are automated end-to-end. Each pipeline runs in seconds instead of hours,
              with zero human bottlenecks. Companies using AI workflow automation report{' '}
              <span className="text-emerald-400 font-semibold">
                60–90% reduction in operational overhead
              </span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
