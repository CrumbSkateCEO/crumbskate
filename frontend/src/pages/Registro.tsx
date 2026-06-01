import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Registro = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nombre || !apellido || !email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const nombreCompleto = `${nombre} ${apellido}`;
    const result = await register({ nombre: nombreCompleto, email, password });

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || "Error al crear la cuenta.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[80vh] flex items-center justify-center py-8 sm:py-16 px-3 sm:px-4"
    >
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-base-200 border-2 sm:border-4 border-black shadow-brutal overflow-hidden">
          {/* Header strip */}
          <div className="bg-primary px-4 sm:px-8 py-4 sm:py-6 border-b-2 sm:border-b-4 border-black transform -skew-y-1">
            <div className="transform skew-y-1">
              <h1 className="text-2xl sm:text-3xl font-impact text-primary-content uppercase tracking-[0.1em] sm:tracking-[0.2em]">
                Crear cuenta
              </h1>
              <p className="text-primary-content/60 text-sm font-mono font-bold mt-1">
                Unite a la comunidad Crumbskate
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            className="p-4 sm:p-8 space-y-4 sm:space-y-5"
            onSubmit={handleSubmit}
          >
            {error && (
              <div className="bg-error/10 border-2 border-error p-3 text-error text-xs font-impact uppercase tracking-wider text-center">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control gap-1">
                <label className="label py-0">
                  <span className="text-[10px] font-impact uppercase tracking-[0.3em] text-base-content/50">
                    Nombre
                  </span>
                </label>
                <input
                  id="register-nombre"
                  type="text"
                  placeholder="Juan"
                  autoComplete="given-name"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full bg-base-300 border-2 border-primary/30 focus:border-primary text-base-content px-4 py-3 rounded-none font-mono text-sm tracking-wider outline-none transition-all placeholder:text-base-content/20"
                />
              </div>
              <div className="form-control gap-1">
                <label className="label py-0">
                  <span className="text-[10px] font-impact uppercase tracking-[0.3em] text-base-content/50">
                    Apellido
                  </span>
                </label>
                <input
                  id="register-apellido"
                  type="text"
                  placeholder="García"
                  autoComplete="family-name"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  className="w-full bg-base-300 border-2 border-primary/30 focus:border-primary text-base-content px-4 py-3 rounded-none font-mono text-sm tracking-wider outline-none transition-all placeholder:text-base-content/20"
                />
              </div>
            </div>

            <div className="form-control gap-1">
              <label className="label py-0">
                <span className="text-[10px] font-impact uppercase tracking-[0.3em] text-base-content/50">
                  Email
                </span>
              </label>
              <input
                id="register-email"
                type="email"
                placeholder="tu@email.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-base-300 border-2 border-primary/30 focus:border-primary text-base-content px-4 py-3 rounded-none font-mono text-sm tracking-wider outline-none transition-all placeholder:text-base-content/20"
              />
            </div>

            <div className="form-control gap-1">
              <label className="label py-0">
                <span className="text-[10px] font-impact uppercase tracking-[0.3em] text-base-content/50">
                  Contraseña
                </span>
              </label>
              <input
                id="register-password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-base-300 border-2 border-primary/30 focus:border-primary text-base-content px-4 py-3 rounded-none font-mono text-sm tracking-wider outline-none transition-all placeholder:text-base-content/20"
              />
            </div>

            <div className="form-control gap-1">
              <label className="label py-0">
                <span className="text-[10px] font-impact uppercase tracking-[0.3em] text-base-content/50">
                  Confirmar contraseña
                </span>
              </label>
              <input
                id="register-password-confirm"
                type="password"
                placeholder="Repetí la contraseña"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-base-300 border-2 border-primary/30 focus:border-primary text-base-content px-4 py-3 rounded-none font-mono text-sm tracking-wider outline-none transition-all placeholder:text-base-content/20"
              />
            </div>

            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3 py-0">
                <input
                  id="register-terms"
                  type="checkbox"
                  className="checkbox checkbox-sm border-2 border-primary/30 rounded-none [--chkbg:theme(colors.primary)] [--chkfg:white]"
                />
                <span className="text-base-content/60 text-xs font-mono">
                  Acepto los{" "}
                  <a
                    href="#"
                    className="text-base-content font-bold hover:underline"
                  >
                    términos y condiciones
                  </a>
                </span>
              </label>
            </div>

            <button
              id="register-submit"
              type="submit"
              className="w-full bg-primary text-primary-content font-impact uppercase tracking-[0.2em] py-4 border-2 border-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              Crear cuenta
            </button>

            <div className="flex items-center gap-4 my-4">
              <div className="flex-1 border-t-2 border-base-300"></div>
              <span className="text-[10px] font-impact text-base-content/30 uppercase tracking-[0.3em]">
                ¿Ya tenés cuenta?
              </span>
              <div className="flex-1 border-t-2 border-base-300"></div>
            </div>

            <a
              href="/login"
              className="block w-full text-center bg-base-300 text-base-content font-impact uppercase tracking-[0.2em] py-4 border-2 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all"
            >
              Iniciar sesión
            </a>
          </form>
        </div>

        {/* Back link */}
        <p className="text-center mt-6 text-base-content/40 text-xs font-mono font-bold uppercase tracking-widest">
          <a href="/" className="hover:text-base-content transition-colors">
            ← Volver al inicio
          </a>
        </p>
      </div>
    </motion.div>
  );
};

export default Registro;
