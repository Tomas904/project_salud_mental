export default function Chart({ data = [3,5,4,6,5,7,8] }: { data?: number[] }){
  // Simple sparkline-like line chart using SVG with entrance animation
  const width = 300
  const height = 90
  const padding = 8
  const max = Math.max(...data)
  const min = Math.min(...data)
  const pointsArr = data.map((v,i)=>{
    const x = padding + (i*(width-2*padding)/(data.length-1))
    const y = padding + ((max - v)*(height-2*padding)/(max-min||1))
    return { x, y }
  })
  const points = pointsArr.map(p=>`${p.x},${p.y}`).join(' ')

  return (
    <svg className="chart-svg" width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <polyline className="chart-line" points={points} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {pointsArr.map((p,i)=>{
        return <circle key={i} className="chart-point" cx={p.x} cy={p.y} r={3} fill="#2563eb" />
      })}
    </svg>
  )
}
