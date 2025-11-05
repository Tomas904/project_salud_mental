import { useEffect, useState } from 'react'
import PageLayout from '../../components/layout/PageLayout'
import { emotionsService } from '../../services/emotions'

function MultiLineChart({ series = [], labels = [] }: { series: { name: string; color: string; data: number[] }[]; labels?: string[] }){
  const width = 1000
  const height = 320
  const paddingLeft = 44 // más espacio a la izquierda para etiquetas Y
  const paddingRight = 28
  const paddingTop = 28
  const paddingBottom = 34
  const innerW = width - paddingLeft - paddingRight
  const innerH = height - paddingTop - paddingBottom

  // dominio fijo 0..10 para que coincida con el mock
  const minDomain = 0
  const maxDomain = 10

  const yFor = (v:number) => paddingTop + ((maxDomain - v) * innerH) / (maxDomain - minDomain)
  const xFor = (i:number, len:number) => paddingLeft + (i * innerW) / Math.max(1, len - 1)

  const pointsFor = (data: number[]) => data.map((v,i)=>({ x: xFor(i, data.length), y: yFor(v) }))

  const ticks = [2,4,6,8,10]
  const [tip, setTip] = useState<{x:number;y:number;label:string;value:number;color:string}|null>(null)

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="chart-svg">
      {/* grid Y y eje base */}
  <line x1={paddingLeft} x2={width - paddingRight} y1={yFor(0)} y2={yFor(0)} stroke="#e5e7eb" strokeWidth={1.25} />
      {ticks.map((t)=> (
        <g key={t}>
          <line x1={paddingLeft} x2={width - paddingRight} y1={yFor(t)} y2={yFor(t)} stroke="#eef2f6" strokeWidth={1} />
          <text x={paddingLeft - 12} y={yFor(t) + 4} fontSize={12} fill="#94a3b8" textAnchor="end">{t}</text>
        </g>
      ))}

      {series.map((s,si)=>{
        const pts = pointsFor(s.data)
        const d = pts.map(p=>`${p.x},${p.y}`).join(' ')
        return (
          <g key={si}>
            <polyline points={d} fill="none" stroke={s.color} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" className="chart-line" />
            {pts.map((p,pi)=> (
              <circle key={pi} cx={p.x} cy={p.y} r={5} fill={s.color} stroke="#fff" strokeWidth={1.5}
                onMouseEnter={()=> setTip({ x:p.x, y:p.y, label:s.name, value: s.data[pi], color: s.color })}
                onMouseLeave={()=> setTip(null)}
              />
            ))}
          </g>
        )
      })}

      {/* tooltip */}
      {tip && (
        <g className="chart-tooltip" transform={`translate(${Math.min(Math.max(tip.x, 60), width-80)}, ${Math.max(tip.y-28, 16)})`}>
          <rect x={-28} y={-22} rx={6} ry={6} width={90} height={28} fill="#fff" stroke="#e5e7eb" />
          <circle cx={-18} cy={-8} r={4} fill={tip.color} />
          <text x={-8} y={-6} fontSize={11} fill="#0f172a">{tip.label}: {tip.value}</text>
        </g>
      )}

      {/* x labels */}
      {labels && labels.map((lab,i)=>{
        const x = xFor(i, labels.length)
        return <text key={i} x={x} y={height - 6} fontSize={11} fill="#64748b" textAnchor="middle">{lab}</text>
      })}
    </svg>
  )
}

export default function Graph(){
  const [weekly, setWeekly] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    setLoading(true)
    emotionsService.getWeekly().then((w)=> setWeekly(w)).finally(()=> setLoading(false))
  }, [])

  const labels = (weekly?.emotions || []).map((d:any)=> d.day || '')
  const positives = (weekly?.emotions || []).map((d:any)=> d.positive ?? 0)
  const negatives = (weekly?.emotions || []).map((d:any)=> d.negative ?? 0)

  // Mostrar los promedios exactamente como vienen de BD (1 decimal)
  const avgPos = weekly?.summary?.averagePositive ?? 0
  const avgNeg = weekly?.summary?.averageNegative ?? 0
  const fmt1 = (n:number) => Number.isFinite(n as any) ? Number(n).toFixed(1) : '0.0'

  return (
    <PageLayout title="Gráfico Emocional Semanal">
      <section className="stat-card graph-card">
        <h3 className="stat-card-title">Emociones de la semana</h3>
        {loading || !weekly ? (
          <div className="chart-placeholder">Cargando...</div>
        ) : (
          <div>
            {/* Renderizamos primero la serie roja para que la verde quede por encima si coinciden y no se "oculte" */}
            <MultiLineChart series={[{ name:'Negativas', color:'#ef4444', data: negatives }, { name:'Positivas', color:'#10b981', data: positives }]} labels={labels} />

            <div className="graph-legend">
              <div className="legend-item"><span className="legend-dot" style={{background:'#10b981'}} /> Emociones Positivas</div>
              <div className="legend-item"><span className="legend-dot" style={{background:'#ef4444'}} /> Emociones Negativas</div>
            </div>
          </div>
        )}
      </section>

      <section className="summary-cards">
        <div className="summary-card summary-card--positive">
          <div className="summary-title">Emociones Positivas</div>
          <div className="summary-value summary-value--positive">{fmt1(avgPos)}</div>
          <div className="summary-sub">Promedio semanal</div>
        </div>
        <div className="summary-card summary-card--negative">
          <div className="summary-title">Emociones Negativas</div>
          <div className="summary-value summary-value--negative">{fmt1(avgNeg)}</div>
          <div className="summary-sub">Promedio semanal</div>
        </div>
      </section>
    </PageLayout>
  )
}
