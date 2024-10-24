import { sendMessage } from 'webext-bridge/background'
import Browser from 'webextension-polyfill'
import { request } from './background'
import type { SingleFileSetting } from '~/utils/singleFile'

export interface SeriableSingleFileTask {
  uuid: string
  status: 'init' | 'scraping' | 'uploading' | 'done' | 'failed'
  progress: number
  href: string
  tabId: number
  title: string
  pageDesc: string
  folderId: string
}

const taskList: SeriableSingleFileTask[] = []

let isInit = false
async function initTask() {
  if (isInit) {
    return
  }

  const { tasks } = await Browser.storage.local.get('tasks')
  if (tasks) {
    taskList.push(...tasks)
  }
  isInit = true
}

async function getTaskList() {
  await initTask()
  return taskList
}

async function saveTaskList() {
  await Browser.storage.local.set({ tasks: taskList })
}

type CreateTaskOptions = {
  tabId: number
  pageForm: {
    href: string
    title: string
    pageDesc: string
    folderId: string
    screenshot?: string
  }
  singleFileSetting: SingleFileSetting
}

async function scrapePageData(singleFileSetting: SingleFileSetting, tabId: number) {
  await Browser.scripting.executeScript({
    target: { tabId },
    files: ['/lib/single-file.js', '/lib/single-file-extension-core.js'],
  })
  const { content } = await sendMessage('scrape-page-data', singleFileSetting, `content-script@${tabId}`)
  return content
}

async function uploadPageData(pageForm: CreateTaskOptions['pageForm'] & { content: string }) {
  const { href, title, pageDesc, folderId, screenshot, content } = pageForm

  const form = new FormData()
  form.append('title', title)
  form.append('pageUrl', href)
  form.append('pageDesc', pageDesc)
  form.append('folderId', folderId)
  form.append('pageFile', new Blob([content], { type: 'text/html' }))
  if (screenshot) {
    form.append('screenshot', screenshot)
  }
  await request('/pages/upload_new_page', {
    method: 'POST',
    body: form,
  })
}

async function createAndRunTask(options: CreateTaskOptions) {
  const { singleFileSetting, tabId, pageForm } = options
  const { href, title, pageDesc, folderId, screenshot } = pageForm

  const uuid = crypto.randomUUID()
  const task: SeriableSingleFileTask = {
    uuid,
    status: 'init',
    progress: 0,
    tabId,
    href,
    title,
    pageDesc,
    folderId,
  }

  // todo wait refactor, add progress
  async function run() {
    task.status = 'scraping'
    await saveTaskList()
    const content = await scrapePageData(singleFileSetting, tabId)

    task.status = 'uploading'
    await saveTaskList()

    await uploadPageData({ content, href, title, pageDesc, folderId, screenshot })
    task.status = 'done'
    await saveTaskList()
  }

  taskList.push(task)
  await saveTaskList()
  await run()
}

export {
  createAndRunTask,
  getTaskList,
}
