export default function StatCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="stat-card">
      <h3 className="stat-card-title">{title}</h3>
      <div className="stat-card-body">{children}</div>
    </div>
  )
}
