import { useEffect, useState } from 'react'
import PageLayout from '../../components/layout/PageLayout'
import { tipsService, type Tip } from '../../services/tips'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

export default function Tips(){
  const [tips, setTips] = useState<Tip[]>([])
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  // filtro eliminado

  // Menú pequeño de videos recomendados (curado, sin llamadas externas)
  const videos: Array<{ id: string; title: string; minutes?: number }> = [
    { id: 'ZToicYcHIOU', title: 'Respiración consciente (Headspace)', minutes: 3 },
    { id: 'inpok4MKVLM', title: 'Meditación guiada para ansiedad', minutes: 10 },
    { id: 'O-6f5wQXSu8', title: 'Estiramientos suaves para iniciar el día', minutes: 7 },
    { id: 'U9YKY7fdwyg', title: 'Mindfulness en 5 minutos', minutes: 5 },
    { id: 'Jyy0ra2WcQQ', title: 'Técnica 4-7-8 para dormir mejor', minutes: 4 },
  ]

  const openVideo = async (v: { id: string; title: string }) => {
    const html = `
      <div style="position:relative;padding-top:56.25%;width:100%;">
        <iframe
          src="https://www.youtube.com/embed/${v.id}?autoplay=1"
          title="${v.title.replace(/"/g,'&quot;')}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;border-radius:10px;"
        ></iframe>
      </div>`
  await Swal.fire({ title: v.title, html, width: 'min(92vw, 820px)', showConfirmButton: false, showCloseButton: true })
  }

  const load = async () => {
    setLoading(true)
    try{
      const [t, f] = await Promise.all([
        tipsService.list(),
        tipsService.favorites()
      ])
      setTips(t.tips)
      setFavorites(f.favorites)
    }finally{ setLoading(false) }
  }

  useEffect(()=>{ load() }, [])

  const isFav = (tipId: string) => favorites.some(f => f.tipId === tipId)
  const toggleFav = async (tipId: string) => {
    if (isFav(tipId)) await tipsService.removeFavorite(tipId)
    else await tipsService.addFavorite(tipId)
    await load()
  }

  return (
    <PageLayout title="Consejos de Bienestar">
  <section className="stat-card video-carousel" style={{marginBottom:16}}>
        <h3 className="stat-card-title">Videos recomendados</h3>
        <div className="video-menu" role="list" aria-label="Videos relacionados">
          {videos.map(v => (
            <button
              key={v.id}
              role="listitem"
              className="video-item"
              onClick={()=> openVideo(v)}
              title={v.title}
            >
              <img src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`} alt="" className="video-thumb" loading="lazy" />
              <div className="video-meta">
                <div className="video-title">{v.title}</div>
                {v.minutes ? <div className="video-sub">{v.minutes} min</div> : null}
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="stat-card">
        {loading ? <div className="chart-placeholder">Cargando...</div> : (
          <ul className="tips-list">
            {tips.map(t => (
              <li key={t.id} className="tip-row">
                <div className="tip-content">
                  <div className="tip-title">{t.title}</div>
                  <div className="tip-desc">{t.description}</div>
                </div>
                <button
                  aria-label={isFav(t.id)? 'Quitar de favoritos':'Agregar a favoritos'}
                  className={`heart-btn ${isFav(t.id)?'is-fav':''}`}
                  onClick={()=> toggleFav(t.id)}
                  title={isFav(t.id)? 'Quitar de favoritos':'Agregar a favoritos'}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PageLayout>
  )
}
