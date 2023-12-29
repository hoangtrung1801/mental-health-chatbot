import { NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  const json = await req.json()
  const { text } = json

  const response = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'alloy',
    input: text
  })
  const audio = await response.blob()
  const audioBuffer = Buffer.from(await audio.arrayBuffer())

  return new Response(audioBuffer, {
    status: 200,
    headers: {
      'Content-Type': audio.type
    }
  })
}
