import { Input } from '@web-archive/shared/components/input'
import { Label } from '@web-archive/shared/components/label'
import type { PageType } from 'popup/PopupPage'
import type { ChangeEvent } from 'react'
import { useState } from 'react'
import { sendMessage } from 'webext-bridge/popup'
import Browser from 'webextension-polyfill'
import { Textarea } from '@web-archive/shared/components/textarea'
import { Button } from '@web-archive/shared/components/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@web-archive/shared/components/select'
import { useRequest } from 'ahooks'
import Compressor from 'compressorjs'
import { isNil } from '@web-archive/shared/utils'
import { Loader2 } from 'lucide-react'
import { getSingleFileSetting } from '../utils/singleFile'
import LoadingPage from '~/popup/components/LoadingPage'
import { base64ToBlob, blobToBase64 } from '~/utils/file'

interface UploadPageFormProps {
  setActivePage: (page: PageType) => void
}

async function getImageSize(base64: string) {
  return new Promise<{
    height: number
    width: number
  }>((resolve) => {
    const img = new Image()
    img.src = base64
    img.onload = () => {
      resolve({
        height: img.height,
        width: img.width,
      })
    }
  })
}

async function compressImage(base64: string) {
  const { height, width } = await getImageSize(base64)
  const blob = base64ToBlob(base64)
  const compressedFile = await new Promise<Blob>((resolve) => {
    // eslint-disable-next-line no-new -- to compress image
    new Compressor(blob, {
      quality: 0.6,
      mimeType: 'image/webp',
      width: Math.min(1280, width),
      height: Math.min(1280, width) * (height / width),
      success(result) {
        console.log('compressed', result)
        resolve(result)
      },
    })
  })
  return await blobToBase64(compressedFile)
}

async function takeScreenshot(windowId: number | undefined): Promise<string | undefined> {
  if (isNil(windowId)) {
    return undefined
  }
  const screenshot = await Browser.tabs.captureVisibleTab(windowId)
  return await compressImage(screenshot)
}

async function getCurrentTab() {
  const tabs = await Browser.tabs.query({ active: true, currentWindow: true })
  return tabs[0]
}

async function scrapePageData() {
  const tab = await getCurrentTab()

  if (!tab?.id) {
    return {
      title: '',
      pageDesc: '',
      href: '',
      screenshot: undefined,
    }
  }

  const [pageData, screenshot] = await Promise.all([
    sendMessage('get-basic-page-data', {}, `content-script@${tab.id}`),
    takeScreenshot(tab.windowId),
  ])

  return {
    title: pageData.title,
    pageDesc: pageData.pageDesc,
    href: pageData.href,
    screenshot,
  }
}

async function getAllFolders() {
  const { folders } = await sendMessage('get-all-folders', {})
  return folders
}

function ScrapingPageProgress({ stage }: { stage: string }) {
  return (
    <div className="text-center">
      Scraping Page Data...
      <br />
      <span>
        {stage}
      </span>
    </div>
  )
}

function UploadPageForm({ setActivePage }: UploadPageFormProps) {
  const [uploadPageData, setUploadPageData] = useState({
    title: '',
    pageDesc: '',
    href: '',
    folderId: undefined as undefined | string,
    screenshot: undefined as undefined | string,
  })

  function handleChange(e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLSelectElement>) {
    const { name, value } = e.target
    setUploadPageData(prevData => ({
      ...prevData,
      [name]: value,
    }))
  }

  function handleFolderSelect(newFolder: string) {
    console.log('folder select', newFolder)
    setUploadPageData(prevData => ({
      ...prevData,
      folderId: newFolder,
    }))
  }

  const { loading: isScrapingPage } = useRequest(
    scrapePageData,
    {
      onSuccess: (data) => {
        setUploadPageData({
          ...uploadPageData,
          ...data,
        })
      },
    },
  )

  function handleCancle() {
    setActivePage('home')
  }

  async function handleSavePage() {
    console.log('save page', uploadPageData)
    if (isNil(uploadPageData.folderId)) {
      // todo show error
      return
    }
    const tab = await getCurrentTab()
    if (isNil(tab.id)) {
      // todo show error
      return
    }
    await sendMessage('add-save-page-task', {
      tabId: tab.id,
      singleFileSetting: getSingleFileSetting(),
      pageForm: {
        title: uploadPageData.title,
        pageDesc: uploadPageData.pageDesc,
        href: uploadPageData.href,
        folderId: uploadPageData.folderId,
        screenshot: uploadPageData.screenshot,
      },
    })
    setActivePage('home')
  }

  const { data: folderList, loading: loadingFolder } = useRequest(getAllFolders, {
    onSuccess: (data) => {
      if (isNil(uploadPageData.folderId) && data.length > 0) {
        setUploadPageData(prevData => ({
          ...prevData,
          folderId: data[0].id.toString(),
        }))
      }
    },
  })

  if (isScrapingPage) {
    return (
      <LoadingPage
        loadingText="Scraping Page Data..."
      />
    )
  }

  return (
    <div className="w-64 p-4 space-y-4 flex flex-col">
      <div className="flex flex-col space-y-1.5">
        <Label
          htmlFor="title"
        >
          Title
        </Label>
        <Input
          type="text"
          id="title"
          name="title"
          value={uploadPageData.title}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col space-y-1.5">
        <Label
          htmlFor="pageDesc"
        >
          Page Description
        </Label>
        <Textarea
          id="pageDesc"
          name="pageDesc"
          value={uploadPageData.pageDesc}
          rows={3}
          onChange={handleChange}
        >
        </Textarea>
      </div>

      <div className="flex flex-col space-y-1.5">
        <Label
          htmlFor="folderId"
        >
          Folder
        </Label>
        <Select
          name="folderId"
          value={uploadPageData.folderId}
          onValueChange={handleFolderSelect}
        >
          <SelectTrigger>
            <SelectValue placeholder="select folder"></SelectValue>
          </SelectTrigger>
          <SelectContent>
            {folderList && folderList.map(folder => (
              <SelectItem key={folder.id} value={folder.id.toString()}>
                {folder.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-between">
        <Button
          onClick={handleCancle}
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          disabled={isNil(uploadPageData.folderId)}
          onClick={handleSavePage}
        >
          {
            loadingFolder
              ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"></Loader2>
                  Loading
                </span>
                )
              : (
                  'Confirm'
                )
          }
        </Button>
      </div>
    </div>
  )
}

export default UploadPageForm
