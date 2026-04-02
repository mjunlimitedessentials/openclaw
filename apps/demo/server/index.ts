import express from 'express'
import Anthropic from '@anthropic-ai/sdk'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const client = new Anthropic()

app.use(cors())
app.use(express.json())

function sendStream(
  res: express.Response,
  stream: AsyncIterable<Anthropic.MessageStreamEvent>,
) {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  return stream
}

// ── Customer Support Bot ────────────────────────────────────────────────────
app.post('/api/support', async (req, res) => {
  const { message } = req.body as { message: string }

  const stream = client.messages.stream({
    model: 'claude-opus-4-6',
    max_tokens: 512,
    system: `You are an empathetic, professional AI customer support agent for an e-commerce company.
Your name is Aria. Respond concisely (3-5 sentences). Always:
- Acknowledge the customer's frustration when relevant
- Provide a clear, specific resolution or next step
- Offer one follow-up action
Keep the tone warm and confident. Never say you cannot help.`,
    messages: [{ role: 'user', content: message }],
  })

  sendStream(res, stream)

  for await (const event of stream) {
    if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
    }
  }

  res.write('data: [DONE]\n\n')
  res.end()
})

// ── Document Processing ─────────────────────────────────────────────────────
app.post('/api/document', async (req, res) => {
  const { content, docType } = req.body as {
    content: string
    docType: string
  }

  const stream = client.messages.stream({
    model: 'claude-opus-4-6',
    max_tokens: 1024,
    system: `You are a document intelligence engine. Analyze business documents and return ONLY valid JSON.
No markdown, no code blocks, no explanation — just raw JSON.
Schema:
{
  "documentType": string,
  "summary": string (1-2 sentences),
  "keyFields": { [label: string]: string } (4-6 most important fields),
  "priority": "low" | "medium" | "high" | "urgent",
  "sentiment": "positive" | "neutral" | "negative",
  "actions": string[] (2-3 recommended next steps),
  "confidence": number (0-100)
}`,
    messages: [
      {
        role: 'user',
        content: `Document type: ${docType}\n\n---\n${content}`,
      },
    ],
  })

  sendStream(res, stream)

  for await (const event of stream) {
    if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
    }
  }

  res.write('data: [DONE]\n\n')
  res.end()
})

// ── Workflow Step Analysis ──────────────────────────────────────────────────
app.post('/api/workflow', async (req, res) => {
  const { scenario, stepName, stepDescription, inputData } = req.body as {
    scenario: string
    stepName: string
    stepDescription: string
    inputData: string
  }

  const stream = client.messages.stream({
    model: 'claude-opus-4-6',
    max_tokens: 256,
    system: `You are an AI automation engine narrating a live business workflow.
Describe what you are doing at this step in 2-3 sentences.
Be specific: use realistic names, numbers, and business details.
Speak in present tense as if the automation is running right now.`,
    messages: [
      {
        role: 'user',
        content: `Scenario: ${scenario}
Step: ${stepName} — ${stepDescription}
Input: ${inputData}

Narrate this automation step as if it's executing right now.`,
      },
    ],
  })

  sendStream(res, stream)

  for await (const event of stream) {
    if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
    }
  }

  res.write('data: [DONE]\n\n')
  res.end()
})

// ── Static files (production) ───────────────────────────────────────────────
const distPath = path.join(__dirname, '..', 'dist')
app.use(express.static(distPath))
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

const PORT = process.env.PORT ?? 3001
app.listen(PORT, () => {
  const hasKey = !!process.env.ANTHROPIC_API_KEY
  console.log(`\n🚀 AI Automation Demo`)
  console.log(`   Server: http://localhost:${PORT}`)
  console.log(`   API Key: ${hasKey ? '✓ Found' : '✗ Missing — set ANTHROPIC_API_KEY'}`)
  if (!hasKey) {
    console.log(`\n   Run: export ANTHROPIC_API_KEY=your_key_here\n`)
  }
})
