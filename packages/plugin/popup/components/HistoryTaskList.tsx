import { useRequest } from 'ahooks'
import { sendMessage } from 'webext-bridge/popup'
import { ScrollArea } from '@web-archive/shared/components/scroll-area'
import { ArrowLeft, Check, ClockAlert, Eraser, LoaderCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@web-archive/shared/components/tooltip'
import Browser from 'webextension-polyfill'
import { Button } from '@web-archive/shared/components/button'
import type { PageType } from '../PopupPage'
import type { SeriableSingleFileTask } from '~/background/processor'

function HistoryTaskList({ setActivePage }: { setActivePage: (tab: PageType) => void }) {
  const { data: taskList } = useRequest(
    async () => {
      const { taskList } = await sendMessage('get-page-task-list', {})
      return taskList
    },
    {
      pollingInterval: 1000,
    },
  )

  return (
    <div className="w-64 space-y-1.5 p-4">
      <div className="h-6 mb-2 flex space-x-3 items-center justify-between">
        <ArrowLeft
          className="cursor-pointer"
          size={16}
          onClick={() => { setActivePage('home') }}
        >
        </ArrowLeft>
        <ClearHistoryTaskListButton></ClearHistoryTaskListButton>
      </div>
      <ScrollArea className="max-h-64">
        {taskList && taskList.map(task => (
          <TaskListItem key={task.uuid} task={task}></TaskListItem>
        ))}
      </ScrollArea>
    </div>
  )
}

function ClearHistoryTaskListButton() {
  function handleClick() {
    sendMessage('clear-finished-task-list', {})
  }
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="p-1 h-6"
            onClick={handleClick}
          >
            <Eraser size={14} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={20}>
          Clear finished history task list
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function TaskListItem({ task }: { task: SeriableSingleFileTask }) {
  function openOriginalPage() {
    Browser.tabs.create({
      url: task.href,
    })
  }

  const taskRunningTime = Date.now() - task.startTimeStamp
  const shouldShowRunningTimeText = task.status !== 'done' && task.status !== 'failed'
  const runningTimeText = shouldShowRunningTimeText ? `(${(taskRunningTime / 1000).toFixed(0)}s)` : ''

  return (
    <div className="flex justify-between items-center h-6 w-full space-x-1">
      <div className="font-bold cursor-pointer overflow-hidden text-ellipsis text-nowrap" onClick={openOriginalPage}>{task.title}</div>
      <div>{runningTimeText}</div>
      <div className="flex mt-0.5">
        <TaskStatusIcon status={task.status}></TaskStatusIcon>
      </div>
    </div>
  )
}

function TaskStatusIcon({ status }: { status: 'init' | 'scraping' | 'uploading' | 'done' | 'failed' }) {
  if (status === 'init' || status === 'scraping' || status === 'uploading') {
    return (
      <LoaderCircle
        size={14}
        className="animate-spin"
      />
    )
  }

  if (status === 'done') {
    return (
      <Check
        size={14}
        className="text-success text-emerald-500"
      />
    )
  }

  if (status === 'failed') {
    return (
      <ClockAlert
        size={14}
        className="text-destructive"
      />
    )
  }
  return (
    <div>
      {status}
    </div>
  )
}

export default HistoryTaskList
