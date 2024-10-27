import Browser from 'webextension-polyfill'
import { request } from './background'

async function resetLoginStatus() {
  await Browser.storage.local.set({ loginStatus: false })
}

async function checkLoginStatus() {
  try {
    await request('/auth', {
      method: 'POST',
    })
    await Browser.storage.local.set({ loginStatus: true })
    return true
  }
  catch {
    return false
  }
}

async function getCacheLoginStatus() {
  const { loginStatus } = await Browser.storage.local.get('loginStatus')
  return !!loginStatus
}

export {
  resetLoginStatus,
  checkLoginStatus,
  getCacheLoginStatus,
}
