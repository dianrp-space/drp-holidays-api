import app from '../src/app.js'

export default async function handler(
  req: import('http').IncomingMessage,
  res: import('http').ServerResponse,
) {
  try {
    const url = new URL(req.url!, `http://${req.headers.host}`)
    const request = new Request(url, {
      method: req.method,
      headers: Object.entries(req.headers).reduce((acc, [k, v]) => {
        if (v) acc[k] = Array.isArray(v) ? v.join(', ') : v
        return acc
      }, {} as Record<string, string>),
    })

    const response = await app.fetch(request)

    res.statusCode = response.status
    response.headers.forEach((value, key) => res.setHeader(key, value))
    const body = await response.text()
    res.end(body)
  } catch (e) {
    console.error('[FUNC]', e)
    res.statusCode = 500
    res.end(JSON.stringify({ error: 'Internal Server Error' }))
  }
}
