import { Button } from '@web-archive/shared/components/button'
import { History, House, LogOut, Settings } from 'lucide-react'
import { sendMessage } from 'webext-bridge/popup'
import { ThemeToggle } from '~/popup/components/ThemeToggle'
import type { PageType } from '~/popup/PopupPage'

interface PluginHomePageProps {
  setActivePage: (tab: PageType) => void
}

function PluginHomePage({ setActivePage }: PluginHomePageProps) {
  async function logout() {
    await sendMessage('logout', {})
    setActivePage('login')
  }

  async function openServerPage() {
    const { serverUrl } = await sendMessage('get-server-url', {})
    window.open(serverUrl, '_blank')
  }

  return (
    <div className="w-64 space-y-1.5 p-4">
      <div className="h-6 mb-2 items-center flex justify-between">
        <div className="flex space-x-3">
          <House
            className="cursor-pointer"
            size={16}
            onClick={openServerPage}
          >
          </House>
          <ThemeToggle></ThemeToggle>
          <Settings
            className="cursor-pointer"
            size={16}
            onClick={() => { setActivePage('setting') }}
          >
          </Settings>
          <History
            className="cursor-pointer"
            size={16}
            onClick={() => { setActivePage('history') }}
          />
        </div>

        <LogOut
          className="cursor-pointer"
          size={16}
          onClick={logout}
        />
      </div>
      <Button
        className="w-full select-none"
        onClick={() => { setActivePage('upload') }}
      >
        Save Page
      </Button>
    </div>
  )
}

export default PluginHomePage
