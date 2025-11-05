import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatCard from '../../components/ui/StatCard'
import QuickAction from '../../components/ui/QuickAction'
import Chart from '../../components/ui/Chart'
import { statsService, type DashboardStats } from '../../services/stats'
import { emotionsService } from '../../services/emotions'
import PageLayout from '../../components/layout/PageLayout'

export default function Dashboard() {
  const [dash, setDash] = useState<DashboardStats | null>(null)
  const [weeklyData, setWeeklyData] = useState<number[] | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    statsService.getDashboard().then((d) => { if (mounted) setDash(d) }).catch(() => {})
    emotionsService.getWeekly().then((w) => {
      // mapear a valores positivos por día para el Chart
      const arr = Array.isArray(w?.emotions) ? w.emotions.map((e: any) => e.positive ?? 0) : []
      setWeeklyData(arr)
    }).catch(() => {})
    return () => { mounted = false }
  }, [])


  const pos = dash?.emotionalStatus?.positive ?? 85
  const neu = dash?.emotionalStatus?.neutral ?? 10
  const neg = dash?.emotionalStatus?.negative ?? 5
  const chartData = weeklyData ?? [3,5,4,6,5,7,8]
  // etiquetas de los últimos N días (en español, abreviado)
  const chartLabels = (() => {
    const n = chartData.length
    const fmt = new Intl.DateTimeFormat('es-ES', { weekday: 'short' })
    const arr: string[] = []
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const lab = fmt.format(d)
      // capitalizar inicial para mejorar legibilidad (p.ej. 'Mié')
      arr.push(lab.charAt(0).toUpperCase() + lab.slice(1))
    }
    return arr
  })()

  return (
    <PageLayout title="Dashboard">

        <section className="dashboard-banner">
          <div className="banner-content">
            <h2>¿Cómo te sientes hoy?</h2>
            <p>Registra tu emoción del día</p>
          </div>
          <div className="banner-emoji">😊</div>
        </section>

        <section className="dashboard-grid">
          <StatCard title="Estado emocional actual">
            <div className="moods">
              <div className="mood-card">
                <div className="mood-emoji">🙂</div>
                <div className="mood-info">
                  <div className="mood-name">Positivo</div>
                  <div className="mood-pct">{pos}%</div>
                  <div className="mood-bar">
                    <div className="mood-bar-fill mood-fill-good" style={{ width: `${pos}%` }} data-pct={String(pos)} />
                    <div className="mood-pct-badge">{pos}%</div>
                  </div>
                </div>
              </div>

              <div className="mood-card">
                <div className="mood-emoji">😐</div>
                <div className="mood-info">
                  <div className="mood-name">Neutral</div>
                  <div className="mood-pct">{neu}%</div>
                  <div className="mood-bar">
                    <div className="mood-bar-fill mood-fill-neutral" style={{ width: `${neu}%` }} data-pct={String(neu)} />
                    <div className="mood-pct-badge">{neu}%</div>
                  </div>
                </div>
              </div>

              <div className="mood-card">
                <div className="mood-emoji">🙁</div>
                <div className="mood-info">
                  <div className="mood-name">Negativo</div>
                  <div className="mood-pct">{neg}%</div>
                  <div className="mood-bar">
                    <div className="mood-bar-fill mood-fill-bad" style={{ width: `${neg}%` }} data-pct={String(neg)} />
                    <div className="mood-pct-badge">{neg}%</div>
                  </div>
                </div>
              </div>
            </div>
          </StatCard>

          <StatCard title="Progreso semanal">
            <Chart data={chartData} labels={chartLabels} />
          </StatCard>
        </section>

        <section className="quick-actions">
          <QuickAction
            icon={<span style={{fontSize:28}}>📖</span>}
            label="Zona de desahogo"
            description="Escribe lo que sientes"
            onClick={() => navigate('/journal')}
          />
          <QuickAction
            icon={<span style={{fontSize:28}}>💪</span>}
            label="Ejercicios"
            description="Ejercicios breves"
            onClick={() => navigate('/exercises')}
          />
          <QuickAction
            icon={<span style={{fontSize:28}}>🎯</span>}
            label="Retos"
            description="Pequeños objetivos"
            onClick={() => navigate('/challenges')}
          />
        </section>

    </PageLayout>
  )
}
