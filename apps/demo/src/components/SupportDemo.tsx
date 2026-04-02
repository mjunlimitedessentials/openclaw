import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

interface Message {
  role: 'customer' | 'agent'
  text: string
  time?: string
}

const scenarios = [
  {
    id: 'order',
    label: '📦 Order Issue',
    message:
      "Hi, I placed order #ORD-8821 three days ago and I haven't received any shipping confirmation. I need this for a birthday party this weekend — can you help?",
  },
  {
    id: 'refund',
    label: '💰 Refund Request',
    message:
      "I want to return the laptop I bought last week (order #ORD-9104). It's overheating constantly and the performance is nothing like advertised. I want a full refund.",
  },
  {
    id: 'billing',
    label: '💳 Billing Problem',
    message:
      "I was charged twice for my subscription this month — $49.99 appeared on my card twice on the same day. This is unacceptable. Please fix this immediately.",
  },
  {
    id: 'account',
    label: '🔑 Account Access',
    message:
      "I can't log into my account. I tried resetting my password but I'm not receiving the reset email. I have a pending order I need to check on.",
  },
]

const metrics = [
  { label: 'Avg. Response Time', value: '1.8s', icon: '⚡', color: 'text-blue-400' },
  { label: 'Resolution Rate', value: '84%', icon: '✅', color: 'text-emerald-400' },
  { label: 'Cost per Ticket', value: '$0.004', icon: '💰', color: 'text-violet-400' },
  { label: 'CSAT Score', value: '4.8/5', icon: '⭐', color: 'text-yellow-400' },
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

export default function SupportDemo() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])
  const [customInput, setCustomInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState<string | null>(null)
  const [ticketCount, setTicketCount] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleQuery = useCallback(async (message: string) => {
    if (isStreaming || !message.trim()) return

    const now = new Date()
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    setMessages((prev) => [
      ...prev,
      { role: 'customer', text: message, time: timeStr },
      { role: 'agent', text: '', time: timeStr },
    ])
    setIsStreaming(true)
    setStartTime(Date.now())
    setElapsed(null)
    setCustomInput('')

    await streamText('/api/support', { message }, (chunk) => {
      setMessages((prev) => {
        const updated = [...prev]
        const last = updated[updated.length - 1]
        if (last?.role === 'agent') {
          updated[updated.length - 1] = { ...last, text: last.text + chunk }
        }
        return updated
      })
    })

    setElapsed(((Date.now() - (startTime ?? Date.now())) / 1000).toFixed(1))
    setIsStreaming(false)
    setTicketCount((c) => c + 1)
  }, [isStreaming, startTime])

  const handleScenario = (msg: string) => handleQuery(msg)
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleQuery(customInput)
  }

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
            <span className="font-semibold text-gray-100">🤖 Customer Support Bot</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-emerald-400">AI Online</span>
            {ticketCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-gray-800 text-gray-400 rounded-full">
                {ticketCount} ticket{ticketCount > 1 ? 's' : ''} handled
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 flex-1 w-full">
        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="p-4 bg-gray-900/60 border border-gray-800 rounded-xl"
            >
              <div className="text-xl mb-1">{m.icon}</div>
              <div className={`text-xl font-bold ${m.color}`}>{m.value}</div>
              <div className="text-xs text-gray-500">{m.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Scenario Picker */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Try a Scenario
            </h3>
            <div className="flex flex-col gap-2">
              {scenarios.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleScenario(s.message)}
                  disabled={isStreaming}
                  className="p-3 text-left bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 rounded-xl text-sm text-gray-300 hover:text-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="mt-4 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
              <p className="text-xs text-blue-400 font-medium mb-1">How it works</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Each query goes to Claude AI with a customer service persona.
                Responses stream in real time — no pre-written scripts.
              </p>
            </div>
          </div>

          {/* Chat Window */}
          <div className="md:col-span-2 flex flex-col">
            <div className="flex-1 bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden">
              {/* Chat header */}
              <div className="px-4 py-3 bg-gray-900 border-b border-gray-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-sm">
                  🤖
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-100">Aria</p>
                  <p className="text-xs text-emerald-400">AI Support Agent · Online</p>
                </div>
                {elapsed && (
                  <div className="ml-auto text-xs text-gray-500">
                    Last response: <span className="text-blue-400">{elapsed}s</span>
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className="h-80 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="text-3xl mb-3">👋</div>
                    <p className="text-gray-400 text-sm">
                      Pick a scenario on the left or type your own question below
                    </p>
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === 'customer' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    >
                      {msg.role === 'agent' && (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5">
                          🤖
                        </div>
                      )}
                      <div
                        className={`max-w-xs md:max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          msg.role === 'customer'
                            ? 'bg-gradient-to-br from-blue-600 to-violet-600 text-white rounded-br-sm'
                            : 'bg-gray-800 text-gray-100 rounded-bl-sm'
                        }`}
                      >
                        {msg.text || (
                          <span className="flex items-center gap-1 text-gray-400">
                            <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                          </span>
                        )}
                        {msg.role === 'agent' && isStreaming && i === messages.length - 1 && msg.text && (
                          <span className="typing-cursor" />
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="border-t border-gray-800 p-3">
                <form onSubmit={handleCustomSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Type a custom customer query..."
                    disabled={isStreaming}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isStreaming || !customInput.trim()}
                    className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Business value callout */}
        <div className="mt-6 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-start gap-3">
          <span className="text-emerald-400 text-lg">💡</span>
          <div>
            <p className="text-sm font-medium text-emerald-400 mb-1">Business Impact</p>
            <p className="text-sm text-gray-400">
              This bot handles 80% of tier-1 support tickets automatically at $0.004/ticket — compared to $8–15 per human-handled ticket.
              For a company processing 10,000 tickets/month, that's{' '}
              <span className="text-emerald-400 font-semibold">$95,000+/month in savings</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
