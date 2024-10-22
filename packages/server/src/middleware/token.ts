import type { Context, Next } from 'hono'

async function tokenMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Invalid token' }, 401)
  }

  const token = authHeader.split(' ')[1]

  if (!c.env.BEARER_TOKEN) {
    return c.json({ error: 'Token not set' }, 401)
  }

  if (token !== c.env.BEARER_TOKEN) {
    return c.json({ error: 'Invalid token' }, 401)
  }

  await next()
}

export default tokenMiddleware
