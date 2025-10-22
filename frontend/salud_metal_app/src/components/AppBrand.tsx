// Componente reutilizable para el logo, título y subtítulo de la app
interface AppBrandProps {
  name?: string;
  tag?: string;
}

export default function AppBrand({ name = "Mental Health App", tag = "For you and by you" }: AppBrandProps) {
  return (
    <div className="app-brand">
      <span className="app-logo" aria-label="Logo salud mental">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="24" fill="#6ee7b7"/>
          <path d="M24 34c-6-4-10-7.5-10-12a6 6 0 0 1 12 0 6 6 0 0 1 12 0c0 4.5-4 8-10 12z" fill="#3b82f6"/>
          <path d="M24 28c-3-2-5-3.5-5-6a3 3 0 0 1 6 0 3 3 0 0 1 6 0c0 2.5-2 4-5 6z" fill="#fff"/>
        </svg>
      </span>
      <div className="app-name">{name}</div>
      <div className="app-tag">{tag}</div>
    </div>
  );
}
