import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

import { systemMessage } from '@/lib/constants'

export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  const json = await req.json()
  const { messages, previewToken } = json
  // const userId = (await auth())?.user.id

  // if (!userId) {
  //   return new Response('Unauthorized', {
  //     status: 401
  //   })
  // }

  if (previewToken) {
    openai.apiKey = previewToken
  }

  console.log({ messages })
  const textRes = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [systemMessage, ...messages],
    temperature: 0.7
    // stream: true
  })

  const message = textRes.choices[0].message.content
  if (!message) {
    return new Response('Error', {
      status: 500
    })
  }

  const voiceRes = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'alloy',
    input: message,
    speed: 1.3,
    response_format: 'opus'
  })
  let chunks = []
  for await (const chunk of voiceRes.body as any) {
    chunks.push(chunk)
  }
  return new Response(
    JSON.stringify({
      message,
      audio: Buffer.concat(chunks).toString('base64')
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json'
      }
    }
  )

  // const blob = new Blob(chunks, { type: 'audio/ogg;codecs=opus' })
  // return await new Promise((resolve, reject) => {
  //   const reader = new FileReader()
  //   reader.readAsDataURL(blob)
  //   reader.onloadend = () => {
  //     const base64data = reader.result
  //     console.log({ base64data })
  //     resolve(
  //       new Response(
  //         JSON.stringify({
  //           message,
  //           // audio: Buffer.concat(chunks).toString('base64')
  //           audio: base64data
  //         }),
  //         {
  //           status: 200,
  //           headers: {
  //             'content-type': 'application/json'
  //           }
  //         }
  //       )
  //     )
  //   }
  // })

  // const audio = await voiceRes.blob()
  // const audioBuffer = Buffer.from(await audio.arrayBuffer())

  // const stream = new ReadableStream({
  //   async start(controller) {
  //     // controller.enqueue(Buffer.from(message))

  //     for await (const chunk of voiceRes.body) {
  //       controller.enqueue(chunk)
  //     }

  //     controller.close()
  //   }
  // })

  // return new Response(stream, {
  //   status: 200
  // })

  // const stream = OpenAIStream(textRes, {
  //   // async onCompletion(completion) {
  //   //   const title = json.messages[0].content.substring(0, 100)
  //   //   const id = json.id ?? nanoid()
  //   //   const createdAt = Date.now()
  //   //   const path = `/chat/${id}`
  //   //   const payload = {
  //   //     id,
  //   //     title,
  //   //     userId,
  //   //     createdAt,
  //   //     path,
  //   //     messages: [
  //   //       ...messages,
  //   //       {
  //   //         content: completion,
  //   //         role: 'assistant'
  //   //       }
  //   //     ]
  //   //   }
  //   //   console.log({ payload })
  //   //   await kv.hmset(`chat:${id}`, payload)
  //   //   await kv.zadd(`user:chat:${userId}`, {
  //   //     score: createdAt,
  //   //     member: `chat:${id}`
  //   //   })
  //   // }
  // })
  // console.log({ stream })

  // return new StreamingTextResponse(stream)
}
