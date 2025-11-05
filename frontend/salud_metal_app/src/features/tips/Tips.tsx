import { useEffect, useState } from 'react'
import PageLayout from '../../components/layout/PageLayout'
import { tipsService, type Tip } from '../../services/tips'

export default function Tips(){
  const [tips, setTips] = useState<Tip[]>([])
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<string>('')

  const load = async () => {
    setLoading(true)
    try{
      const [t, f] = await Promise.all([
        tipsService.list(category ? { category } : undefined),
        tipsService.favorites()
      ])
      setTips(t.tips)
      setFavorites(f.favorites)
    }finally{ setLoading(false) }
  }

  useEffect(()=>{ load() }, [category])

  const isFav = (tipId: string) => favorites.some(f => f.tipId === tipId)
  const toggleFav = async (tipId: string) => {
    if (isFav(tipId)) await tipsService.removeFavorite(tipId)
    else await tipsService.addFavorite(tipId)
    await load()
  }

  const categories = ['', 'sueño','social','gratitud','ejercicio','digital','nutricion','mindfulness']

  return (
    <PageLayout title="Consejos">
      <section className="stat-card" style={{marginBottom:16}}>
        <div style={{display:'flex', gap:10, alignItems:'center'}}>
          <label>Filtrar por categoría:</label>
          <select className="field-input" value={category} onChange={(e)=> setCategory(e.target.value)} style={{maxWidth:240}}>
            {categories.map(c => <option key={c} value={c}>{c || 'Todas'}</option>)}
          </select>
        </div>
      </section>

      <section className="stat-card">
        <h3 className="stat-card-title">Lista</h3>
        {loading ? <div className="chart-placeholder">Cargando...</div> : (
          <div className="quick-actions">
            {tips.map(t => (
              <div key={t.id} className="quick-action" style={{alignItems:'flex-start'}}>
                <div className="quick-action-label" style={{display:'flex', gap:8, alignItems:'center'}}>
                  <span style={{fontSize:24}}>{t.icon || '💡'}</span>
                  <span>{t.title}</span>
                </div>
                <div className="quick-action-desc">{t.description}</div>
                <button className="sidebar-link" onClick={()=> toggleFav(t.id)} style={{marginTop:8}}>
                  {isFav(t.id) ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </PageLayout>
  )
}
