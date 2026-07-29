import postgres from 'postgres'

let sql: ReturnType<typeof postgres> | null = null

try {
  if (process.env.DATABASE_URL) {
    sql = postgres(process.env.DATABASE_URL, { prepare: false })
  } else {
    console.log('[DB] no DATABASE_URL, skipping')
  }
} catch (e) {
  console.error('[DB] connection failed:', e)
  sql = null
}

function tableName(year: number) {
  return `holidays_${year}`
}

export async function getHolidaysByYear(year: number) {
  if (!sql) return []

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS ${sql(tableName(year))} (
        id SERIAL PRIMARY KEY,
        date TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(date, name)
      )
    `

    const rows = await sql`
      SELECT date, name FROM ${sql(tableName(year))} ORDER BY date
    `
    return rows as { date: string; name: string }[]
  } catch (e) {
    console.error('[DB] query error:', e)
    return []
  }
}

export async function saveHolidays(holidays: { date: string; name: string }[]) {
  if (!sql || holidays.length === 0) return

  const year = parseInt(holidays[0].date.split('-')[0], 10)

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS ${sql(tableName(year))} (
        id SERIAL PRIMARY KEY,
        date TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(date, name)
      )
    `

    const rows = holidays.map(h => [
      h.date,
      h.name,
    ])

    await sql`
      INSERT INTO ${sql(tableName(year))} (date, name)
      VALUES ${sql(rows)}
      ON CONFLICT (date, name) DO NOTHING
    `
  } catch (e) {
    console.error('[DB] save error:', e)
  }
}
