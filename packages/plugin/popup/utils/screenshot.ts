import { isNil } from '@web-archive/shared/utils'
import Browser from 'webextension-polyfill'
import Compressor from 'compressorjs'
import { base64ToBlob, blobToBase64 } from '~/utils/file'

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
        resolve(result)
      },
    })
  })
  return await blobToBase64(compressedFile)
}

export async function takeScreenshot(windowId: number | undefined): Promise<string | undefined> {
  if (isNil(windowId)) {
    return undefined
  }
  const screenshot = await Browser.tabs.captureVisibleTab(windowId)
  return await compressImage(screenshot)
}
