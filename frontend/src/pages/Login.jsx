import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      if (result.user.rol === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      setError(result.error || "Credenciales invalidas");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-base-200 rounded-2xl shadow-2xl border border-neutral/20 overflow-hidden">

          {/* Header strip */}
          <div className="bg-primary px-8 py-6 transform -skew-y-1">
            <div className="transform skew-y-1">
              <h1 className="text-3xl font-black text-primary-content uppercase tracking-tight">
                Iniciar Sesion
              </h1>
              <p className="text-primary-content/70 text-sm font-semibold mt-1">
                Bienvenido de vuelta a Crumbskate
              </p>
            </div>
          </div>

          {/* Form */}
          <form className="p-8 space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-error/10 border border-error/20 p-3 rounded-lg text-error text-xs font-bold uppercase tracking-tight text-center">
                {error}
              </div>
            )}

            <div className="form-control gap-1">
              <label className="label py-0">
                <span className="label-text font-bold uppercase tracking-widest text-xs text-base-content/70">
                  Email
                </span>
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="tu@email.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered bg-base-100 border-neutral/50 focus:border-primary transition-all w-full"
              />
            </div>

            <div className="form-control gap-1">
              <label className="label py-0">
                <span className="label-text font-bold uppercase tracking-widest text-xs text-base-content/70">
                  Contraseña
                </span>
              </label>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered bg-base-100 border-neutral/50 focus:border-primary transition-all w-full"
              />
              <label className="label py-0 mt-1">
                <a
                  href="#"
                  className="label-text-alt text-primary font-bold hover:underline uppercase tracking-widest text-xs"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </label>
            </div>

            <button
              id="login-submit"
              type="submit"
              className="btn bg-primary hover:bg-neutral text-primary-content font-black uppercase tracking-wider border-0 w-full rounded-sm shadow-lg mt-2"
            >
              Entrar
            </button>

            <div className="divider text-base-content/30 text-xs font-bold uppercase tracking-widest">
              ¿No tenes cuenta?
            </div>

            <a
              href="/registro"
              className="btn bg-base-100 hover:bg-neutral hover:text-neutral-content text-base-content font-black uppercase tracking-wider border border-neutral/40 w-full rounded-sm"
            >
              Crear cuenta gratis
            </a>
          </form>
        </div>

        {/* Back link */}
        <p className="text-center mt-6 text-base-content/40 text-xs font-bold uppercase tracking-widest">
          <a href="/" className="hover:text-primary transition-colors">
            Volver al inicio
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;

