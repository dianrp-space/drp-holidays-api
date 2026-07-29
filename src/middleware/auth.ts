import { HTTPException } from 'hono/http-exception'
import type { Context, Next } from 'hono'

const skipAuth = ['/api/health', '/api/', '/api']

export async function auth(c: Context, next: Next) {
  if (skipAuth.includes(c.req.path)) return next()

  const apiKey = process.env.API_KEY

  if (apiKey) {
    const header = c.req.header('Authorization')
    if (!header?.startsWith('Bearer ') || header.slice(7) !== apiKey) {
      throw new HTTPException(401, { message: 'Unauthorized' })
    }
  }

  await next()
}
