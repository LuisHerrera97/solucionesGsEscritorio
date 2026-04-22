import type { CreditoApi } from '../../../../../application/finanzas/finanzasAppService';

type CreditoInfoCardsProps = {
  credito: CreditoApi;
  cuotasPagadas: number;
  cuotasTotales: number;
  saldoPendiente: number;
};

export const CreditoInfoCards = ({ credito, cuotasPagadas, cuotasTotales, saldoPendiente }: CreditoInfoCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="card">
        <p className="text-xs uppercase text-textMuted tracking-wide">Cliente</p>
        <p className="text-lg font-semibold text-textDark mt-1">
          {credito.clienteNombre} {credito.clienteApellido}
        </p>
        <p className="text-sm text-textMuted">
          {credito.clienteNegocio} · {credito.clienteZona}
        </p>
      </div>
      <div className="card">
        <p className="text-xs uppercase text-textMuted tracking-wide">Crédito</p>
        <p className="text-lg font-semibold text-textDark mt-1">{credito.folio}</p>
        <p className="text-sm text-textMuted">
          {credito.tipo === 'diario' ? 'Diario' : (credito.tipo === 'semanal' ? 'Semanal' : 'Mensual')} · {cuotasPagadas} de {cuotasTotales} fichas pagadas
        </p>
      </div>
      <div className="card">
        <p className="text-xs uppercase text-textMuted tracking-wide">Saldos</p>
        <div className="mt-1 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-textMuted">Total</span>
            <span className="font-semibold">${credito.total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-textMuted">Pagado</span>
            <span className="font-semibold text-green-600">${credito.pagado.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-textMuted">Pendiente</span>
            <span className="font-semibold text-red-600">${saldoPendiente.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

