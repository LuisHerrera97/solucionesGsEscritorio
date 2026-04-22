import { Lock } from 'lucide-react';

export const LoginBrandPanel = () => {
  return (
    <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-primaryBlue to-primaryBlueDark text-white">
      <div>
        <div className="inline-flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-white/15 grid place-items-center">
            <Lock size={20} className="text-white" />
          </div>
          <div>
            <div className="text-xl font-semibold leading-tight">Financiera GS</div>
            <div className="text-sm text-white/80">Sistema de créditos y cobranza</div>
          </div>
        </div>
        <div className="mt-8 space-y-3 text-white/90">
          <div className="text-sm">Acceso seguro</div>
          <div className="text-sm">Gestión de clientes y créditos</div>
          <div className="text-sm">Caja, reportes y cortes</div>
        </div>
      </div>
      <div className="text-xs text-white/70">© {new Date().getFullYear()} Financiera GS</div>
    </div>
  );
};

