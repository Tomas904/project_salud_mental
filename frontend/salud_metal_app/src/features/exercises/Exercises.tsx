import { useEffect, useMemo, useState } from 'react'
import PageLayout from '../../components/layout/PageLayout'
import { exercisesService, type Exercise } from '../../services/exercises'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import { showApiError } from '../../utils/notify.ts'

export default function Exercises(){
  const [list, setList] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState<any[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sort, setSort] = useState<'title'|'duration'>('title')
  const [typeFilter, setTypeFilter] = useState<'all' | Exercise['type']>('all')
  const [query, setQuery] = useState('')

  const load = async (type: 'all' | Exercise['type'] = typeFilter) => {
    setLoading(true)
    setError(null)
    try{
      const params = type === 'all' ? undefined : { type }
      const l = await exercisesService.list(params)
      setList(l.exercises)
    }catch(e:any){ setError('No se pudieron cargar los ejercicios'); }
    finally{ setLoading(false) }
  }

  const loadHistory = async () => {
    setHistoryLoading(true)
    try{
      const h = await exercisesService.history({ limit: 200 })
      setHistory(h.history || [])
    }catch{}
    finally{ setHistoryLoading(false) }
  }

  useEffect(()=>{ load(typeFilter) }, [typeFilter])
  useEffect(()=>{ loadHistory() },[])

  const showDetails = async (ex: Exercise) => {
    try{
  const d = await exercisesService.getById(ex.id, { skipErrorToast: true })
      const steps = (d.instructions && d.instructions.length)
        ? `<ol style="text-align:left;line-height:1.6;margin:10px 0;padding-left:20px;">${d.instructions.map((s: string)=>`<li>${s}</li>`).join('')}</ol>`
        : '<div style="color:#64748b">Sin instrucciones detalladas</div>'

      const html = `
        <div style="text-align:left"> 
          <div style="display:flex; gap:8px; align-items:center; margin-bottom:8px;">
            <span style="background:#eef2ff;border-radius:999px;width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;">${ex.icon || circleEmoji(ex.type)}</span>
            <span class="swal2-html-container" style="margin:0;padding:0"><strong>${d.type}</strong> · ${d.durationMinutes ?? '—'} min</span>
          </div>
          ${steps}
        </div>`

      const result = await Swal.fire({
        title: d.title,
        html,
        showCancelButton: true,
        confirmButtonText: 'Comenzar ahora',
        cancelButtonText: 'Cerrar',
        focusConfirm: false,
        width: 620
      })

      if(result.isConfirmed){
        await handleComplete(ex, d)
      }
    }catch(err:any){
      await showApiError(err, { title: 'No se pudo cargar el detalle' })
    }
  }

  const handleComplete = async (ex: Exercise, detail?: any) => {
    try{
      const d = detail ?? await exercisesService.getById(ex.id)
      const { value: durationStr, isConfirmed } = await Swal.fire({
        title: 'Marcar como completado',
        text: 'Confirma la duración (minutos) antes de completar',
        input: 'number',
        inputValue: d?.durationMinutes ?? exDurationGuess(d),
        inputAttributes: { min: '1', max: '90', step: '1' },
        showCancelButton: true,
        confirmButtonText: 'Completar',
        cancelButtonText: 'Cancelar'
      })

      if(!isConfirmed) return
      const durationMinutes = Math.max(1, Math.min(90, Number(durationStr) || exDurationGuess(d)))
      // Optimismo: añadir entrada temporal en history
      const temp = { id: 'temp-'+Date.now(), exerciseId: ex.id, durationMinutes, completedAt: new Date().toISOString() }
      setHistory(h => [temp, ...h])
      try{
        await exercisesService.complete(ex.id, { durationMinutes, rating: 5 }, { skipErrorToast: true })
        await Swal.fire({ icon:'success', title:'¡Listo!', text:'Ejercicio completado 🎉', timer: 1400, showConfirmButton:false })
        // recargar history para datos reales
        loadHistory()
      }catch(err:any){
        // revertir temp
        setHistory(h => h.filter(x => x !== temp))
        throw err
      }
    }catch(err:any){
      await showApiError(err, { title: 'No se pudo completar el ejercicio' })
    }
  }

  const exDurationGuess = (d:any) => Math.max(5, Math.min(20, d?.durationMinutes || 10))

  const circleEmoji = (type: Exercise['type']) => {
    if(type === 'respiracion') return '🫧'
    if(type === 'estiramiento') return '🤸'
    return '🧘'
  }

  const filtered = useMemo(() => {
    let base = list
    if(query.trim()){
      const q = query.toLowerCase()
      base = base.filter(ex => (
        ex.title.toLowerCase().includes(q) ||
        ex.description.toLowerCase().includes(q)
      ))
    }
    if(sort === 'title') base = [...base].sort((a,b)=> a.title.localeCompare(b.title))
    if(sort === 'duration') base = [...base].sort((a,b)=> (a.durationMinutes ?? 0) - (b.durationMinutes ?? 0))
    return base
  }, [list, query, sort])

  // streak: contar días consecutivos con al menos una entrada
  const streak = useMemo(()=>{
    const dates = Array.from(new Set(history.map(h => (h.completedAt || h.date || h.createdAt || '').slice(0,10)))).sort((a,b)=> b.localeCompare(a))
    let count = 0
    let cursor = new Date()
    const fmt = (d:Date)=> d.toISOString().slice(0,10)
    for(const day of dates){
      if(day === fmt(cursor)){
        count++
        cursor.setDate(cursor.getDate()-1)
      } else break
    }
    return count
  },[history])

  const totalCompleted = history.length

  const TypeChip = ({t,label}:{t:'all'|Exercise['type']; label:string}) => (
    <button
      className={`chip ${typeFilter===t ? 'is-active' : ''}`}
      onClick={()=> setTypeFilter(t)}
      aria-pressed={typeFilter===t}
    >{label}</button>
  )

  return (
    <PageLayout title="Ejercicios de Bienestar">
      <section className="stat-card" style={{marginBottom:16}}>
        <div className="ex-toolbar" style={{flexWrap:'wrap'}}>
          <div className="ex-tabs" role="tablist" aria-label="Filtrar por tipo">
            <TypeChip t="all" label="Todos" />
            <TypeChip t="meditacion" label="Meditación" />
            <TypeChip t="respiracion" label="Respiración" />
            <TypeChip t="estiramiento" label="Estiramiento" />
          </div>
          <div className="ex-search-wrap">
            <input
              value={query}
              onChange={(e)=> setQuery(e.target.value)}
              className="ex-search"
              placeholder="Buscar ejercicios..."
              aria-label="Buscar ejercicios"
            />
          </div>
          <div style={{display:'flex', gap:8}}>
            <button className={`chip ${sort==='title'?'is-active':''}`} onClick={()=> setSort('title')}>A-Z</button>
            <button className={`chip ${sort==='duration'?'is-active':''}`} onClick={()=> setSort('duration')}>Duración</button>
          </div>
        </div>

        <div style={{display:'flex', gap:14, flexWrap:'wrap', marginBottom:12}} aria-label="Resumen de progreso">
          <div className="summary-card" style={{flex:'1 1 160px', minWidth:160}}>
            <div className="summary-title">Completados</div>
            <div className="summary-value" style={{fontSize:28}}>{totalCompleted}</div>
            <div className="summary-sub">Total en historial{historyLoading?'…':''}</div>
          </div>
          <div className="summary-card" style={{flex:'1 1 160px', minWidth:160}}>
            <div className="summary-title">Racha</div>
            <div className="summary-value" style={{fontSize:28}}>{streak}d</div>
            <div className="summary-sub">Días consecutivos</div>
          </div>
        </div>

        {error && !loading && (
          <div style={{marginBottom:12, background:'#fef2f2', color:'#b91c1c', padding:'10px 12px', borderRadius:8, fontSize:13}}>
            {error} <button onClick={()=> load()} style={{marginLeft:8, background:'transparent', border:'none', color:'#b91c1c', textDecoration:'underline', cursor:'pointer'}}>Reintentar</button>
          </div>
        )}

        {loading ? (
          <div className="exercise-grid skeleton-grid">
            {Array.from({length:6}).map((_,i)=> (
              <div key={i} className="exercise-card skeleton-card"></div>
            ))}
          </div>
        ) : (
          <div className="exercise-grid">
            {filtered.map(ex => (
              <div key={ex.id} className="exercise-card" role="article">
                <div className="exercise-icon"><span aria-hidden>{ex.icon || circleEmoji(ex.type)}</span></div>
                <div className="exercise-title">{ex.title}</div>
                <div className="exercise-meta">
                  <span className={`chip chip--type`}>{ex.type}</span>
                  <span className="chip chip--time">{ex.durationMinutes ?? 10} min</span>
                </div>
                <div className="exercise-desc">{ex.description}</div>
                <div className="exercise-actions">
                  <button className="exercise-btn" onClick={()=> handleComplete(ex)}>Comenzar</button>
                  <button className="ghost-btn" onClick={()=> showDetails(ex)}>Ver detalles</button>
                </div>
              </div>
            ))}
            {!filtered.length && (
              <div className="chart-placeholder" style={{gridColumn:'1/-1'}}>Sin resultados</div>
            )}
          </div>
        )}
      </section>
    </PageLayout>
  )
}
