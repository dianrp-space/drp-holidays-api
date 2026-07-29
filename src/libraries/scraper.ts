import * as cheerio from 'cheerio'
import { MONTH_NAME } from '../constants/month.js'

export const crawler = async (year: string) => {
  const response = await fetch(`https://tanggalans.com/kalender-${year}`)

  if (!response.ok) {
    throw new Error('Failed to fetch tanggalan')
  }

  const html = await response.text()
  const $ = cheerio.load(html)

  const holidays: { date: string; name: string }[] = []

  $('.entry-content .kalender-indo').each((_, element) => {
    const $el = $(element)
    const titleText = $el.find('.kal-title .kal-title-link').text().trim()
    const [monthName, yearStr] = titleText.split(' ') || []
    const month = MONTH_NAME[monthName?.toLowerCase() as keyof typeof MONTH_NAME]

    $el.find('.kal-libur-list li').each((_, li) => {
      const $li = $(li)
      const $dayEl = $li.find('.kal-libur-day')
      const day = $dayEl.text().trim()
      const name = $li.text().replace($dayEl.text(), '').trim()

      if (!day || !name) return

      if (day.includes('-')) {
        const [start, end] = day.split('-', 2).map(Number)
        for (let i = start; i <= end; i++) {
          holidays.push({
            date: `${yearStr}-${month}-${String(i).padStart(2, '0')}`,
            name,
          })
        }
      } else {
        holidays.push({
          date: `${yearStr}-${month}-${day.padStart(2, '0')}`,
          name,
        })
      }
    })
  })

  return holidays
}
