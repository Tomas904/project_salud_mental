import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import AppBrand from '../AppBrand'

export default function Sidebar(){
  const [collapsed, setCollapsed] = useState<boolean>(()=>{
    try{ return localStorage.getItem('sidebar-collapsed') === '1' }catch(e){ return false }
  })

  useEffect(()=>{ try{ localStorage.setItem('sidebar-collapsed', collapsed ? '1' : '0') }catch(e){} },[collapsed])

  // mobile drawer state
  const [mobileOpen, setMobileOpen] = useState(false)
  const [savedCollapsed, setSavedCollapsed] = useState<boolean | null>(null)

  // prevent scrolling when mobile drawer open
  useEffect(()=>{
    if(mobileOpen){ document.body.style.overflow = 'hidden' } else { document.body.style.overflow = '' }
    return ()=>{ document.body.style.overflow = '' }
  },[mobileOpen])

  // close on Escape
  useEffect(()=>{
    const onKey = (e: KeyboardEvent) => { if(e.key === 'Escape') closeMobile() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  },[])


  type NavItem = { to: string; label: string; icon: string }

  const NAV_ITEMS: NavItem[] = [
    { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { to: '/graph', label: 'Gráfico', icon: '📈' },
    { to: '/journal', label: 'Desahogo', icon: '📝' },
    { to: '/exercises', label: 'Ejercicios', icon: '💪' },
    { to: '/challenges', label: 'Retos', icon: '🎯' },
    { to: '/tips', label: 'Consejos', icon: '💡' },
  ]

  const openMobile = () => {
    // save current collapsed preference and show expanded drawer
    setSavedCollapsed(collapsed)
    setCollapsed(false)
    setMobileOpen(true)
  }

  const closeMobile = () => {
    setMobileOpen(false)
    // restore previous collapsed preference if any
    if(savedCollapsed !== null){ setCollapsed(savedCollapsed); setSavedCollapsed(null) }
  }

  return (
    <>
      {/* mobile hamburger - visible via CSS on small screens */}
      <button className="mobile-hamburger" aria-label="Open menu" onClick={openMobile}>
        <span aria-hidden>☰</span>
      </button>

      <aside className={`sidebar ${collapsed? 'sidebar--collapsed':''} ${mobileOpen? 'sidebar--open':''}`} role="navigation" aria-label="Primary">
        <div className="sidebar-brand">
          {collapsed ? <div className="sidebar-logo" aria-hidden /> : <AppBrand compact={false} tag='' />}
        </div>

        <div className="sidebar-top">
          <button
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
            className="sidebar-toggle"
            onClick={()=>setCollapsed(s=>!s)}
          >
            <span className="sidebar-toggle-icon" aria-hidden>{collapsed ? '❯' : '❮'}</span>
            <span className="sr-only">{collapsed ? 'Expand sidebar' : 'Collapse sidebar'}</span>
          </button>
        </div>

        {!collapsed && (
          <div className="sidebar-user">
            <div className="user-avatar">J</div>
            <div className="user-name">Juan</div>
          </div>
        )}

        <nav className="sidebar-nav">
        {NAV_ITEMS.map(item=> (
          <NavLink
            key={item.to}
            to={item.to}
            className={({isActive}) => `sidebar-link ${isActive? 'is-active':''}`}
            data-label={item.label}
            title={item.label}
            aria-current={undefined}
          >
            <span className="sidebar-link-icon" aria-hidden>{item.icon}</span>
            <span className="sidebar-link-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      </aside>

      {/* overlay when in mobile open state */}
      {mobileOpen && <div className="sidebar-overlay" onClick={closeMobile} aria-hidden />}
    </>
  )
}
