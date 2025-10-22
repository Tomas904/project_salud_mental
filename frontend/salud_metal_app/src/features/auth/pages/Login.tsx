// React import removed because the project uses the automatic JSX runtime
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import AppBrand from "../../../components/AppBrand";

type FormData = { email: string; password: string };

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm<FormData>();
  const { errors, isSubmitting } = formState;

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
      navigate("/");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Error al iniciar sesión";
      alert(msg);
    }
  };

  return (
    <div className="page-root">
      <div className="card">
        <AppBrand />
        <form onSubmit={handleSubmit(onSubmit)} className="card-form">
          <h1 className="card-title">Iniciar sesión</h1>

          <label className="field">
            <input
              placeholder="Correo"
              {...register("email", { required: "Correo requerido" })}
              className="field-input"
            />
            <span className="field-error">
              {errors.email?.message as string}
            </span>
          </label>

          <label className="field">
            <input
              type="password"
              placeholder="Contraseña"
              {...register("password", { required: "Contraseña requerida" })}
              className="field-input"
            />
            <span className="field-error">
              {errors.password?.message as string}
            </span>
          </label>

          <button type="submit" disabled={isSubmitting} className="primary-btn">
            {isSubmitting ? "Cargando..." : "Entrar"}
          </button>

          <p className="card-footer">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="link">
              Regístrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
