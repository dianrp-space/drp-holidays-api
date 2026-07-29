# API Hari Libur Indonesia

Holiday data sourced from [tanggalans.com](https://www.tanggalans.com/).

## Setup

```bash
cp .env.example .env
# isi DATABASE_URL dan API_KEY
```

## Dev

```bash
npm install
npm run dev
```

Server jalan di `http://localhost:3000`.

Test endpoint lokal:

**PowerShell (recommended)** — single quote `'` aman:
```powershell
$token = "isi_api_key_kamu"

curl 'http://127.0.0.1:3000/api/health'
curl 'http://127.0.0.1:3000/api/thisyear' -H "Authorization: Bearer $token"
curl 'http://127.0.0.1:3000/api?year=2025&month=1' -H "Authorization: Bearer $token"
curl 'http://127.0.0.1:3000/api?year=2025&month=1&day=1' -H "Authorization: Bearer $token"
curl 'http://127.0.0.1:3000/api/today' -H "Authorization: Bearer $token"
curl 'http://127.0.0.1:3000/api/tomorrow' -H "Authorization: Bearer $token"
```

**CMD** — tanda `^` sebelum `&`:
```cmd
curl http://127.0.0.1:3000/api/health
curl "http://127.0.0.1:3000/api/thisyear" -H "Authorization: Bearer isi_api_key_kamu"
curl "http://127.0.0.1:3000/api?year=2025^&month=1" -H "Authorization: Bearer isi_api_key_kamu"
curl "http://127.0.0.1:3000/api?year=2025^&month=1^&day=1" -H "Authorization: Bearer isi_api_key_kamu"
curl "http://127.0.0.1:3000/api/today" -H "Authorization: Bearer isi_api_key_kamu"
curl "http://127.0.0.1:3000/api/tomorrow" -H "Authorization: Bearer isi_api_key_kamu"
```

## Deploy

```bash
vercel --prod
```

Set env di Vercel Dashboard:
- `DATABASE_URL` — Postgres connection string (Neon, Supabase, etc.)
- `API_KEY` — Bearer token untuk auth

## API

Semua endpoint wajib header `Authorization: Bearer <API_KEY>`.

| Endpoint | Deskripsi |
|----------|-----------|
| `GET /api?year=2025` | Hari libur setahun |
| `GET /api?year=2025&month=1` | Hari libur sebulan |
| `GET /api?year=2025&month=1&day=1` | Cek tanggal tertentu |
| `GET /api/health` | Health check |
| `GET /api/thisyear` | Hari libur tahun ini |
| `GET /api/today` | Hari libur hari ini |
| `GET /api/tomorrow` | Hari libur besok |

## Database

Data hasil scraping otomatis disimpan ke Postgres. Table `holidays` dibuat otomatis.

## License

MIT
