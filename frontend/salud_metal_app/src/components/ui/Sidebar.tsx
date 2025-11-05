import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import AppBrand from '../AppBrand'
import { HomeIcon, SmileIcon, JournalIcon, DumbbellIcon, TargetIcon, BulbIcon, ChartIcon } from './icons.tsx'

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


  type NavItem = { to: string; label: string; icon: React.ReactNode }

  const NAV_ITEMS: NavItem[] = [
    { to: '/dashboard', label: 'Dashboard', icon: <HomeIcon /> },
    { to: '/graph', label: 'Gráfico', icon: <ChartIcon /> },
    { to: '/emotions', label: 'Emociones', icon: <SmileIcon /> },
    { to: '/journal', label: 'Zona Desahogo', icon: <JournalIcon /> },
    { to: '/exercises', label: 'Ejercicios', icon: <DumbbellIcon /> },
    { to: '/challenges', label: 'Retos', icon: <TargetIcon /> },
    { to: '/tips', label: 'Consejos', icon: <BulbIcon /> },
    // Vistas eliminadas: Medallas, Estadísticas, Notificaciones, Buscar
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

  // El cierre de sesión se maneja ahora desde el header superior (no en el sidebar)

  return (
    <>
      {/* mobile hamburger - visible via CSS on small screens */}
      <button className="mobile-hamburger" aria-label="Open menu" onClick={openMobile}>
        <span aria-hidden>☰</span>
      </button>

      <aside className={`sidebar ${collapsed? 'sidebar--collapsed':''} ${mobileOpen? 'sidebar--open':''}`} role="navigation" aria-label="Primary">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            {collapsed ? <div className="sidebar-logo" aria-hidden /> : <AppBrand compact={false} tag='' />}
          </div>
          <button
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
            className="sidebar-toggle"
            onClick={()=>setCollapsed(s=>!s)}
            title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
            <span className="sidebar-toggle-icon" aria-hidden>{collapsed ? '❯' : '❮'}</span>
            <span className="sr-only">{collapsed ? 'Expand sidebar' : 'Collapse sidebar'}</span>
          </button>
        </div>

        {/* Se retira la sección de usuario del sidebar, el avatar/logout vivirán en el header superior derecho */}

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

      {/* Se eliminó el botón de salir del pie del sidebar */}

      </aside>

      {/* overlay when in mobile open state */}
      {mobileOpen && <div className="sidebar-overlay" onClick={closeMobile} aria-hidden />}
    </>
  )
}
