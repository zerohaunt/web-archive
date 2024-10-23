import { onMessage, sendMessage } from 'webext-bridge/content-script'
import { getCurrentPageData } from '~/utils/singleFile'

onMessage('scrape-page-data', async ({ data: singleFileSetting }) => {
  return await getCurrentPageData({
    ...singleFileSetting,
    onprogress: (data) => {
      sendMessage('scrape-page-progress', { stage: data.type }, 'popup')
    },
  })
})

onMessage('get-basic-page-data', async () => {
  const descriptionList = document.getElementsByName('description')
  const description = descriptionList?.[0]?.getAttribute('content') ?? ''
  return {
    title: document.title,
    href: window.location.href,
    pageDesc: description,
  }
})
