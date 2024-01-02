import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { helloMessage } from '@/lib/constants'

export default function IndexPage() {
  const id = nanoid()

  return <Chat id={id} initialMessages={[helloMessage]} />
}
