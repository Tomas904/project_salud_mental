import TopbarUser from '../ui/TopbarUser'
import Sidebar from '../ui/Sidebar'

export default function PageLayout({ title, children }: { title: string; children: React.ReactNode }){
  return (
    <div className="dashboard-root">
      <Sidebar />
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>{title}</h1>
          <TopbarUser />
        </header>
        {children}
      </main>
    </div>
  )
}
