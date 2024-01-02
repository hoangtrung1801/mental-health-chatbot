import * as React from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { auth } from '@/auth'
import { clearChats } from '@/app/actions'
import { Button, buttonVariants } from '@/components/ui/button'
import { Sidebar } from '@/components/sidebar'
import { SidebarList } from '@/components/sidebar-list'
import {
  IconGitHub,
  IconLogo,
  IconNextChat,
  IconSeparator,
  IconVercel
} from '@/components/ui/icons'
import { SidebarFooter } from '@/components/sidebar-footer'
import { ThemeToggle } from '@/components/theme-toggle'
import { ClearHistory } from '@/components/clear-history'
import { UserMenu } from '@/components/user-menu'
import { SidebarMobile } from './sidebar-mobile'
import { SidebarToggle } from './sidebar-toggle'
import { ChatHistory } from './chat-history'

async function UserOrLogin() {
  const session = await auth()
  return (
    <>
      {session?.user ? (
        <>
          <SidebarMobile>
            <ChatHistory userId={session.user.id} />
          </SidebarMobile>
          <SidebarToggle />
        </>
      ) : (
        <Link href="/" target="_blank" rel="nofollow">
          <IconNextChat className="w-6 h-6 mr-2 dark:hidden" inverted />
          <IconNextChat className="hidden w-6 h-6 mr-2 dark:block" />
        </Link>
      )}
      <div className="flex items-center">
        <IconSeparator className="w-6 h-6 text-muted-foreground/50" />
        {session?.user ? (
          <UserMenu user={session.user} />
        ) : (
          <Button variant="link" asChild className="-ml-2">
            <Link href="/sign-in?callbackUrl=/">Login</Link>
          </Button>
        )}
      </div>
    </>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 bg-[url('/background.png')] text-white ">
      <a href="/">
        <div className="flex items-center  ">
          {/* <h1 className="font-bold">YouthSound</h1> */}
          <IconLogo className="w-36" />
        </div>
      </a>
      <div className="flex-1 flex items-center justify-center space-x-4">
        <Link
          href="/chat"
          className={cn(
            buttonVariants({ variant: 'default' }),
            'bg-lime-400 text-black hover:text-white'
          )}
        >
          <span>Trò chuyện với AI</span>
        </Link>
        <Link
          href="/chat-volunteer"
          className={cn(
            buttonVariants({ variant: 'default' }),
            'bg-lime-400 text-black hover:text-white'
          )}
        >
          <span>Trò chuyện với tình nguyện viên</span>
        </Link>
      </div>
      <div></div>
    </header>
  )
}
