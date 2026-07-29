import { Hono, type Context } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { HTTPException } from 'hono/http-exception'
import { zValidator } from './middleware/zod.js'
import { dateSchema } from './schema/date_schema.js'
import { getHoliday, getHolidayDate } from './libraries/holiday.js'
import { auth } from './middleware/auth.js'

const app = new Hono().basePath('/api')

app.use('*', logger())
app.use('*', cors({ origin: '*', allowMethods: ['GET'] }))
app.use('*', auth)

app.get(
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

app.get(
  '/health',
  (c: Context) => {
    return c.json({ status: 'ok' })
  },
)

app.get(
  '/thisyear',
  async (c: Context) => {
    const year = new Date().getFullYear().toString()
    return c.json(
      await getHoliday(year),
    )
  },
)

app.get(
  '/today',
  async (c: Context) => {
    return c.json(
      await getHolidayDate(new Date()),
    )
  },
)

app.get(
  '/tomorrow',
  async (c: Context) => {
    const date = new Date()
    date.setDate(date.getDate() + 1)

    return c.json(
      await getHolidayDate(date),
    )
  },
)

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
