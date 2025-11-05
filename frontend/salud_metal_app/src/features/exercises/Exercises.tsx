import { useEffect, useState } from 'react'
import PageLayout from '../../components/layout/PageLayout'
import { exercisesService, type Exercise } from '../../services/exercises'

export default function Exercises(){
  const [list, setList] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Exercise | null>(null)
  const [detail, setDetail] = useState<any | null>(null)

  const load = async () => {
    setLoading(true)
    try{
      const l = await exercisesService.list()
      setList(l.exercises)
    }finally{ setLoading(false) }
  }

  useEffect(()=>{ load() }, [])

  const openDetail = async (ex: Exercise) => {
    setSelected(ex)
    const d = await exercisesService.getById(ex.id)
    setDetail(d)
  }

  const complete = async (id: string) => {
    await exercisesService.complete(id, { durationMinutes: detail?.durationMinutes || exDurationGuess(detail), rating: 5 })
    const d = await exercisesService.getById(id)
    setDetail(d)
  }

  const exDurationGuess = (d:any) => Math.max(5, Math.min(20, d?.durationMinutes || 10))

  return (
    <PageLayout title="Ejercicios">
      <section className="stat-card" style={{marginBottom:16}}>
        <h3 className="stat-card-title">Lista</h3>
        {loading ? <div className="chart-placeholder">Cargando...</div> : (
          <div className="quick-actions">
            {list.map(ex => (
              <button key={ex.id} className="quick-action" onClick={()=> openDetail(ex)}>
                <div className="quick-action-icon">{ex.icon || '🧘'}</div>
                <div className="quick-action-label">{ex.title}</div>
                <div className="quick-action-desc">{ex.description}</div>
              </button>
            ))}
          </div>
        )}
      </section>

      {selected && detail && (
        <section className="stat-card">
          <h3 className="stat-card-title">{detail.title}</h3>
          <div className="quick-action-desc">Tipo: {detail.type} · Duración: {detail.durationMinutes || '—'} min</div>
          {detail.instructions?.length ? (
            <ul style={{marginTop:12}}>
              {detail.instructions.map((s:string, i:number)=> <li key={i}>{s}</li>)}
            </ul>
          ) : <div className="quick-action-desc" style={{marginTop:12}}>Sin instrucciones detalladas</div>}
          <div style={{display:'flex', gap:8, marginTop:12}}>
            <button className="sidebar-link" onClick={()=> complete(detail.id)}>Marcar como completado</button>
            <button className="sidebar-link" onClick={()=> { setSelected(null); setDetail(null) }}>Cerrar</button>
          </div>
          {detail.completedCount !== undefined && <div className="quick-action-desc" style={{marginTop:12}}>Completado {detail.completedCount} veces</div>}
        </section>
      )}
    </PageLayout>
  )
}
