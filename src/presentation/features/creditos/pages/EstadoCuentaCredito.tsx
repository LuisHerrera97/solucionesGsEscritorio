import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StatusPanel from '../../../../infrastructure/ui/components/StatusPanel';
import { useCreditoByIdQuery } from '../hooks/creditosHooks';
import { formatCalendarDateFromApi } from '../../../../shared/date/calendarDate';

const EstadoCuentaCredito = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const creditoQuery = useCreditoByIdQuery(id);

  const credito = creditoQuery.data;
  const fichas = useMemo(() => credito?.fichas ?? [], [credito?.fichas]);

  if (creditoQuery.isLoading) {
    return <StatusPanel variant="loading" title="Cargando estado de cuenta" message="Consultando el servidor..." />;
  }

  if (creditoQuery.isError || !credito) {
    return (
      <div className="min-h-screen p-6">
        <StatusPanel variant="error" title="Crédito no encontrado" message="No fue posible cargar el estado de cuenta." />
        <div className="mt-4">
          <button className="btn btn-primary" onClick={() => navigate('/creditos')}>
            Volver
          </button>
        </div>
      </div>
    );
  }

  const saldoPendiente = credito.total - credito.pagado;
  const totalMoraPendiente = fichas.reduce((acc, f) => {
    const moraAcumulada = f.moraAcumulada ?? f.mora ?? 0;
    const moraPagada = f.mora ?? 0;
    return acc + Math.max(0, moraAcumulada - moraPagada);
  }, 0);
  const totalMoraGenerada = fichas.reduce((acc, f) => acc + (f.moraAcumulada ?? f.mora ?? 0), 0);
  const totalAbono = fichas.reduce((acc, f) => acc + (f.abono ?? 0), 0);
  const saldoTotal = saldoPendiente + totalMoraPendiente;

  const fechaPrimerPago = fichas.length > 0 ? formatCalendarDateFromApi(fichas[0].fecha) : '-';
  const fechaUltimoPago = fichas.length > 0 ? formatCalendarDateFromApi(fichas[fichas.length - 1].fecha) : '-';

  return (
    <div className="min-h-screen bg-white p-6 space-y-6 print:p-0 print:space-y-3">
      <div className="flex items-start justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Estado de cuenta</h1>
          <p className="text-sm text-textMuted">Crédito {credito.folio ?? credito.id}</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-light" onClick={() => navigate(`/creditos/${credito.id}`)}>
            Regresar al crédito
          </button>
          <button className="btn btn-primary" onClick={() => window.print()}>
            Imprimir
          </button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl p-4 print:border-0 print:p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs uppercase text-textMuted tracking-wide">Cliente</p>
            <p className="text-lg font-semibold text-textDark">
              {credito.clienteNombre} {credito.clienteApellido}
            </p>
            <p className="text-sm text-textMuted">
              {credito.clienteNegocio} · <span className="font-semibold">{credito.clienteZona}</span>
            </p>
            {credito.observacion && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-100 rounded text-xs text-blue-800">
                <strong>Observación:</strong> {credito.observacion}
              </div>
            )}
          </div>
          <div className="md:text-right">
            <p className="text-xs uppercase text-textMuted tracking-wide">Crédito</p>
            <p className="text-lg font-semibold text-textDark">{credito.folio ?? credito.id}</p>
            <p className="text-sm text-textMuted">{credito.tipo === 'diario' ? 'Diario' : (credito.tipo === 'semanal' ? 'Semanal' : 'Mensual')}</p>
            <div className="mt-1 flex flex-col md:items-end text-xs text-textMuted">
              <span>Primer pago: {fechaPrimerPago}</span>
              <span>Último pago: {fechaUltimoPago}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-textMuted uppercase tracking-wide">Pago</p>
            <p className="text-lg font-semibold text-textDark">${credito.total.toLocaleString()}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-textMuted uppercase tracking-wide">Pagado</p>
            <p className="text-lg font-semibold text-green-700">${credito.pagado.toLocaleString()}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-textMuted uppercase tracking-wide">Saldo total</p>
            <p className="text-lg font-semibold text-red-700">${saldoTotal.toLocaleString()}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-textMuted uppercase tracking-wide">Mora acumulada</p>
            <p className="text-lg font-semibold text-amber-700">${totalMoraGenerada.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto print:shadow-none print:border-0">
        <div className="p-4 border-b border-gray-100 print:border-0 print:p-0 print:pb-2">
          <h2 className="text-lg font-semibold text-textDark">Plan de pagos</h2>
        </div>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 print:bg-white">
            <tr>
              <th className="text-left p-3">#</th>
              <th className="text-left p-3">Fecha</th>
              <th className="text-right p-3">Total</th>
              <th className="text-right p-3">Abono</th>
              <th className="text-right p-3">Mora</th>
              <th className="text-right p-3">Saldo pendiente</th>
              <th className="text-left p-3">Estatus</th>
            </tr>
          </thead>
          <tbody>
            {fichas.map((f) => {
              const cuotaPendiente = Math.max(0, (f.total ?? 0) - (f.abono ?? 0));
              const moraAcumulada = f.moraAcumulada ?? f.mora ?? 0;
              const moraPendiente = Math.max(0, moraAcumulada - (f.mora ?? 0));
              const totalPendienteFicha = cuotaPendiente + moraPendiente;
              
              return (
                <tr key={f.num} className="border-t border-gray-100">
                  <td className="p-3 whitespace-nowrap">{f.num}</td>
                  <td className="p-3 whitespace-nowrap">{formatCalendarDateFromApi(f.fecha)}</td>
                  <td className="p-3 text-right whitespace-nowrap">${(f.total ?? 0).toLocaleString()}</td>
                  <td className="p-3 text-right whitespace-nowrap">${(f.abono ?? 0).toLocaleString()}</td>
                  <td className="p-3 text-right whitespace-nowrap">${moraPendiente.toLocaleString()}</td>
                  <td className="p-3 text-right whitespace-nowrap">${totalPendienteFicha.toLocaleString()}</td>
                  <td className="p-3 whitespace-nowrap">{f.pagada ? 'Pagada' : totalPendienteFicha > 0 ? 'Pendiente' : 'Al corriente'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-textMuted print:text-xs">
        Total abonos registrados: <span className="font-semibold text-textDark">${totalAbono.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default EstadoCuentaCredito;
