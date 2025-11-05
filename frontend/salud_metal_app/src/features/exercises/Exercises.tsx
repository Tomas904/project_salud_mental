import { useEffect, useMemo, useState } from 'react'
import PageLayout from '../../components/layout/PageLayout'
import { exercisesService, type Exercise } from '../../services/exercises'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import { showApiError } from '../../utils/notify.ts'

export default function Exercises(){
  const [list, setList] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState<'all' | Exercise['type']>('all')
  const [query, setQuery] = useState('')

  const load = async (type: 'all' | Exercise['type'] = typeFilter) => {
    setLoading(true)
    try{
      const params = type === 'all' ? undefined : { type }
      const l = await exercisesService.list(params)
      setList(l.exercises)
    }finally{ setLoading(false) }
  }

  useEffect(()=>{ load(typeFilter) }, [typeFilter])

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
      await exercisesService.complete(ex.id, { durationMinutes, rating: 5 }, { skipErrorToast: true })
      await Swal.fire({ icon:'success', title:'¡Listo!', text:'Ejercicio completado 🎉', timer: 1400, showConfirmButton:false })
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
    if(!query.trim()) return list
    const q = query.toLowerCase()
    return list.filter(ex => (
      ex.title.toLowerCase().includes(q) ||
      ex.description.toLowerCase().includes(q)
    ))
  }, [list, query])

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
        <div className="ex-toolbar">
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
        </div>

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
