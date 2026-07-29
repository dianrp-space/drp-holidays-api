export async function landingPage(c: any) {
  return c.html(`<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Hari Libur Indonesia</title>
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    :root { --bg: #09090b; --card: #111113; --card-hover: #18181b; --border: #1f1f23; --text: #fafafa; --muted: #71717a; --red: #dc2626; --red-dim: rgba(220,38,38,.12); --green: #22c55e; --blue: #3b82f6; --font: 'Inter', system-ui, sans-serif; }
    html { scroll-behavior: smooth; }
    body { font-family: var(--font); background: var(--bg); color: var(--text); line-height: 1.7; padding: 0 24px; overflow-x: hidden; }
    .wrap { max-width: 820px; margin: 0 auto; padding: 80 0 48px; }
    .bg-glow { position: fixed; top: -40%; left: -20%; width: 140%; height: 140%; background: radial-gradient(ellipse at 30% 20%, rgba(220,38,38,.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(59,130,246,.04) 0%, transparent 50%); pointer-events: none; z-index: 0; }
    .wrap { position: relative; z-index: 1; padding: 80 0 48px; }
    header { text-align: center; padding: 72px 0 48px; }
    .flag { font-size: 3rem; display: block; margin-bottom: 16px; }
    h1 { font-size: 3rem; font-weight: 900; letter-spacing: -1.5px; line-height: 1.1; background: linear-gradient(135deg, #fafafa 0%, #a1a1aa 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    h1 em { font-style: normal; background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .sub { color: var(--muted); font-size: 1.1rem; max-width: 520px; margin: 16px auto 32px; font-weight: 400; }
    .badges { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 48px; }
    .badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border: 1px solid var(--border); border-radius: 20px; font-size: .8rem; color: var(--muted); background: var(--card); }
    .badge.auth { border-color: var(--red-dim); color: var(--red); }
    .badge.auth span { background: var(--red-dim); padding: 1px 6px; border-radius: 4px; font-size: .65rem; color: var(--red); font-weight: 600; }
    .links { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 56px; }
    .links a { color: var(--muted); text-decoration: none; font-size: .85rem; display: inline-flex; align-items: center; gap: 6px; padding: 10px 20px; border: 1px solid var(--border); border-radius: 10px; transition: all .25s; font-weight: 500; }
    .links a:hover { color: var(--text); border-color: var(--red); background: var(--card-hover); transform: translateY(-2px); }
    .card { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 28px; margin-bottom: 16px; transition: all .25s; }
    .card:hover { border-color: rgba(220,38,38,.2); }
    .card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 6px; }
    .method { font-size: .65rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; background: var(--green); color: #09090b; letter-spacing: .5px; }
    .card h3 { font-size: .95rem; font-weight: 600; color: var(--muted); }
    .card .desc { color: var(--muted); font-size: .85rem; margin-top: 6px; }
    .card .path { font-family: 'JetBrains Mono','Fira Code',monospace; font-size: .82rem; background: var(--bg); color: var(--text); padding: 10px 14px; border-radius: 6px; margin: 12px 0 0; border: 1px solid var(--border); overflow-x: auto; }
    .card .params { margin-top: 12px; display: grid; gap: 6px; }
    .card .param { display: grid; grid-template-columns: 130px 1fr; gap: 8px; font-size: .82rem; }
    .card .param code { color: var(--blue); font-family: monospace; }
    .card .param span { color: var(--muted); }
    .section-title { font-size: 1.2rem; font-weight: 700; margin: 40px 0 16px; display: flex; align-items: center; gap: 10px; }
    .auth-card { background: linear-gradient(135deg, rgba(220,38,38,.06) 0%, transparent 100%); border: 1px solid var(--red-dim); border-radius: 14px; padding: 24px 28px; margin-bottom: 32px; display: flex; align-items: flex-start; gap: 16px; flex-wrap: wrap; }
    .auth-card-icon { font-size: 1.5rem; flex-shrink: 0; }
    .auth-card-content { flex: 1; min-width: 200px; }
    .auth-card-content h3 { font-size: .9rem; font-weight: 600; color: var(--red); }
    .auth-card-content p { color: var(--muted); font-size: .82rem; margin-top: 4px; }
    .auth-card-code { background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 8px 12px; font-family: monospace; font-size: .8rem; color: var(--muted); margin-top: 8px; display: inline-block; }
    .auth-card-code strong { color: var(--text); font-weight: 500; }
    .resp { margin-top: 48px; }
    .resp h2 { font-size: 1rem; font-weight: 600; margin-bottom: 16px; color: var(--muted); }
    .resp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    @media (max-width: 640px) { .resp-grid { grid-template-columns: 1fr; } }
    pre { background: var(--card); border: 1px solid var(--border); border-radius: 10px; padding: 16px; overflow-x: auto; font-size: .78rem; line-height: 1.6; color: var(--muted); font-family: monospace; }
    pre .key { color: #c678dd; } pre .str { color: #98c379; } pre .bool { color: #61afef; } pre .num { color: #d19a66; }
    footer { margin-top: 72px; padding: 32px 0; text-align: center; border-top: 1px solid var(--border); color: var(--muted); font-size: .82rem; }
    footer a { color: var(--red); text-decoration: none; }
    footer a:hover { text-decoration: underline; }
    footer .footer-links { display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; margin-top: 16px; }
    footer .footer-links a { color: var(--muted); font-size: .82rem; }
    footer .footer-links a:hover { color: var(--text); }
    @media (max-width: 600px) { h1 { font-size: 2rem; } .wrap { padding: 40px 0; } header { padding: 40px 0 32px; } .flag { font-size: 2rem; } .sub { font-size: .95rem; } .card { padding: 20px; } .card .param { grid-template-columns: 1fr; gap: 2px; } }
  </style>
</head>
<body>
<div class="bg-glow"></div>
<div class="wrap">
  <header>
    <span class="flag">🇮🇩</span>
    <h1>API <em>Hari Libur</em></h1>
    <p class="sub">Data hari libur nasional dan cuti bersama Indonesia — gratis, cepat, tinggal pakai.</p>
    <div class="badges">
      <div class="badge">🇮🇩 Indonesia</div>
      <div class="badge">⚡ REST API</div>
      <div class="badge">📅 realtime</div>
      <div class="badge auth"><span>AUTH</span> Bearer Token</div>
    </div>
  </header>
  <div class="links">
    <a href="https://dianrp.com" target="_blank">by dianrp.com</a>
    <a href="https://github.com/dianrp-space/drp-holidays-api" target="_blank">GitHub &nearr;</a>
  </div>
  <div class="auth-card">
    <div class="auth-card-icon">🔑</div>
    <div class="auth-card-content">
      <h3>Autentikasi</h3>
      <p>Semua endpoint (kecuali <code>/api/health</code>) membutuhkan Bearer token.</p>
      <div class="auth-card-code">Authorization: Bearer <strong>&lt;API_KEY&gt;</strong></div>
    </div>
  </div>
  <div class="section-title">Endpoint</div>
  <div class="card">
    <div class="card-header"><span class="method">GET</span><h3>Semua libur tahun ini</h3></div>
    <div class="path">/api/data</div>
  </div>
  <div class="card">
    <div class="card-header"><span class="method">GET</span><h3>Semua libur tahun ini</h3></div>
    <div class="path">/api/thisyear</div>
  </div>
  <div class="card">
    <div class="card-header"><span class="method">GET</span><h3>Libur tahun tertentu</h3></div>
    <div class="path">/api/data?year=2025</div>
    <div class="params"><div class="param"><code>year</code><span>Tahun (2011–tahun depan)</span></div></div>
  </div>
  <div class="card">
    <div class="card-header"><span class="method">GET</span><h3>Libur bulan tertentu</h3></div>
    <div class="path">/api/data?year=2025&month=8</div>
    <div class="params"><div class="param"><code>year</code><span>Tahun</span></div><div class="param"><code>month</code><span>Bulan (1–12)</span></div></div>
  </div>
  <div class="card">
    <div class="card-header"><span class="method">GET</span><h3>Cek tanggal spesifik</h3></div>
    <div class="path">/api/data?year=2025&month=8&day=17</div>
    <div class="params"><div class="param"><code>year</code><span>Tahun</span></div><div class="param"><code>month</code><span>Bulan (1–12)</span></div><div class="param"><code>day</code><span>Tanggal (1–31)</span></div></div>
  </div>
  <div class="card">
    <div class="card-header"><span class="method">GET</span><h3>Cek hari ini / besok</h3></div>
    <div class="path">/api/today</div>
    <div class="path">/api/tomorrow</div>
  </div>
  <div class="card">
    <div class="card-header"><span class="method">GET</span><h3>Health check <span style="color:var(--muted);font-weight:400;font-size:.82rem;">(tanpa auth)</span></h3></div>
    <div class="path">/api/health</div>
  </div>
  <div class="resp">
    <h2>Contoh response</h2>
    <div class="resp-grid">
      <pre>{\n  <span class="key">"date"</span>: <span class="str">"2025-08-17"</span>,\n  <span class="key">"name"</span>: <span class="str">"Proklamasi Kemerdekaan"</span>,\n  <span class="key">"is_national_holiday"</span>: <span class="bool">true</span>\n}</pre>
      <pre>{\n  <span class="key">"date"</span>: <span class="str">"2025-08-17"</span>,\n  <span class="key">"is_holiday"</span>: <span class="bool">true</span>,\n  <span class="key">"is_national_holiday"</span>: <span class="bool">true</span>,\n  <span class="key">"holiday_list"</span>: [\n    <span class="str">"Proklamasi Kemerdekaan"</span>\n  ]\n}</pre>
    </div>
  </div>
  <footer>
    <p>Data dari <a href="https://tanggalans.com" target="_blank">tanggalans.com</a></p>
    <div class="footer-links">
      <a href="https://dianrp.com" target="_blank">dianrp.com</a>
      <a href="https://github.com/dianrp-space/drp-holidays-api" target="_blank">GitHub</a>
    </div>
  </footer>
</div>
</body>
</html>`)
}
