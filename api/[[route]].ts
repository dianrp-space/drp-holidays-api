import app from '../src/app.js'

export async function GET(request: Request) {
  return app.fetch(request)
}
