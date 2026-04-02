import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

interface DocResult {
  documentType: string
  summary: string
  keyFields: Record<string, string>
  priority: 'low' | 'medium' | 'high' | 'urgent'
  sentiment: 'positive' | 'neutral' | 'negative'
  actions: string[]
  confidence: number
}

const samples = [
  {
    id: 'invoice',
    label: '📄 Invoice',
    docType: 'Invoice',
    content: `INVOICE #INV-2024-0892
Date: November 15, 2024
Due Date: December 15, 2024

FROM: Apex Cloud Solutions LLC
123 Tech Drive, San Francisco, CA 94105
Tax ID: 82-4401729

TO: Meridian Retail Group
Attn: Sarah Chen, Accounts Payable
500 Commerce Way, Chicago, IL 60601

SERVICES RENDERED:
- Enterprise SaaS License (annual) .................. $24,000.00
- Professional Implementation Services (80 hrs) .... $12,000.00
- Priority Support Package (12 months) .............. $4,800.00
- Data Migration & Setup ............................ $3,200.00

SUBTOTAL: $44,000.00
TAX (8.5%): $3,740.00
TOTAL DUE: $47,740.00

Payment Terms: Net 30
Wire Transfer: First National Bank, ABA: 021000021, Acct: 4892001738
Notes: Project kickoff scheduled for Dec 1. Please reference invoice number on payment.`,
  },
  {
    id: 'contract',
    label: '📋 NDA',
    docType: 'Non-Disclosure Agreement',
    content: `MUTUAL NON-DISCLOSURE AGREEMENT

This Agreement is entered into as of October 3, 2024, between:
Vantage AI Technologies Inc. ("Company"), a Delaware corporation, and
NexGen Ventures LLC ("Recipient"), a Texas limited liability company.

PURPOSE: The parties wish to explore a potential business relationship involving proprietary AI technology and investment opportunities (the "Purpose").

CONFIDENTIAL INFORMATION: Includes all technical data, trade secrets, business plans, financial projections, customer lists, and AI model architectures.

OBLIGATIONS: Recipient agrees to: (a) hold all Confidential Information in strict confidence; (b) not disclose to third parties without prior written consent; (c) use information solely for evaluation of the Purpose; (d) notify Company immediately upon discovering any unauthorized disclosure.

TERM: This Agreement shall remain in effect for 3 years from the date of execution.

LIQUIDATED DAMAGES: Breach of this agreement may result in damages of no less than $500,000 USD plus legal fees.

GOVERNING LAW: State of Delaware. Disputes resolved by binding arbitration in San Francisco, CA.

Signed: _________________________ Date: _______
James Whitfield, CEO, Vantage AI Technologies`,
  },
  {
    id: 'ticket',
    label: '🎫 Support Ticket',
    docType: 'Customer Support Ticket',
    content: `SUPPORT TICKET #TKT-58821
Submitted: 2024-11-14 09:23 AM PST
Customer: Marcus Rodriguez (Enterprise — Platinum tier)
Account: #ACC-00712 | Renewal due: Jan 2025 | ARR: $89,000

SUBJECT: Production outage — API returning 503 errors, revenue impacted

DESCRIPTION:
Our production environment has been experiencing intermittent 503 Service Unavailable errors from your API since approximately 2:00 AM PST. This is affecting our e-commerce checkout flow directly.

IMPACT: We estimate $4,200 in lost transactions so far this morning. Our engineering team has been paged and is actively investigating. We've confirmed the issue is on your API side — our monitoring shows a spike in error rates from 0.01% to 34% starting at 02:03 AM.

STEPS TAKEN: Restarted our application servers, rotated API keys, tested with curl — all returning 503. Checked status page — no incidents posted.

PRIORITY: CRITICAL. We need immediate escalation to your infrastructure team.
Contact: Marcus Rodriguez, CTO | +1 415 555 0192 | m.rodriguez@example.com`,
  },
]

const priorityColors: Record<string, string> = {
  low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  urgent: 'bg-red-500/10 text-red-400 border-red-500/20',
}

const sentimentColors: Record<string, string> = {
  positive: 'text-emerald-400',
  neutral: 'text-gray-400',
  negative: 'text-red-400',
}

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

