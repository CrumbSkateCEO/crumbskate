import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { getApiUrl } from '../utils/apiUrl';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Enviando solicitud...');
    try {
      const response = await axios.post(`${getApiUrl()}/auth/reset-password`, { email });
      if (response.data.success) {
        setStatus('✅ Email enviado. Revisa tu bandeja.');
        // Opcional: redirigir después de unos segundos
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setStatus(`⚠️ ${response.data.error || 'Error al enviar'}`);
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      setStatus(`⚠️ ${axiosErr.response?.data?.error || 'Error de conexión o servidor'}`);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8 px-3">
      <div className="w-full max-w-md bg-base-200 border-2 sm:border-4 border-black shadow-brutal overflow-hidden">
        {/* Header strip */}
        <div className="bg-primary px-4 sm:px-8 py-4 sm:py-6 border-b-2 sm:border-b-4 border-black transform -skew-y-1">
          <div className="transform skew-y-1">
            <h1 className="text-2xl sm:text-3xl font-impact text-primary-content uppercase tracking-[0.1em] sm:tracking-[0.2em]">
              Restablecer contraseña
            </h1>
            <p className="text-primary-content/60 text-sm font-mono font-bold mt-1">
              Te enviaremos un email para recuperar tu cuenta
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-4 sm:space-y-5">
          <div className="form-control gap-1">
            <label className="label py-0" htmlFor="reset-email">
              <span className="text-[10px] font-impact uppercase tracking-[0.3em] text-base-content/50">Email</span>
            </label>
            <input
              id="reset-email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-base-300 border-2 border-primary/30 focus:border-primary text-base-content px-4 py-3 rounded-none font-mono text-sm tracking-wider outline-none transition-all placeholder:text-base-content/20"
            />
          </div>

          {status && (
            <p className={`text-center text-sm font-mono ${
              status.startsWith('✅') ? 'text-success' : 'text-warning'
            }`}>
              {status}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-primary-content font-impact uppercase tracking-[0.2em] py-4 border-2 border-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            Enviar solicitud
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

export default ResetPassword;
