import { Button } from '@web-archive/shared/components/button'
import { useRequest } from 'ahooks'
import { House, LogOut, Settings } from 'lucide-react'
import { sendMessage } from 'webext-bridge/popup'
import { ScrollArea } from '@web-archive/shared/components/scroll-area'
import { ThemeToggle } from '~/popup/components/ThemeToggle'
import type { PageType } from '~/popup/PopupPage'

interface PluginHomePageProps {
  setActivePage: (tab: PageType) => void
}

function PluginHomePage({ setActivePage }: PluginHomePageProps) {
  async function logout() {
    await sendMessage('set-token', { token: '' })
    setActivePage('login')
  }

  async function openServerPage() {
    const { serverUrl } = await sendMessage('get-server-url', {})
    window.open(serverUrl, '_blank')
  }

  const { data: taskList } = useRequest(async () => {
    const { taskList } = await sendMessage('get-page-task-list', {})
    return taskList
  })

  return (
    <div className="w-64 space-y-1.5 p-4">
      <div className="mb-4 flex justify-between">
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
        </div>

        <LogOut
          className="cursor-pointer"
          size={16}
          onClick={logout}
        />
      </div>
      <Button
        className="w-full"
        onClick={() => { setActivePage('upload') }}
      >
        Save Page
      </Button>
      <ScrollArea className="h-32">
        {taskList && taskList.map(task => (
          <div key={task.uuid} className="flex justify-between items-center">
            <div>{task.title}</div>
            <div>{task.status}</div>
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}

export default PluginHomePage
