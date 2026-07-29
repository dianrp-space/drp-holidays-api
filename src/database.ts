import postgres from 'postgres'

let sql: ReturnType<typeof postgres> | null = null
let sqlReady = false

function getSql() {
  if (!sqlReady) {
    sqlReady = true
    const url = process.env.DATABASE_URL
    if (url) {
      try {
        sql = postgres(url, { prepare: false })
      } catch (e) {
        console.error('[DB] init failed:', e)
      }
    } else {
      console.log('[DB] no DATABASE_URL, skipping')
    }
  }
  return sql
}

export async function getHolidaysByYear(year: number) {
  const db = getSql()
  if (!db) return []

  try {
    await db`
      CREATE TABLE IF NOT EXISTS ${db(`holidays_${year}`)} (
        id SERIAL PRIMARY KEY,
        date TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(date, name)
      )
    `

    const rows = await db`
      SELECT date, name FROM ${db(`holidays_${year}`)} ORDER BY date
    `
    return rows as unknown as { date: string; name: string }[]
  } catch (e) {
    console.error('[DB] query error:', e)
    return []
  }
}

export async function saveHolidays(holidays: { date: string; name: string }[]) {
  if (holidays.length === 0) return

  const db = getSql()
  if (!db) return

  const year = parseInt(holidays[0].date.split('-')[0], 10)

  try {
    await db`
      CREATE TABLE IF NOT EXISTS ${db(`holidays_${year}`)} (
        id SERIAL PRIMARY KEY,
        date TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(date, name)
      )
    `

    const rows = holidays.map(h => [h.date, h.name])

    await db`
      INSERT INTO ${db(`holidays_${year}`)} (date, name)
      VALUES ${db(rows)}
      ON CONFLICT (date, name) DO NOTHING
    `
  } catch (e) {
    console.error('[DB] save error:', e)
  }
}
