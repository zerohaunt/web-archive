import type { Context, Next } from 'hono'
import { verifyAdminToken } from '~/model/store'

async function tokenMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Invalid token' }, 401)
  }

  const token = authHeader.split(' ')[1]

  const result = await verifyAdminToken(c.env.DB, token)

  if (result === 'reject') {
    return c.json({ error: 'Invalid token' }, 401)
  }

  if (result === 'new') {
    return c.json({ error: 'Admin token set, please use it login again' }, 401)
  }

  await next()
}

export default tokenMiddleware
