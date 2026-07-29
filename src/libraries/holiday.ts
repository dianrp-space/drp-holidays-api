import { crawler } from './scraper'
import { getHolidaysByYear, saveHolidays } from '../database'

type Holiday = { name: string; date: string }

export const getHoliday = async (
  year: string,
  month?: string
): Promise<(Holiday & { is_national_holiday: boolean })[]> => {
  const holidays = await getHolidayYearly(year)

  const result = holidays.map((h) => ({
    ...h,
    is_national_holiday: !h.name.toLowerCase().includes('cuti bersama'),
  }))

  if (!month) return result

  const monthPadded = month.padStart(2, '0')
  const prefix = `${year}-${monthPadded}`

  return result.filter((item) => item.date.startsWith(prefix))
}

export const getHolidayDate = async (date: Date) => {
  const current = new Date(
    date.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
  )

  const year = current.getFullYear().toString()
  const month = (current.getMonth() + 1).toString().padStart(2, '0')
  const day = current.getDate().toString().padStart(2, '0')
  const formattedDate = `${year}-${month}-${day}`

  const holidays = await getHolidayYearly(year)
  const dayHolidays = holidays.filter(item => item.date === formattedDate)
  const holidayList = dayHolidays.map(item => item.name)

  return {
    date: formattedDate,
    is_holiday: holidayList.length > 0,
    is_national_holiday: dayHolidays.some(
      (holiday) => !holiday.name.toLowerCase().includes('cuti bersama')
    ),
    holiday_list: holidayList,
  }
}

const memCache = new Map<string, { data: Holiday[]; expiry: number }>()
const CACHE_TTL = 1000 * 60 * 60 * 24 * 30

const getHolidayYearly = async (year: string): Promise<Holiday[]> => {
  const yearNum = parseInt(year, 10)

  const cached = memCache.get(year)
  if (cached && Date.now() < cached.expiry) return cached.data

  const fromDb = await getHolidaysByYear(yearNum)
  if (fromDb.length > 0) {
    memCache.set(year, { data: fromDb, expiry: Date.now() + CACHE_TTL })
    return fromDb
  }

  const data = await getData(year)
  if (data.length > 0) {
    await saveHolidays(data)
    const currentYear = new Date().getFullYear()
    const ttl = yearNum >= currentYear ? CACHE_TTL : Infinity
    memCache.set(year, { data, expiry: Date.now() + ttl })
  }

  return data
}

const getData = async (year: string): Promise<Holiday[]> => {
  try {
    return await crawler(year)
  } catch {
    return []
  }
}
