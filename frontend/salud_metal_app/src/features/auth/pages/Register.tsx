// React import removed because the project uses the automatic JSX runtime
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import AppBrand from '../../../components/AppBrand'
import Mascot from '../../../components/Mascot'

type FormData = { name: string; email: string; password: string; confirmPassword: string }

export default function Register() {
  const { register: signup } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState, setError, getValues } = useForm<FormData>()
  const { errors, isSubmitting } = formState

  const onSubmit = async (data: FormData) => {
    try {
      await signup({ name: data.name, email: data.email, password: data.password })
      navigate('/')
    } catch (err: any) {
      const api = err?.response?.data
      const details = api?.error?.details
      if (details && typeof details === 'object') {
        // Mapear errores de validación del backend a los campos
        Object.entries(details).forEach(([field, message]) => {
          setError(field as keyof FormData, { type: 'server', message: String(message) })
        })
        return
      }
      const msg = api?.error?.message || api?.message || 'Error registrando usuario'
      alert(msg)
    }
  }

  return (
    <div className="page-root">
      <div className="card card--with-mascot">
        <div className="card-grid">
          <div>
            <AppBrand />
            <form onSubmit={handleSubmit(onSubmit)} className="card-form">
              <h1 className="card-title">Crear cuenta</h1>

              <label className="field">
                <input
                  placeholder="Nombre"
                  {...register('name', {
                    required: 'Nombre requerido',
                    minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                    maxLength: { value: 100, message: 'Máximo 100 caracteres' }
                  })}
                  className="field-input"
                />
                <span className="field-error">{errors.name?.message as string}</span>
              </label>

              <label className="field">
                <input
                  placeholder="Correo"
                  {...register('email', {
                    required: 'Correo requerido',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email inválido' }
                  })}
                  className="field-input"
                />
                <span className="field-error">{errors.email?.message as string}</span>
              </label>

              <label className="field">
                <input
                  type="password"
                  placeholder="Contraseña"
                  {...register('password', {
                    required: 'Contraseña requerida',
                    minLength: { value: 8, message: 'Mínimo 8 caracteres' },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                      message: 'Debe incluir mayúsculas, minúsculas y números'
                    }
                  })}
                  className="field-input"
                />
                <span className="field-error">{errors.password?.message as string}</span>
              </label>

              <label className="field">
                <input
                  type="password"
                  placeholder="Confirmar contraseña"
                  {...register('confirmPassword', {
                    required: 'Confirma tu contraseña',
                    validate: (val) => val === getValues('password') || 'Las contraseñas no coinciden'
                  })}
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
          <div className="card-mascot">
            <Mascot message="Bienvenido!" />
          </div>
        </div>
      </div>
    </div>
  )
}
