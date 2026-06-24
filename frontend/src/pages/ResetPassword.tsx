import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Enviando solicitud...');
    try {
      const response = await axios.post(`${process.env.VITE_API_URL}/auth/reset-password`, { email });
      if (response.data.success) {
        setStatus('✅ Email enviado. Revisa tu bandeja.');
        // Opcional: redirigir después de unos segundos
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setStatus(`⚠️ ${response.data.error || 'Error al enviar'}`);
      }
    } catch (err: any) {
      setStatus('⚠️ Error de conexión o servidor');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-base-200 border-2 border-black shadow-brutal">
        <h2 className="text-2xl font-impact text-primary-content uppercase mb-4 text-center">
          Restablecer contraseña
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label" htmlFor="reset-email">
              <span className="label-text text-xs font-impact uppercase">Email</span>
            </label>
            <input
              id="reset-email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="input w-full bg-base-300 border-2 border-primary/30 focus:border-primary"
            />
          </div>
          <button type="submit" className="w-full btn btn-primary font-impact uppercase">
            Enviar solicitud
          </button>
          {status && <p className="mt-2 text-center text-sm">{status}</p>}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
