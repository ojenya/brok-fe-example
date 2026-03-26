import { useRef, useState } from 'react'
import { DemoApi } from './generated-sources/core/apis'
import type { HelloResponse, StatusResponse } from './generated-sources/core/models'
import { coreApiConfig } from './lib/constants'
import './App.css'

const coreApi = new DemoApi(coreApiConfig)

function App() {
  const [hello, setHello] = useState<HelloResponse | null>(null)
  const [status, setStatus] = useState<StatusResponse | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const loadingRef = useRef(false)

  const callHello = async () => {
    if (loadingRef.current) return
    loadingRef.current = true
    setError(null)
    setLoading('hello')
    try {
      const data = await coreApi.getHello()
      setHello(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(null)
      loadingRef.current = false
    }
  }

  const callStatus = async () => {
    if (loadingRef.current) return
    loadingRef.current = true
    setError(null)
    setLoading('status')
    try {
      const data = await coreApi.getStatus()
      setStatus(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(null)
      loadingRef.current = false
    }
  }

  return (
    <main className="app">
      <h1 className="app-title">BrOk Demo</h1>
      <div className="cards">
        <section className="card">
          <h2 className="card-title">Core API — Hello</h2>
          <div className="card-actions">
            <button
              type="button"
              className="btn-primary"
              onClick={callHello}
              disabled={loading !== null}
            >
              {loading === 'hello' ? (
                <span className="loading-inline">Загрузка…</span>
              ) : (
                'Вызвать /core/api/hello'
              )}
            </button>
          </div>
          {hello && (
            <div className="response">
              <div className="response-label">Ответ</div>
              <pre>{JSON.stringify(hello, null, 2)}</pre>
            </div>
          )}
        </section>
        <section className="card">
          <h2 className="card-title">Core API — Status</h2>
          <div className="card-actions">
            <button
              type="button"
              className="btn-primary"
              onClick={callStatus}
              disabled={loading !== null}
            >
              {loading === 'status' ? (
                <span className="loading-inline">Загрузка…</span>
              ) : (
                'Вызвать /core/api/status'
              )}
            </button>
          </div>
          {status && (
            <div className="response">
              <div className="response-label">Ответ</div>
              <pre>{JSON.stringify(status, null, 2)}</pre>
            </div>
          )}
        </section>
      </div>
      {error && <p className="error" role="alert">{error}</p>}
    </main>
  )
}

export default App
