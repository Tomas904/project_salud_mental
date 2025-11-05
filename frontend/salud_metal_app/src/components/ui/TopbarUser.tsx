import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function TopbarUser(){
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current) return
      if (open && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onClick)
    window.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onClick); window.removeEventListener('keydown', onKey) }
  }, [open])

  return (
    <div className="topbar-user" ref={ref}>
      <button
        type="button"
        className="user-avatar-btn"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(s => !s)}
        title={user?.name ?? 'Usuario'}
      >
        {user?.avatarUrl ? (
          <img src={user.avatarUrl} alt={user?.name ?? 'Avatar'} className="user-avatar-img" />
        ) : (
          <span className="user-avatar-initials" aria-hidden>
            {(user?.name || 'U').trim().charAt(0).toUpperCase()}
          </span>
        )}
      </button>
      {open && (
        <div className="user-menu" role="menu">
          <div className="user-menu-header">
            <div className="um-name">{user?.name ?? 'Usuario'}</div>
            <div className="um-email">{user?.email ?? ''}</div>
          </div>
          <button type="button" className="user-menu-item" role="menuitem" onClick={() => { setOpen(false); navigate('/profile') }}>
            Perfil
          </button>
          <hr className="user-menu-sep" />
          <button type="button" className="user-menu-item user-menu-danger" role="menuitem" onClick={() => { logout(); setOpen(false) }}>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}
