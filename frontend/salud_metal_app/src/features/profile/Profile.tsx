import { useEffect, useMemo, useState } from 'react'
import PageLayout from '../../components/layout/PageLayout'
import { useAuth } from '../../hooks/useAuth'
import { usersService } from '../../services/users'
import { notificationsService, type NotificationSettings } from '../../services/notifications'
import { statsService } from '../../services/stats'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import { showApiError, notifySuccess } from '../../utils/notify.ts'

export default function Profile(){
  const { user, refreshUser } = useAuth()
  const [settings, setSettings] = useState<NotificationSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<{ activeDays: number; completedChallenges: number; totalMedals: number }>({ activeDays: 0, completedChallenges: 0, totalMedals: 0 })

  const initials = useMemo(()=>{
    const name = user?.name || ''
    const parts = name.trim().split(/\s+/)
    return (parts[0]?.[0] || 'U').toUpperCase() + (parts[1]?.[0] ? parts[1][0].toUpperCase() : '')
  },[user?.name])

  const memberSince = useMemo(()=>{
    if(!user?.createdAt) return ''
    try{
      const d = new Date(user.createdAt)
      return d.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    }catch{ return '' }
  },[user?.createdAt])

  useEffect(()=>{
    const load = async () => {
      setLoading(true)
      try{
        const [s, cfg] = await Promise.all([
          statsService.getDashboard().then(r=> r.userStats),
          notificationsService.getSettings()
        ])
        setStats({ activeDays: s.activeDays, completedChallenges: s.completedChallenges, totalMedals: s.totalMedals })
        setSettings(cfg)
      }catch(e){ /* errores globales ya se notifican */ }
      finally{ setLoading(false) }
    }
    load()
  },[])

  const toggleDaily = async () => {
    if(!settings) return
    const newSettings = { ...settings, dailyReminder: !settings.dailyReminder }
    try{
      const res = await notificationsService.updateSettings(newSettings, { skipErrorToast: true })
      setSettings(res)
      notifySuccess(res.dailyReminder ? 'Recordatorios activados' : 'Recordatorios desactivados')
    }catch(err){ await showApiError(err, { title: 'No se pudo actualizar' }) }
  }

  const editProfile = async () => {
    const { value: form, isConfirmed } = await Swal.fire({
      title: 'Editar perfil',
      html: `
        <div style="display:grid;gap:8px;text-align:left">
          <label>Nombre</label>
          <input id="p-name" class="swal2-input" placeholder="Tu nombre" value="${escapeHtml(user?.name || '')}" />
          <label>Avatar URL (opcional)</label>
          <input id="p-avatar" class="swal2-input" placeholder="https://..." value="${escapeHtml(user?.avatarUrl || '')}" />
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => ({
        name: (document.getElementById('p-name') as HTMLInputElement)?.value || '',
        avatarUrl: (document.getElementById('p-avatar') as HTMLInputElement)?.value || ''
      })
    })
    if(!isConfirmed || !form) return

    try{
      await usersService.updateMe({ name: form.name, avatarUrl: form.avatarUrl || undefined }, { skipErrorToast: true })
      await refreshUser()
      await Swal.fire({ icon:'success', title:'Perfil actualizado', timer:1200, showConfirmButton:false })
    }catch(err){ await showApiError(err, { title: 'No se pudo actualizar' }) }
  }

  const changePassword = async () => {
    const { value: form, isConfirmed } = await Swal.fire({
      title: 'Cambiar contraseña',
      html: `
        <div style="display:grid;gap:8px;text-align:left">
          <label>Contraseña actual</label>
          <input id="cp-current" type="password" class="swal2-input" />
          <label>Nueva contraseña</label>
          <input id="cp-new" type="password" class="swal2-input" />
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => ({
        currentPassword: (document.getElementById('cp-current') as HTMLInputElement)?.value || '',
        newPassword: (document.getElementById('cp-new') as HTMLInputElement)?.value || ''
      })
    })
    if(!isConfirmed || !form) return
    try{
      await usersService.changePassword(form, { skipErrorToast: true })
      await Swal.fire({ icon:'success', title:'Contraseña actualizada', timer:1300, showConfirmButton:false })
    }catch(err){ await showApiError(err, { title: 'No se pudo actualizar' }) }
  }

  const editLanguage = async () => {
    const { value: lang, isConfirmed } = await Swal.fire<{ value: string }>({
      title: 'Idioma',
      input: 'select',
      inputOptions: { es: 'Español', en: 'Inglés' },
      inputValue: user?.language || 'es',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar'
    }) as any
    if(!isConfirmed) return
    try{
      await usersService.updateMe({ language: String(lang) as any }, { skipErrorToast: true })
      await refreshUser()
      await Swal.fire({ icon:'success', title:'Idioma actualizado', timer:1100, showConfirmButton:false })
    }catch(err){ await showApiError(err, { title: 'No se pudo actualizar' }) }
  }

  const editPrivacy = async () => {
    const current = localStorage.getItem('mh_privacy') || 'private'
    const { value: privacy, isConfirmed } = await Swal.fire<{ value: string }>({
      title: 'Privacidad',
      input: 'select',
      inputOptions: { private: 'Solo yo', friends: 'Amigos', public: 'Público' },
      inputValue: current,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar'
    }) as any
    if(!isConfirmed) return
    localStorage.setItem('mh_privacy', String(privacy))
    notifySuccess('Privacidad actualizada')
  }

  return (
    <PageLayout title="Mi Perfil">
      <section className="stat-card" style={{overflow:'hidden'}}>
        <div className="profile-banner">
          <div className="profile-avatar" aria-hidden>
            <span>{initials}</span>
          </div>
          <div className="profile-info">
            <div className="profile-name">{user?.name || 'Usuario'}</div>
            <div className="profile-email">{user?.email}</div>
            {memberSince && <div className="profile-since">Miembro desde {memberSince}</div>}
          </div>
          <div className="profile-stats">
            <div className="pstat"><div className="pstat-value">{stats.activeDays}</div><div className="pstat-label">Días activo</div></div>
            <div className="pstat"><div className="pstat-value">{stats.completedChallenges}</div><div className="pstat-label">Retos completados</div></div>
            <div className="pstat"><div className="pstat-value">{stats.totalMedals}</div><div className="pstat-label">Medallas</div></div>
          </div>
          <div className="profile-actions">
            <button className="ghost-btn" onClick={editProfile}>Editar perfil</button>
          </div>
        </div>
      </section>

      <section className="stat-card">
        <h3 className="stat-card-title">Configuración</h3>
        <div className="settings-list">
          <div className="setting-row">
            <div className="setting-info">
              <div className="setting-title">Notificaciones</div>
              <div className="setting-desc">Recibe recordatorios diarios</div>
            </div>
            <button className={`switch ${settings?.dailyReminder ? 'is-on':''}`} aria-pressed={!!settings?.dailyReminder} onClick={toggleDaily} disabled={loading}>
              <span className="switch-handle" />
            </button>
          </div>

          <button className="setting-row setting-row--btn" onClick={editPrivacy}>
            <div className="setting-info">
              <div className="setting-title">Privacidad</div>
              <div className="setting-desc">Controla quién puede ver tu actividad</div>
            </div>
            <span className="setting-arrow">›</span>
          </button>

          <button className="setting-row setting-row--btn" onClick={editLanguage}>
            <div className="setting-info">
              <div className="setting-title">Idioma</div>
              <div className="setting-desc">{user?.language === 'en' ? 'Inglés' : 'Español'}</div>
            </div>
            <span className="setting-arrow">›</span>
          </button>

          <button className="setting-row setting-row--btn" onClick={changePassword}>
            <div className="setting-info">
              <div className="setting-title">Cambiar contraseña</div>
              <div className="setting-desc">Actualiza tu contraseña</div>
            </div>
            <span className="setting-arrow">›</span>
          </button>
        </div>
      </section>
    </PageLayout>
  )
}

function escapeHtml(s: string){
  return s
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#039;')
}
