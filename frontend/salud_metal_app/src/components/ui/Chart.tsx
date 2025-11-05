export default function Chart({ data = [3,5,4,6,5,7,8], labels }: { data?: number[]; labels?: string[] }){
  // Simple sparkline-like line chart using SVG with labels under the x axis
  const width = 300
  const height = 106 // compact height with label room
  const padding = 10
  const labelSpace = 16
  const max = Math.max(...data)
  const min = Math.min(...data)
  const innerHeight = height - labelSpace

  const pointsArr = data.map((v,i)=>{
    const x = padding + (i*(width-2*padding)/(data.length-1))
    const y = padding + ((max - v)*(innerHeight-2*padding)/(max-min||1))
    return { x, y }
  })
  const points = pointsArr.map(p=>`${p.x},${p.y}`).join(' ')

  return (
    <svg className="chart-svg" width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {/* faint x axis */}
      <line x1={padding} y1={innerHeight + padding} x2={width - padding} y2={innerHeight + padding} stroke="#eef2f6" strokeWidth={1} />

      <polyline className="chart-line" points={points} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {pointsArr.map((p,i)=>{
        return <circle key={i} className="chart-point" cx={p.x} cy={p.y} r={3} fill="#2563eb" />
      })}

      {/* x axis labels */}
      {Array.isArray(labels) && labels.length === data.length && labels.map((lab, i) => {
        const x = pointsArr[i]?.x ?? (padding + (i*(width-2*padding)/(data.length-1)))
        return (
          <text key={i} x={x} y={height - 2} fontSize={11} fill="#64748b" textAnchor="middle" style={{ fontFamily: 'Inter, system-ui, -apple-system, Roboto, Arial' }}>{lab}</text>
        )
      })}
    </svg>
  )
}
