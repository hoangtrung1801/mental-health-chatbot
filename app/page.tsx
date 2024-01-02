import { Button } from '@/components/ui/button'

const HomePage = () => {
  return (
    <div className="min-h-[600px] flex flex-col space-y-4 justify-center items-center">
      <a href="/chat">
        <Button>Chat with AI</Button>
      </a>
      <a href="/chat-volunteer">
        <Button>Chat with volunteer</Button>
      </a>
    </div>
  )
}

export default HomePage
