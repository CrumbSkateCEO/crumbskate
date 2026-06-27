import { useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "../utils/apiUrl";

const NuevaContrasena = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setStatus("⚠️ Las contraseñas no coinciden.");
      return;
    }
    if (!/\d/.test(password)) {
      setStatus("⚠️ La contraseña debe incluir al menos un número.");
      return;
    }

    setStatus("Actualizando...");
    try {
      const response = await axios.post(`${getApiUrl()}/auth/reset-password/confirm`, {
        token,
        password,
      });
      if (response.data.success) {
        setStatus("✅ Contraseña actualizada. Redirigiendo...");
        setTimeout(() => navigate("/login"), 2500);
      } else {
        setStatus(`⚠️ ${response.data.error || "Error al actualizar"}`);
      }
    } catch {
      setStatus("⚠️ El enlace es inválido o expiró.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8 px-3">
      <div className="w-full max-w-md bg-base-200 border-2 sm:border-4 border-black shadow-brutal overflow-hidden">
        <div className="bg-primary px-4 sm:px-8 py-4 sm:py-6 border-b-2 sm:border-b-4 border-black transform -skew-y-1">
          <div className="transform skew-y-1">
            <h1 className="text-2xl sm:text-3xl font-impact text-primary-content uppercase tracking-[0.1em] sm:tracking-[0.2em]">
              Nueva contraseña
            </h1>
            <p className="text-primary-content/60 text-sm font-mono font-bold mt-1">
              Elegí una contraseña segura para tu cuenta
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-4 sm:space-y-5">
          <div className="form-control gap-1">
            <label className="label py-0" htmlFor="new-password">
              <span className="text-[10px] font-impact uppercase tracking-[0.3em] text-base-content/50">
                Nueva contraseña
              </span>
            </label>
            <input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full bg-base-300 border-2 border-primary/30 focus:border-primary text-base-content px-4 py-3 rounded-none font-mono text-sm tracking-wider outline-none transition-all"
            />
          </div>

          <div className="form-control gap-1">
            <label className="label py-0" htmlFor="confirm-password">
              <span className="text-[10px] font-impact uppercase tracking-[0.3em] text-base-content/50">
                Confirmar contraseña
              </span>
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={8}
              className="w-full bg-base-300 border-2 border-primary/30 focus:border-primary text-base-content px-4 py-3 rounded-none font-mono text-sm tracking-wider outline-none transition-all"
            />
          </div>

          {status && (
            <p
              className={`text-center text-sm font-mono ${
                status.startsWith("✅") ? "text-success" : "text-warning"
              }`}
            >
              {status}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-primary-content font-impact uppercase tracking-[0.2em] py-4 border-2 border-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            Guardar contraseña
          </button>

          <p className="text-center mt-2">
            <Link
              to="/login"
              className="text-primary font-impact hover:underline uppercase tracking-[0.2em] text-[10px]"
            >
              ← Volver al login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default NuevaContrasena;
