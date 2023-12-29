import OpenAI from 'openai'
import { toFile } from 'openai/uploads'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = await toFile(formData.get('file') as File)

  //   const fileBuffer = await (file as File).arrayBuffer()
  //   const readableStream = Readable.from(Buffer.from(fileBuffer))
  //   console.log(readableStream)

  const response = await openai.audio.transcriptions.create({
    // file: createReadStream(URL.createObjectURL(file as File)),
    file,
    model: 'whisper-1',
    language: 'vi'
  })

  return new Response(JSON.stringify({ text: response.text }), { status: 200 })
}
