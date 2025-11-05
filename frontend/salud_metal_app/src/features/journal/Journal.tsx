import { useEffect, useState } from 'react'
import PageLayout from '../../components/layout/PageLayout'
import { journalService, type JournalEntry } from '../../services/journal'

export default function Journal(){
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try{
      const res = await journalService.list({ limit: 12, page: 1 })
      setEntries(res.entries)
    }catch(e:any){ setError(e?.message || 'Error cargando entradas') }
    finally{ setLoading(false) }
  }

  useEffect(()=>{ load() }, [])

  const deriveTitle = (text: string) => {
    const t = text.trim().replace(/\s+/g,' ')
    return t ? (t.length > 40 ? t.slice(0,40) + '…' : t) : 'Entrada'
  }

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if(!content.trim()) return
    setError(null)
    try{
      const today = new Date().toISOString().slice(0,10)
      await journalService.create({ title: deriveTitle(content), content, mood: 'positivo', date: today })
      setContent('')
      await load()
    }catch(e:any){ setError(e?.message || 'No se pudo guardar tu entrada') }
  }

  const fmtDate = (d: string) => {
    try{
      return new Date(d).toLocaleDateString('es-ES', { day:'numeric', month:'long' })
    }catch{ return d }
  }

  return (
    <PageLayout title="Zona de desahogo">
      <div className="journal-grid">
        <section className="stat-card journal-compose">
          <h3 className="stat-card-title" style={{marginBottom:12}}>Escribe cómo te sientes</h3>
          <form onSubmit={onCreate}>
            <textarea
              className="field-input"
              placeholder="Hoy quiero escribir sobre cómo me siento..."
              rows={8}
              value={content}
              onChange={(e)=> setContent(e.target.value)}
            />
            {error && <div className="field-error" style={{marginTop:6}}>{error}</div>}
            <button className="primary-btn" type="submit" disabled={!content.trim()}>Guardar entrada</button>
          </form>
        </section>

        <aside className="stat-card journal-history">
          <h3 className="stat-card-title">Entradas anteriores</h3>
          {loading ? (
            <div className="chart-placeholder">Cargando...</div>
          ) : entries.length === 0 ? (
            <div className="chart-placeholder">Aún no tienes entradas</div>
          ) : (
            <ul className="journal-history-list">
              {entries.map((e)=> (
                <li key={e.id} className="history-item">
                  <div className="history-date">{fmtDate(e.date)}</div>
                  <div className="history-text">{e.content}</div>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </PageLayout>
  )
}