export default function DocumentDemo() {
  const navigate = useNavigate()
  const [selectedSample, setSelectedSample] = useState(samples[0])
  const [customContent, setCustomContent] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [rawStream, setRawStream] = useState('')
  const [result, setResult] = useState<DocResult | null>(null)
  const [elapsed, setElapsed] = useState<string | null>(null)
  const [parseError, setParseError] = useState(false)

  const processDocument = useCallback(async () => {
    if (isProcessing) return
    const content = customContent.trim() || selectedSample.content
    const docType = customContent.trim() ? 'Document' : selectedSample.docType

    setIsProcessing(true)
    setRawStream('')
    setResult(null)
    setParseError(false)
    setElapsed(null)

    const start = Date.now()
    let accumulated = ''

    await streamText('/api/document', { content, docType }, (chunk) => {
      accumulated += chunk
      setRawStream(accumulated)
    })

    setElapsed(((Date.now() - start) / 1000).toFixed(1))

    try {
      const jsonMatch = accumulated.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        setResult(JSON.parse(jsonMatch[0]) as DocResult)
      } else {
        setParseError(true)
      }
    } catch {
      setParseError(true)
    }
    setIsProcessing(false)
  }, [isProcessing, customContent, selectedSample])

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
            <span className="font-semibold text-gray-100">📄 Document Processing</span>
          </div>
          {elapsed && (
            <div className="text-sm text-gray-400">
              Processed in{' '}
              <span className="text-violet-400 font-semibold">{elapsed}s</span>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 flex-1 w-full">
        {/* Sample picker */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm text-gray-400">Sample:</span>
          {samples.map((s) => (
            <button
              key={s.id}
              onClick={() => { setSelectedSample(s); setCustomContent(''); setResult(null); setRawStream('') }}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                selectedSample.id === s.id && !customContent
                  ? 'bg-violet-500/10 border-violet-500/40 text-violet-300'
                  : 'bg-gray-900 border-gray-700 text-gray-400 hover:text-gray-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Input Document
              </h3>
              <span className="text-xs text-gray-600">
                {customContent ? 'Custom' : selectedSample.docType}
              </span>
            </div>
            <textarea
              value={customContent || selectedSample.content}
              onChange={(e) => setCustomContent(e.target.value)}
              rows={16}
              className="w-full bg-gray-900/60 border border-gray-800 rounded-xl p-4 text-sm text-gray-300 font-mono leading-relaxed resize-none focus:outline-none focus:border-gray-600"
              placeholder="Paste any business document here..."
            />
            <button
              onClick={processDocument}
              disabled={isProcessing}
              className="mt-3 w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                '⚡ Analyze Document'
              )}
            </button>
          </div>

          {/* Output */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                AI Extracted Data
              </h3>
              {result && (
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {result.confidence}% confidence
                </span>
              )}
            </div>

            {!result && !isProcessing && !rawStream && (
              <div className="h-full min-h-64 bg-gray-900/40 border border-dashed border-gray-800 rounded-xl flex items-center justify-center text-center p-8">
                <div>
                  <div className="text-3xl mb-3">📊</div>
                  <p className="text-gray-500 text-sm">
                    Click "Analyze Document" to see AI-extracted fields, summary,
                    priority, and recommended actions
                  </p>
                </div>
              </div>
            )}

            {(isProcessing || rawStream) && !result && !parseError && (
              <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
                <p className="text-xs text-violet-400 mb-2 font-medium">
                  AI Processing...
                </p>
                <pre className={`text-xs text-gray-400 font-mono leading-relaxed whitespace-pre-wrap ${isProcessing ? 'typing-cursor' : ''}`}>
                  {rawStream}
                </pre>
              </div>
            )}

            {parseError && (
              <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
                <p className="text-xs text-gray-400 whitespace-pre-wrap">{rawStream}</p>
              </div>
            )}

            {result && (
              <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden animate-fade-in">
                {/* Type + Priority */}
                <div className="px-4 py-3 bg-gray-900 border-b border-gray-800 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-100">
                    {result.documentType}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 text-xs font-medium border rounded-full ${priorityColors[result.priority] ?? priorityColors.medium}`}
                    >
                      {result.priority.toUpperCase()}
                    </span>
                    <span className={`text-xs ${sentimentColors[result.sentiment]}`}>
                      {result.sentiment === 'positive'
                        ? '😊'
                        : result.sentiment === 'negative'
                          ? '😟'
                          : '😐'}{' '}
                      {result.sentiment}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  {/* Summary */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Summary</p>
                    <p className="text-sm text-gray-300 leading-relaxed">{result.summary}</p>
                  </div>

                  {/* Key Fields */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Key Fields</p>
                    <div className="grid gap-1.5">
                      {Object.entries(result.keyFields).map(([key, val]) => (
                        <div key={key} className="flex items-start justify-between gap-4 text-sm">
                          <span className="text-gray-500 flex-shrink-0">{key}</span>
                          <span className="text-gray-200 text-right font-medium">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                      Recommended Actions
                    </p>
                    <div className="space-y-1.5">
                      {result.actions.map((action, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-violet-400 flex-shrink-0">→</span>
                          <span className="text-gray-300">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Value prop */}
        <div className="mt-6 p-4 bg-violet-500/5 border border-violet-500/20 rounded-xl flex items-start gap-3">
          <span className="text-violet-400 text-lg">💡</span>
          <div>
            <p className="text-sm font-medium text-violet-400 mb-1">Business Impact</p>
            <p className="text-sm text-gray-400">
              Manual document processing costs $12–25 per document and takes 15–30 minutes.
              AI processes any document in under 1 second at $0.01. For a business handling
              500 documents/day, that's{' '}
              <span className="text-violet-400 font-semibold">$1.8M+ saved annually</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
