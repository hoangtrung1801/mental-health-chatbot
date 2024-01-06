'use client'

import { type Message } from 'ai/react'

import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor'
import { helloMessage } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'
export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  // const router = useRouter()
  // const path = usePathname()
  // const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
  //   'ai-token',
  //   null
  // )

  const [input, setInput] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([helloMessage])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const send = async (messages: Message[]) => {
    setIsLoading(true)
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: messages.map(({ id, ...rest }) => ({ ...rest }))
      })
    })
    const data = await response.json()
    console.log({ data })

    const { message, audio } = data
    setMessages(prev => [
      ...prev,
      { id: 'ai', content: message, role: 'system' }
    ])

    // convert audio string which is base64 to blob
    const blob = new Blob([Buffer.from(audio, 'base64')], {
      // type: 'audio/ogg;codecs=opus'
      type: 'audio/mp3'
    })
    const audioEl = new Audio(URL.createObjectURL(blob))
    audioEl.play()
    setIsLoading(false)
  }

  const append = async (message: Message) => {
    const newMessages = [...messages, message]
    setMessages(newMessages)
    // setMessages([
    //   ...newMessages,
    //   {
    //     id: 'system',
    //     role: 'system',
    //     content: ''
    //   }
    // ])
    await send(newMessages)
  }

  return (
    <>
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
        {messages.length && (
          <>
            <ChatList messages={messages} isLoading={isLoading} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        )}
      </div>
      <ChatPanel
        id={id}
        isLoading={isLoading}
        // stop={stop}
        append={append}
        // reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
      />

      {/* <Dialog open={previewTokenDialog} onOpenChange={setPreviewTokenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your OpenAI Key</DialogTitle>
            <DialogDescription>
              If you have not obtained your OpenAI API key, you can do so by{' '}
              <a
                href="https://platform.openai.com/signup/"
                className="underline"
              >
                signing up
              </a>{' '}
              on the OpenAI website. This is only necessary for preview
              environments so that the open source community can test the app.
              The token will be saved to your browser&apos;s local storage under
              the name <code className="font-mono">ai-token</code>.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={previewTokenInput}
            placeholder="OpenAI API key"
            onChange={e => setPreviewTokenInput(e.target.value)}
          />
          <DialogFooter className="items-center">
            <Button
              onClick={() => {
                setPreviewToken(previewTokenInput)
                setPreviewTokenDialog(false)
              }}
            >
              Save Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </>
  )
}
