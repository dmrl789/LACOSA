import React, { useEffect, useState } from 'react'

const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.toString() ||
  '/api'

export default function App() {
  const [health, setHealth] = useState<string>('checking...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then(j => setHealth(j.status ?? 'ok'))
      .catch(e => setError(String(e)))
  }, [])

  return (
    <div style={{ padding: 16, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
      <h1>LACOSA Mobile</h1>
      <p>Frontend ↔ API connectivity check:</p>
      <pre style={{ background: '#f6f6f6', padding: 12, borderRadius: 8 }}>
        {error ? `Error: ${error}` : `Health: ${health}`}
      </pre>

      <p style={{ marginTop: 24 }}>
        Configure <code>VITE_API_BASE_URL</code> in <code>.env</code> to point at a direct API URL, or rely on the Vite dev proxy using <code>/api</code>.
      </p>
    </div>
  )
}
