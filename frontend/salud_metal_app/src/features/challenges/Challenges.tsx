import { useEffect, useState, useMemo } from 'react'
import PageLayout from '../../components/layout/PageLayout'
import { challengesService, type Challenge, type UserChallenge } from '../../services/challenges'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import { showApiError } from '../../utils/notify.ts'

export default function Challenges(){
  const [available, setAvailable] = useState<Challenge[]>([])
  const [mine, setMine] = useState<UserChallenge[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<'active'|'completed'|'all'>('active')

  const load = async () => {
    setLoading(true)
    try{
      const [a, m] = await Promise.all([
        challengesService.list({}),
        challengesService.myChallenges({ status })
      ])
      setAvailable(a.challenges)
      setMine(m.challenges)
    }finally{ setLoading(false) }
  }

  useEffect(()=>{ load() }, [status])

  const typeEmoji = (type?: string) => {
    switch(type){
      case 'weekly': return '📅'
      case 'monthly': return '🗓️'
      case 'daily': return '☀️'
      default: return '🎯'
    }
  }

  const start = async (challengeId: string) => {
    const confirm = await Swal.fire({
      title: 'Iniciar reto',
      text: '¿Quieres iniciar este reto ahora?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, iniciar',
      cancelButtonText: 'Cancelar'
    })
    if(!confirm.isConfirmed) return
    try{
  await challengesService.start(challengeId, { skipErrorToast: true })
      await Swal.fire({ icon:'success', title:'¡Reto iniciado!', timer:1200, showConfirmButton:false })
      await load()
    }catch(err:any){
      await showApiError(err, { title: 'No se pudo iniciar' })
    }
  }

  const complete = async (userChallengeId: string) => {
    const defaultDate = new Date().toISOString().slice(0,10)
    const { value: date, isConfirmed } = await Swal.fire({
      title: 'Completar día',
      html: `<input id="swal-date" type="date" class="swal2-input" value="${defaultDate}" aria-label="Fecha" />`,
      focusConfirm: false,
      preConfirm: () => (document.getElementById('swal-date') as HTMLInputElement)?.value || defaultDate,
      showCancelButton: true,
      confirmButtonText: 'Marcar completado',
      cancelButtonText: 'Cancelar'
    })
    if(!isConfirmed) return
    try{
  const res = await challengesService.completeDay(userChallengeId, String(date), { skipErrorToast: true })
      // Si el backend devuelve medalla, mostramos un mensaje especial
      if((res as any)?.medal){
        await Swal.fire({ icon:'success', title:'¡Reto completado! 🏆', text:'¡Has ganado una medalla!', timer:2000, showConfirmButton:false })
      }else{
        await Swal.fire({ icon:'success', title:'¡Día completado!', timer:1300, showConfirmButton:false })
      }
      await load()
    }catch(err:any){
      await showApiError(err, { title: 'No se pudo completar el día' })
    }
  }

  const abandon = async (userChallengeId: string) => {
    const confirm = await Swal.fire({
      title: 'Abandonar reto',
      text: '¿Seguro que deseas abandonar este reto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, abandonar',
      cancelButtonText: 'Cancelar'
    })
    if(!confirm.isConfirmed) return
    try{
  await challengesService.abandon(userChallengeId, { skipErrorToast: true })
      await Swal.fire({ icon:'success', title:'Reto abandonado', timer:1200, showConfirmButton:false })
      await load()
    }catch(err:any){
      await showApiError(err, { title: 'No se pudo abandonar' })
    }
  }

  const current = mine.find(m => !m.isCompleted)
  const daysDone = current?.currentDay ?? 0
  const daysGoal = current?.challenge?.durationDays ?? 7
  const pctWeek = Math.max(0, Math.min(100, Math.round((daysDone / daysGoal) * 100)))

  // Progreso visual en anillo
  const progressCircle = useMemo(()=>{
    const r = 42
    const circ = 2 * Math.PI * r
    const pct = (current?.progress ?? 0) / 100
    const dash = circ * pct
    return { r, circ, dash }
  },[current?.progress])

  const medals = [
    { key: 'first-week', label: 'Primera Semana', earned: daysDone >= 1 },
    { key: 'seven-days', label: '7 Días Seguidos', earned: daysDone >= 7 },
    { key: 'full-month', label: 'Mes Completo', earned: (current?.progress ?? 0) >= 100 || (daysDone >= 30) },
    { key: 'master', label: 'Maestro del Bienestar', earned: false },
  ]

  return (
    <PageLayout title="Retos Semanales">
      <section className="stat-card" style={{marginBottom:16}}>
        <div className="ex-toolbar">
          <div className="ex-tabs" role="tablist" aria-label="Filtrar por estado">
            {(['active','completed','all'] as const).map(s => (
              <button key={s} className={`chip ${status===s?'is-active':''}`} onClick={()=> setStatus(s)}>
                {s==='active'?'Activos': s==='completed'?'Completados':'Todos'}
              </button>
            ))}
          </div>
        </div>
        <div className="challenge-header">Reto de esta semana</div>
        {loading ? (
          <div className="chart-placeholder">Cargando...</div>
        ) : current ? (
          <>
            <div className="challenge-desc">{current.challenge?.description || current.challenge?.title}</div>
            <div style={{display:'flex', gap:18, alignItems:'center', flexWrap:'wrap'}}>
              <div className="challenge-progress" style={{flex:1, minWidth:200}}>
                <div className="challenge-bar">
                  <div className="challenge-fill" style={{width: pctWeek + '%'}} />
                </div>
                <div className="challenge-days">{daysDone}/{daysGoal} días</div>
              </div>
              <div style={{width:110, height:110, position:'relative'}} aria-label="Progreso total del reto">
                <svg width={110} height={110}>
                  <circle cx={55} cy={55} r={progressCircle.r} stroke="#e2e8f0" strokeWidth={10} fill="none" />
                  <circle
                    cx={55}
                    cy={55}
                    r={progressCircle.r}
                    stroke="#2563eb"
                    strokeWidth={10}
                    fill="none"
                    strokeDasharray={progressCircle.circ}
                    strokeDashoffset={progressCircle.circ - progressCircle.dash}
                    style={{transition:'stroke-dashoffset .6s ease'}}
                    strokeLinecap="round"
                  />
                  <text x="55" y="60" textAnchor="middle" fontSize="20" fontWeight="700" fill="#0f172a">{Math.round(current?.progress ?? 0)}%</text>
                </svg>
              </div>
            </div>
            <div className="week-strip" aria-label="Progreso semanal">
              {Array.from({length: daysGoal}).map((_,i)=> (
                <span key={i} className={`week-day ${i < daysDone ? 'is-done':''}`} />
              ))}
            </div>
            <div style={{display:'flex', gap:8, marginTop:10}}>
              <button className="primary-btn" style={{maxWidth:200}} onClick={()=> complete(current.id)}>Completar día</button>
              <button className="sidebar-link" onClick={()=> abandon(current.id)}>Abandonar</button>
            </div>
          </>
        ) : (
          <div className="chart-placeholder">Aún no tienes un reto activo. Elige uno abajo para comenzar.</div>
        )}
      </section>

      <section className="stat-card">
        <div className="challenge-header">Medallas Obtenidas</div>
        <div className="medals-grid">
          {medals.map(m => (
            <div key={m.key} className="medal-item">
              <div className={`medal ${m.earned? 'is-earned':''}`}>★</div>
              <div className="medal-label">{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="stat-card">
        <h3 className="stat-card-title">Retos disponibles</h3>
        {loading ? <div className="chart-placeholder">Cargando...</div> : (
          available && available.length > 0 ? (
            <div className="challenge-grid" role="list" aria-label="Listado de retos disponibles">
              {available.map(ch => (
                <article key={ch.id} role="listitem" className={`challenge-card challenge-card--${ch.type || 'other'}`} aria-label={`Reto ${ch.title}`}>
                  <header className="challenge-card-head">
                    <div className="challenge-emoji" aria-hidden="true">{typeEmoji(ch.type)}</div>
                    <h4 className="challenge-title">{ch.title}</h4>
                  </header>
                  {ch.description && (
                    <p className="challenge-desc" style={{marginTop:4}}>{ch.description}</p>
                  )}
                  <div className="challenge-badges" aria-label="Información del reto">
                    <span className="badge" title={`Duración de ${ch.durationDays} días`}>{ch.durationDays} días</span>
                    {ch.type && <span className={`badge badge--${ch.type}`}>{ch.type}</span>}
                  </div>
                  <div className="challenge-actions" style={{justifyContent:'space-between', width:'100%'}}>
                    <button className="challenge-btn" onClick={()=> start(ch.id)}>Iniciar</button>
                    <button className="ghost-btn" onClick={()=> Swal.fire({title:ch.title, text: ch.description, icon:'info'})}>Ver</button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="chart-placeholder">No hay retos disponibles por ahora.</div>
          )
        )}
      </section>
    </PageLayout>
  )
}
