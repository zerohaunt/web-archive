async function checkAdminExist(DB: D1Database): Promise<boolean> {
  const result: { count: number } = await DB.prepare(`SELECT COUNT(*) as count FROM stores WHERE key = 'ADMIN_TOKEN'`).first()
  return result.count > 0
}

async function verifyAdminToken(DB: D1Database, token: string): Promise<'new' | 'reject' | 'accept'> {
  const result: { count: number } = await DB.prepare(`SELECT COUNT(*) as count FROM stores WHERE key = 'ADMIN_TOKEN' AND value = ?`).bind(token).first()
  if (result.count > 0) {
    return 'accept'
  }
  const exist = await checkAdminExist(DB)
  if (!exist) {
    const success = await setAdminToken(DB, token)
    return success ? 'new' : 'reject'
  }
  return 'reject'
}

async function setAdminToken(DB: D1Database, token: string): Promise<boolean> {
  const exist = await checkAdminExist(DB)
  if (exist) {
    throw new Error('Admin token already exists')
  }
  const result = await DB.prepare(`INSERT INTO stores (key, value) VALUES ('ADMIN_TOKEN', ?)`).bind(token).run()
  console.log(result)
  return result.success
}

export { checkAdminExist, verifyAdminToken, setAdminToken }
