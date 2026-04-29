import type { CreditoApi } from '../../../../../application/creditos/creditosAppService';

type ReestructuraInfoCardsProps = {
  credito: CreditoApi;
  saldoPendiente: number;
};

export const ReestructuraInfoCards = ({ credito, saldoPendiente }: ReestructuraInfoCardsProps) => {
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
        <p className="text-xs uppercase text-textMuted tracking-wide">Crédito actual</p>
        <p className="text-lg font-semibold text-textDark mt-1">{credito.folio?.trim() || '—'}</p>
        <p className="text-sm text-textMuted">
          Total: ${credito.total.toLocaleString()} · Abonos aplicados: ${credito.pagado.toLocaleString()}
        </p>
      </div>
      <div className="card">
        <p className="text-xs uppercase text-textMuted tracking-wide">Saldo pendiente (a reestructurar)</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">${saldoPendiente.toLocaleString()}</p>
        <p className="text-xs text-textMuted mt-1">Lo ya abonado por el cliente se mantiene.</p>
      </div>
    </div>
  );
};

