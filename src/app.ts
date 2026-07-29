import { Hono, type Context } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { HTTPException } from 'hono/http-exception'
import { zValidator } from './middleware/zod.js'
import { dateSchema } from './schema/date_schema.js'
import { getHoliday, getHolidayDate } from './libraries/holiday.js'
import { auth } from './middleware/auth.js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let landingHtml: string
try {
  landingHtml = readFileSync(resolve(__dirname, '..', 'public', 'index.html'), 'utf-8')
} catch {
  landingHtml = readFileSync(resolve(process.cwd(), 'public', 'index.html'), 'utf-8')
}

const app = new Hono()

app.get('/', (c: Context) => c.html(landingHtml))

const api = new Hono()

api.use('*', logger())
api.use('*', cors({ origin: '*', allowMethods: ['GET'] }))
api.use('*', auth)

api.get(
  '/',
  zValidator('query', dateSchema),
  async (c: Context) => {
    const year = c.req.query('year') || new Date().getFullYear().toString()
    const month = c.req.query('month')
    const day = c.req.query('day')

    if (day) {
      return c.json(
        await getHolidayDate(new Date(`${year}-${month}-${day}`)),
      )
    }

    return c.json(
      await getHoliday(year, month),
    )
  },
)

api.get(
  '/health',
  (c: Context) => {
    return c.json({ status: 'ok' })
  },
)

api.get(
  '/thisyear',
  async (c: Context) => {
    const year = new Date().getFullYear().toString()
    return c.json(
      await getHoliday(year),
    )
  },
)

api.get(
  '/today',
  async (c: Context) => {
    return c.json(
      await getHolidayDate(new Date()),
    )
  },
)

api.get(
  '/tomorrow',
  async (c: Context) => {
    const date = new Date()
    date.setDate(date.getDate() + 1)

    return c.json(
      await getHolidayDate(date),
    )
  },
)

api.onError((err: Error, c: Context) => {
  if (err instanceof HTTPException) {
    return c.json({
      message: err.message,
      errors: err.cause,
    }, err.status)
  }

  return c.json({
    message: err.message,
  }, 500)
})

app.route('/api', api)

app.onError((err: Error, c: Context) => {
  if (err instanceof HTTPException) {
    return c.json({
      message: err.message,
      errors: err.cause,
    }, err.status)
  }

  return c.json({
    message: err.message,
  }, 500)
})

export default app
