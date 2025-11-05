import { useEffect, useState } from 'react'
import PageLayout from '../../components/layout/PageLayout'
import { challengesService, type Challenge, type UserChallenge } from '../../services/challenges'

export default function Challenges(){
  const [available, setAvailable] = useState<Challenge[]>([])
  const [mine, setMine] = useState<UserChallenge[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try{
      const [a, m] = await Promise.all([
        challengesService.list({}),
        challengesService.myChallenges({ status: 'active' })
      ])
      setAvailable(a.challenges)
      setMine(m.challenges)
    }finally{ setLoading(false) }
  }

  useEffect(()=>{ load() }, [])

  const start = async (challengeId: string) => { await challengesService.start(challengeId); await load() }
  const complete = async (userChallengeId: string) => { const today = new Date().toISOString().slice(0,10); await challengesService.completeDay(userChallengeId, today); await load() }
  const abandon = async (userChallengeId: string) => { await challengesService.abandon(userChallengeId); await load() }

  return (
    <PageLayout title="Retos">
      <section className="stat-card" style={{marginBottom:16}}>
        <h3 className="stat-card-title">Mis retos activos</h3>
        {loading ? <div className="chart-placeholder">Cargando...</div> : (
          <div className="quick-actions">
            {mine.map(rc => (
              <div key={rc.id} className="quick-action" style={{alignItems:'flex-start'}}>
                <div className="quick-action-label">{rc.challenge.title}</div>
                <div className="quick-action-desc">Progreso: {rc.progress}% · Día actual: {rc.currentDay}</div>
                <div style={{display:'flex', gap:8, marginTop:8}}>
                  <button className="sidebar-link" onClick={()=> complete(rc.id)}>Completar día</button>
                  <button className="sidebar-link" onClick={()=> abandon(rc.id)}>Abandonar</button>
                </div>
              </div>
            ))}
            {mine.length === 0 && <div className="chart-placeholder">Aún no tienes retos activos</div>}
          </div>
        )}
      </section>

      <section className="stat-card">
        <h3 className="stat-card-title">Retos disponibles</h3>
        {loading ? <div className="chart-placeholder">Cargando...</div> : (
          <div className="quick-actions">
            {available.map(ch => (
              <div key={ch.id} className="quick-action" style={{alignItems:'flex-start'}}>
                <div className="quick-action-label">{ch.title}</div>
                <div className="quick-action-desc">{ch.description}</div>
                <div className="quick-action-desc">Duración: {ch.durationDays} días · Tipo: {ch.type}</div>
                <button className="sidebar-link" onClick={()=> start(ch.id)} style={{marginTop:8}}>Iniciar</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </PageLayout>
  )
}
