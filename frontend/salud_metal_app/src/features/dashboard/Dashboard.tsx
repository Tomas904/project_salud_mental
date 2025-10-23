import Sidebar from '../../components/ui/Sidebar'
import StatCard from '../../components/ui/StatCard'
import QuickAction from '../../components/ui/QuickAction'
import Chart from '../../components/ui/Chart'

export default function Dashboard() {
  return (
    <div className="dashboard-root">
      <Sidebar />
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <div className="user-pill">Juan</div>
        </header>

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
                  <div className="mood-pct">85%</div>
                  <div className="mood-bar">
                    <div className="mood-bar-fill mood-fill-good" style={{ width: '85%' }} data-pct="85" />
                    <div className="mood-pct-badge">85%</div>
                  </div>
                </div>
              </div>

              <div className="mood-card">
                <div className="mood-emoji">😐</div>
                <div className="mood-info">
                  <div className="mood-name">Neutral</div>
                  <div className="mood-pct">10%</div>
                  <div className="mood-bar">
                    <div className="mood-bar-fill mood-fill-neutral" style={{ width: '10%' }} data-pct="10" />
                    <div className="mood-pct-badge">10%</div>
                  </div>
                </div>
              </div>

              <div className="mood-card">
                <div className="mood-emoji">🙁</div>
                <div className="mood-info">
                  <div className="mood-name">Negativo</div>
                  <div className="mood-pct">5%</div>
                  <div className="mood-bar">
                    <div className="mood-bar-fill mood-fill-bad" style={{ width: '5%' }} data-pct="5" />
                    <div className="mood-pct-badge">5%</div>
                  </div>
                </div>
              </div>
            </div>
          </StatCard>

          <StatCard title="Progreso semanal">
            <Chart data={[3,5,4,6,5,7,8]} />
          </StatCard>
        </section>

        <section className="quick-actions">
          <QuickAction icon={<span style={{fontSize:28}}>📖</span>} label="Zona de desahogo" description="Escribe lo que sientes" />
          <QuickAction icon={<span style={{fontSize:28}}>💪</span>} label="Ejercicios" description="Ejercicios breves" />
          <QuickAction icon={<span style={{fontSize:28}}>🎯</span>} label="Retos" description="Pequeños objetivos" />
        </section>

      </main>
    </div>
  )
}
