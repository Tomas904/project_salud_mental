import { useEffect, useState } from 'react'
import PageLayout from '../../components/layout/PageLayout'
import { emotionsService, type Emotion, type EmotionCreate, type EmotionType } from '../../services/emotions'

export default function Emotions(){
  const [list, setList] = useState<Emotion[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<EmotionCreate>({ emotionType: 'feliz', intensity: 5, note: '', date: new Date().toISOString().slice(0,10) })
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try{
      const l = await emotionsService.list({ limit: 20, page: 1 })
      setList(l.emotions)
    }catch(e:any){ setError(e?.message || 'Error cargando emociones') }
    finally{ setLoading(false) }
  }

  useEffect(()=>{ load() }, [])

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try{
      await emotionsService.create(form)
      await load()
      setForm({ emotionType: 'feliz', intensity: 5, note: '', date: new Date().toISOString().slice(0,10) })
    }catch(e:any){ setError(e?.message || 'No se pudo crear la emoción') }
  }

  const onDelete = async (id: string) => {
    try{ await emotionsService.remove(id); await load() }catch{}
  }

  const emojiFor = (em: EmotionType) => (
    em === 'feliz' ? '😊' :
    em === 'tranquilo' ? '😌' :
    em === 'neutral' ? '😐' :
    em === 'triste' ? '😢' :
    em === 'molesto' ? '😠' :
    '😰'
  )

  const moodClass = (em: EmotionType): 'good'|'neutral'|'bad' => (
    em === 'feliz' || em === 'tranquilo' ? 'good' : em === 'neutral' ? 'neutral' : 'bad'
  )

  const fmtDate = (iso: string) => {
    try{
      const d = new Date(iso)
      const today = new Date()
      const isSameDay = d.toDateString() === today.toDateString()
      if(isSameDay) return 'Hoy'
      const y = new Date(today); y.setDate(today.getDate()-1)
      if(d.toDateString() === y.toDateString()) return 'Ayer'
      return d.toLocaleDateString('es-ES', { day:'2-digit', month:'short' })
    }catch{ return iso }
  }

  return (
    <PageLayout title="Emociones">
      <section className="stat-card" style={{marginBottom:16}}>
        <h3 className="stat-card-title" style={{textAlign:'center'}}>Registrar emoción del día</h3>
        <p style={{textAlign:'center', marginTop:6, marginBottom:14, color:'#64748b'}}>Selecciona cómo te sientes ahora mismo</p>

        <form onSubmit={onCreate} style={{display:'flex', flexDirection:'column', gap:14, alignItems:'center'}}>
          <div className="emotion-grid" role="list">
            {(['feliz','tranquilo','neutral','triste','molesto','ansioso'] as EmotionType[]).map((em) => (
              <button
                key={em}
                type="button"
                role="listitem"
                aria-pressed={form.emotionType === em}
                aria-label={em}
                className={`emotion-card ${form.emotionType === em ? 'selected' : ''}`}
                onClick={() => setForm(f=>({...f, emotionType: em}))}
              >
                <div className="emotion-emoji">
                  {emojiFor(em)}
                </div>
                <div className="emotion-label">{em.charAt(0).toUpperCase() + em.slice(1)}</div>
              </button>
            ))}
          </div>

          <textarea className="field-input emotion-note" placeholder="¿Por qué te sientes así?" rows={3} value={form.note||''} onChange={(e)=> setForm(f=>({...f, note: e.target.value}))} />

          <div style={{width:'100%', display:'flex', justifyContent:'center'}}>
            <button className="primary-btn" type="submit" style={{width:320}}>Guardar emoción</button>
          </div>

          {error && <div className="field-error" style={{marginTop:8}}>{error}</div>}
        </form>
      </section>

      <section className="stat-card" style={{marginBottom:16}}>
        <h3 className="stat-card-title">Últimas emociones</h3>
        {loading ? <div className="chart-placeholder">Cargando...</div> : (
          <ul className="emotion-list">
            {list.map((e)=> (
              <li key={e.id} className="emotion-row">
                <div className="emotion-item-left">
                  <div className={`emotion-item-emoji chip-${moodClass(e.emotionType)}`}>{emojiFor(e.emotionType)}</div>
                  <div className="emotion-item-info">
                    <div className="emotion-item-head">
                      <span className="emotion-name">{e.emotionType.charAt(0).toUpperCase()+e.emotionType.slice(1)}</span>
                      <span className="emotion-date">{fmtDate(e.date)}</span>
                      <span className={`emotion-chip chip-${moodClass(e.emotionType)}`}>Intensidad {e.intensity}/10</span>
                    </div>
                    <div className="emotion-intensity">
                      <div className="emotion-intensity-bar">
                        <div className={`emotion-intensity-fill chip-${moodClass(e.emotionType)}`} style={{ width: `${Math.max(0, Math.min(10, e.intensity))*10}%` }} />
                      </div>
                    </div>
                    {e.note && <div className="emotion-note-text">{e.note}</div>}
                  </div>
                </div>
                <button className="list-danger-btn" onClick={()=> onDelete(e.id)} aria-label="Eliminar emoción">Eliminar</button>
              </li>
            ))}
            {list.length === 0 && <div className="chart-placeholder">Sin registros</div>}
          </ul>
        )}
      </section>

      {/* Resumen semanal eliminado por petición del usuario */}
    </PageLayout>
  )
}
