import { NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { Readable } from 'stream'
import { ReadableStream } from 'stream/web'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  const json = await req.json()
  const { text } = json

  const response = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'alloy',
    input: text,
    speed: 1.3,
    response_format: 'opus'
  })

  if (!response.body) {
    return new Response('Error', {
      status: 500
    })
  }

  // const reader = response.body.getReader()

  // const stream = new ReadableStream({
  //   async start(controller) {
  //     // function push() {
  //     //   // "done" is a Boolean and value a "Uint8Array"
  //     //   reader.read().then(({ done, value }) => {
  //     //     // If there is no more data to read
  //     //     if (done) {
  //     //       console.log('done', done)
  //     //       controller.close()
  //     //       return
  //     //     }
  //     //     // Get the data and send it to the browser via the controller
  //     //     controller.enqueue(value)
  //     //     // Check chunks by logging to the console
  //     //     console.log(done, value)
  //     //     push()
  //     //   })
  //     // }

  //     // push()
  //     for await (const chunk of response.body) {
  //       controller.enqueue(chunk)
  //     }
  //     controller.close()
  //   }
  // })
  // return new Response(stream, {
  //   status: 200,
  //   headers: {
  //     'Content-Type': 'audio/opus'
  //   }
  // })

  // return new Response(response.body)

  // return response
  // return new Response(response.body)

  const audio = await response.blob()
  const audioBuffer = Buffer.from(await audio.arrayBuffer())

  return new Response(audioBuffer, {
    status: 200,
    headers: {
      'Content-Type': audio.type
    }
  })
}
