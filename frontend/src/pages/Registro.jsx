const Registro = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-base-200 rounded-2xl shadow-2xl border border-neutral/20 overflow-hidden">

          {/* Header strip */}
          <div className="bg-primary px-8 py-6 transform -skew-y-1">
            <div className="transform skew-y-1">
              <h1 className="text-3xl font-black text-primary-content uppercase tracking-tight">
                Crear cuenta
              </h1>
              <p className="text-primary-content/70 text-sm font-semibold mt-1">
                Unite a la comunidad Crumbskate
              </p>
            </div>
          </div>

          {/* Form */}
          <form className="p-8 space-y-5" onSubmit={(e) => e.preventDefault()}>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control gap-1">
                <label className="label py-0">
                  <span className="label-text font-bold uppercase tracking-widest text-xs text-base-content/70">
                    Nombre
                  </span>
                </label>
                <input
                  id="register-nombre"
                  type="text"
                  placeholder="Juan"
                  autoComplete="given-name"
                  className="input input-bordered bg-base-100 border-neutral/50 focus:border-primary transition-all w-full"
                />
              </div>
              <div className="form-control gap-1">
                <label className="label py-0">
                  <span className="label-text font-bold uppercase tracking-widest text-xs text-base-content/70">
                    Apellido
                  </span>
                </label>
                <input
                  id="register-apellido"
                  type="text"
                  placeholder="García"
                  autoComplete="family-name"
                  className="input input-bordered bg-base-100 border-neutral/50 focus:border-primary transition-all w-full"
                />
              </div>
            </div>

            <div className="form-control gap-1">
              <label className="label py-0">
                <span className="label-text font-bold uppercase tracking-widest text-xs text-base-content/70">
                  Email
                </span>
              </label>
              <input
                id="register-email"
                type="email"
                placeholder="tu@email.com"
                autoComplete="email"
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
                id="register-password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                className="input input-bordered bg-base-100 border-neutral/50 focus:border-primary transition-all w-full"
              />
            </div>

            <div className="form-control gap-1">
              <label className="label py-0">
                <span className="label-text font-bold uppercase tracking-widest text-xs text-base-content/70">
                  Confirmar contraseña
                </span>
              </label>
              <input
                id="register-password-confirm"
                type="password"
                placeholder="Repetí la contraseña"
                autoComplete="new-password"
                className="input input-bordered bg-base-100 border-neutral/50 focus:border-primary transition-all w-full"
              />
            </div>

            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3 py-0">
                <input
                  id="register-terms"
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-sm"
                />
                <span className="label-text text-base-content/60 text-xs font-semibold">
                  Acepto los{" "}
                  <a href="#" className="text-primary font-bold hover:underline">
                    términos y condiciones
                  </a>
                </span>
              </label>
            </div>

            <button
              id="register-submit"
              type="submit"
              className="btn bg-primary hover:bg-neutral text-primary-content font-black uppercase tracking-wider border-0 w-full rounded-sm shadow-lg"
            >
              Crear cuenta
            </button>

            <div className="divider text-base-content/30 text-xs font-bold uppercase tracking-widest">
              ¿Ya tenés cuenta?
            </div>

            <a
              href="/login"
              className="btn bg-base-100 hover:bg-neutral hover:text-neutral-content text-base-content font-black uppercase tracking-wider border border-neutral/40 w-full rounded-sm"
            >
              Iniciar sesión
            </a>
          </form>
        </div>

        {/* Back link */}
        <p className="text-center mt-6 text-base-content/40 text-xs font-bold uppercase tracking-widest">
          <a href="/" className="hover:text-primary transition-colors">
            ← Volver al inicio
          </a>
        </p>
      </div>
    </div>
  );
};

export default Registro;
