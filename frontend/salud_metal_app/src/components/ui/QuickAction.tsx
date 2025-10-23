export default function QuickAction({ icon, label, description, onClick }: { icon: React.ReactNode; label: string; description?: string; onClick?: () => void }) {
  return (
    <button className="quick-action" onClick={onClick}>
      <div className="quick-action-icon">{icon}</div>
      <div className="quick-action-label">{label}</div>
      {description && <div className="quick-action-desc">{description}</div>}
    </button>
  )
}
