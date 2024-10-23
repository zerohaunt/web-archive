import { createHash } from 'node:crypto'

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

async function checkAdminExist(DB: D1Database): Promise<boolean> {
  const result: { count: number } = await DB.prepare(`SELECT COUNT(*) as count FROM stores WHERE key = 'ADMIN_TOKEN'`).first()
  return result.count > 0
}

async function verifyAdminToken(DB: D1Database, token: string): Promise<'new' | 'fail' | 'reject' | 'accept'> {
  if (typeof token !== 'string' || token.length < 8)
    return 'reject'
  token = hashToken(token)
  const result: { count: number } = await DB.prepare(`SELECT COUNT(*) as count FROM stores WHERE key = 'ADMIN_TOKEN' AND value = ?`).bind(token).first()
  if (result.count > 0) {
    return 'accept'
  }
  const exist = await checkAdminExist(DB)
  if (!exist) {
    const success = await setAdminToken(DB, token)
    return success ? 'new' : 'fail'
  }
  return 'reject'
}

async function setAdminToken(DB: D1Database, token: string): Promise<boolean> {
  const exist = await checkAdminExist(DB)
  if (exist) {
    throw new Error('Admin token already exists')
  }
  const result = await DB.prepare(`INSERT INTO stores (key, value) VALUES ('ADMIN_TOKEN', ?)`).bind(token).run()
  return result.success
}

export { checkAdminExist, verifyAdminToken, setAdminToken }
