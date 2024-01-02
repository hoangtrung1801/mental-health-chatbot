'use client'

import { Chat } from '@/components/chat'
import { ChatVolunteer } from '@/components/chat-volunteer'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { MENTAL_CATEGORIES, helloMessage } from '@/lib/constants'
import { InfoIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

// steps:
// 1. fill in form
// 2. loading to connect to volunteer
// 3. chat with volunteer

const volunteers = [
  {
    name: 'Lê Văn A',
    age: 18,
    mentalCategories: ['family-1', 'friend-2']
  },
  {
    name: 'Lê Văn B',
    age: 19,
    mentalCategories: ['family-2']
  },
  {
    name: 'Lê Văn C',
    age: 20,
    mentalCategories: ['friend-1']
  },
  {
    name: 'Lê Văn D',
    age: 21,
    mentalCategories: ['study-1', 'study-2']
  },
  {
    name: 'Lê Văn E',
    age: 22,
    mentalCategories: ['friend-3', 'family-3']
  }
]

const findVolunteer = (name: string, age: number, mentalCategory: string) => {
  const queue = volunteers.slice()
  queue.sort((a, b) => {
    if (a.mentalCategories.includes(mentalCategory)) {
      return -1
    } else if (b.mentalCategories.includes(mentalCategory)) {
      return 1
    } else {
      const absDiffA = Math.abs(a.age - age)
      const absDiffB = Math.abs(b.age - age)

      // sort with age
      if (absDiffA < absDiffB) {
        return -1
      } else if (absDiffA > absDiffB) {
        return 1
      }

      return 0
    }
  })
  return queue[0]
}

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-[600px] max-w-5xl w-full mx-auto flex justify-center">
    <div className=" flex flex-col items-center space-y-8 flex-1">
      <div className="flex flex-col items-center w-full max-w-3xl mt-8">
        <h1 className="text-3xl font-bold">Trò chuyện với tình nguyện viên</h1>
        <p className="text-primary/60 mb-8">
          Chúng tôi ở đây để giúp bạn kết nối với các tình nguyện viên
        </p>
        {children}
      </div>
    </div>
  </div>
)

const ChatVolunteerPage = () => {
  const [step, setStep] = useState<number>(1)
  const [name, setName] = useState<string>('')
  const [age, setAge] = useState<number>(0)
  const [mentalCategory, setMentalCategory] = useState<string>('')
  const [volunteer, setVolunteer] = useState<any>(undefined)

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    setStep(2)
  }

  const confirmMatching = () => {
    setStep(4)
  }

  useEffect(() => {
    let timer: any
    if (step === 2) {
      const suitableVolunteer = findVolunteer(name, age, mentalCategory)
      setVolunteer(suitableVolunteer)

      timer = setTimeout(() => {
        setStep(3)
      }, 1000)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [age, mentalCategory, name, setVolunteer, step])

  useEffect(() => {
    console.log({ volunteer })
  }, [volunteer])

  if (step === 1) {
    return (
      <Wrapper>
        <form
          className="w-full"
          onSubmit={e => {
            e.preventDefault()
            submitForm(e)
          }}
        >
          <div className="w-full flex flex-col space-y-4 ">
            <div className="flex flex-row space-x-4">
              <label htmlFor="name" className="basis-[40%]">
                Họ và tên
              </label>
              {/* <input
                type="text"
                id="name"
                className="flex h-9 items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm shadow ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              /> */}
              <Input
                type="text"
                id="name"
                className="bg-white"
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="flex flex-row space-x-4">
              <label htmlFor="name" className="basis-[40%]">
                Tuổi
              </label>
              <Input
                type="number"
                id="age"
                className="bg-white"
                onChange={e => setAge(Number(e.target.value))}
              />
            </div>

            <div className="flex flex-row space-x-4">
              <label htmlFor="name" className="basis-[40%]">
                Vấn đề tâm lý đang gặp
              </label>
              <Select
                onValueChange={value => {
                  setMentalCategory(value)
                }}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Chọn vấn đề" />
                </SelectTrigger>
                <SelectContent>
                  {MENTAL_CATEGORIES.map(({ label, id, children }) => {
                    if (!children)
                      return (
                        <SelectItem key={id} value={id}>
                          {label}
                        </SelectItem>
                      )

                    return [
                      <SelectItem key={id} value={id} primary>
                        {label}
                      </SelectItem>,
                      ...children.map(({ label, id }) => (
                        <SelectItem key={id} value={id}>
                          {label}
                        </SelectItem>
                      ))
                    ]
                  }).flat()}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end">
              <Button className="">Kết nối</Button>
            </div>
          </div>
        </form>
      </Wrapper>
    )
  } else if (step === 2) {
    return (
      <Wrapper>
        <div className="flex-1 flex flex-col justify-center">
          <div className="py-2 px-4 border-primary border-2">
            <p className="text-primary">
              Chúng tôi đang tìm kiếm tình nguyện viên phù hợp với bạn ...
            </p>
          </div>
        </div>
      </Wrapper>
    )
  } else if (step === 3) {
    if (!volunteer) return null
    return (
      <Wrapper>
        <div className="flex flex-col space-y-2">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>
              Chúc mừng bạn đã được ghép cặp với tình nguyện viên
            </AlertTitle>
          </Alert>
          <Card className="w-[500px]">
            <CardHeader>
              <CardTitle>Thông tin tình nguyện viên</CardTitle>
              {/* <CardDescription>Card Description</CardDescription> */}
            </CardHeader>
            <CardContent>
              <p>Họ và tên: {volunteer && volunteer?.name}</p>
              <p>Tuổi: {volunteer && volunteer?.age}</p>
              <p>
                Lĩnh vực tư vấn:{' '}
                <span>
                  {(volunteer as any).mentalCategories
                    .map((category: string) => {
                      return MENTAL_CATEGORIES.flatMap(x => x.children).find(
                        ({ id }) => id === category
                      )?.label
                    })
                    .join(', ')}
                </span>
              </p>
            </CardContent>
          </Card>
          <div className="flex flex-row space-x-2">
            <Button onClick={confirmMatching}>Trò chuyện</Button>
            <Button variant="secondary" onClick={() => setStep(1)}>
              Ghép cặp lại
            </Button>
          </div>
        </div>
      </Wrapper>
    )
  } else if (step === 4) {
    return (
      <ChatVolunteer
        id={'chat-with-volunteer'}
        initialMessages={[helloMessage]}
      />
    )
  }
}

export default ChatVolunteerPage
