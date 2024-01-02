import { type Message } from 'ai'

import { Separator } from '@/components/ui/separator'
import { ChatVolunteerMessage } from './chat-volunteer-message'

export interface ChatList {
  messages: Message[]
  isLoading: boolean
}

export function ChatVolunteerList({ messages, isLoading }: ChatList) {
  if (!messages.length) {
    return null
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => (
        <div key={index}>
          <ChatVolunteerMessage message={message} />
        </div>
      ))}
      {isLoading && (
        <ChatVolunteerMessage
          message={{
            id: 'ai',
            content: '...',
            role: 'system'
          }}
        />
      )}
    </div>
  )
}
