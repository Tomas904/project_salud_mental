import { useEffect, useState } from 'react'
import PageLayout from '../../components/layout/PageLayout'
import { tipsService, type Tip } from '../../services/tips'

export default function Tips(){
  const [tips, setTips] = useState<Tip[]>([])
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  // filtro eliminado

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
