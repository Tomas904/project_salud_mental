// React import removed because the project uses the automatic JSX runtime
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import AppBrand from '../../../components/AppBrand'

type FormData = { name: string; email: string; password: string; confirmPassword: string }

export default function Register() {
  const { register: signup } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState } = useForm<FormData>()
  const { errors, isSubmitting } = formState

  const onSubmit = async (data: FormData) => {
    if (data.password !== data.confirmPassword) return alert('Las contraseñas no coinciden')
    try {
      await signup({ name: data.name, email: data.email, password: data.password })
      navigate('/')
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Error registrando usuario'
      alert(msg)
    }
  }

  return (
    <div className="page-root">
      <div className="card">
        <AppBrand />
        <form onSubmit={handleSubmit(onSubmit)} className="card-form">
          <h1 className="card-title">Crear cuenta</h1>

          <label className="field">
            <input
              placeholder="Nombre"
              {...register('name', { required: 'Nombre requerido' })}
              className="field-input"
            />
            <span className="field-error">{errors.name?.message as string}</span>
          </label>

          <label className="field">
            <input
              placeholder="Correo"
              {...register('email', { required: 'Correo requerido' })}
              className="field-input"
            />
            <span className="field-error">{errors.email?.message as string}</span>
          </label>

          <label className="field">
            <input
              type="password"
              placeholder="Contraseña"
              {...register('password', { required: 'Contraseña requerida', minLength: 6 })}
              className="field-input"
            />
            <span className="field-error">{errors.password?.message as string}</span>
          </label>

          <label className="field">
            <input
              type="password"
              placeholder="Confirmar contraseña"
              {...register('confirmPassword', { required: 'Confirma tu contraseña' })}
              className="field-input"
            />
            <span className="field-error">{errors.confirmPassword?.message as string}</span>
          </label>

          <button type="submit" disabled={isSubmitting} className="primary-btn">
            {isSubmitting ? 'Cargando...' : 'Crear cuenta'}
          </button>

          <p className="card-footer">
            ¿Ya tienes cuenta? <Link to="/login" className="link">Iniciar sesión</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
