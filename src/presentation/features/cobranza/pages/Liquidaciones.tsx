import { useState } from 'react';
import { toast } from 'react-toastify';
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  Send, 
  Calendar as CalendarIcon,
  Search,
  CreditCard,
} from 'lucide-react';
import { 
  useLiquidacionResumenPendienteQuery, 
  useCrearLiquidacionMutation, 
  useLiquidacionesHistoryQuery 
} from '../hooks/cobranzaHooks';
import StatusPanel from '../../../../infrastructure/ui/components/StatusPanel';
import { getErrorMessage } from '../../../../infrastructure/utils/getErrorMessage';
import { formatCalendarDateFromApi } from '../../../../shared/date/calendarDate';

const LiquidacionesPage = () => {
  const [fechaInicio, setFechaInicio] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  });
  const [fechaFin, setFechaFin] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [evidencia, setEvidencia] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const resumenQuery = useLiquidacionResumenPendienteQuery();
  const historyQuery = useLiquidacionesHistoryQuery(fechaInicio, fechaFin);
  const crearMutation = useCrearLiquidacionMutation();

  const handleLiquidar = async () => {
    if ((resumenQuery.data?.cantidadMovimientos ?? 0) === 0) {
      toast.warning('No hay movimientos pendientes para liquidar');
      return;
    }

    try {
      await crearMutation.mutateAsync({ evidencia: evidencia.trim() || undefined });
      toast.success('Liquidación enviada correctamente');
      setEvidencia('');
      setShowConfirm(false);
      resumenQuery.refetch();
      historyQuery.refetch();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Error al crear la liquidación'));
    }
  };

  const getStatusBadge = (estatus: string) => {
    switch (estatus.toLowerCase()) {
      case 'confirmada':
        return (
          <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle2 size={12} /> Confirmada
          </span>
        );
      case 'enviada':
        return (
          <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            <Clock size={12} /> Enviada
          </span>
        );
      case 'rechazada':
        return (
          <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <AlertCircle size={12} /> Rechazada
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {estatus}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textDark flex items-center gap-2">
            <ClipboardList className="text-primaryBlue" />
            Liquidación de Cobranza
          </h1>
          <p className="text-textMuted mt-1">Saldar el dinero recolectado hoy y enviarlo a validación en caja.</p>
        </div>
      </div>

      {/* Resumen Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <DollarSign size={48} className="text-primaryBlue" />
          </div>
          <p className="text-xs font-semibold text-textMuted uppercase tracking-wider">Efectivo pendiente</p>
          <p className="text-2xl font-bold text-textDark mt-2">
            ${(resumenQuery.data?.totalEfectivo ?? 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <CreditCard size={48} className="text-primaryBlue" />
          </div>
          <p className="text-xs font-semibold text-textMuted uppercase tracking-wider">Tarjeta pendiente</p>
          <p className="text-2xl font-bold text-textDark mt-2">
            ${(resumenQuery.data?.totalTarjeta ?? 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <Send size={48} className="text-primaryBlue rotate-12" />
          </div>
          <p className="text-xs font-semibold text-textMuted uppercase tracking-wider">Transfer. pendiente</p>
          <p className="text-2xl font-bold text-textDark mt-2">
            ${(resumenQuery.data?.totalTransferencia ?? 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-primaryBlue/10 shadow-sm relative overflow-hidden group ring-1 ring-primaryBlue/20">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <ClipboardList size={48} className="text-primaryBlue" />
          </div>
          <p className="text-xs font-semibold text-textMuted uppercase tracking-wider">Total hoy</p>
          <p className="text-2xl font-bold text-primaryBlue mt-2">
            ${(resumenQuery.data?.total ?? 0).toLocaleString()}
          </p>
          <div className="mt-1">
            <span className="text-xs text-textMuted font-medium italic">
                {resumenQuery.data?.cantidadMovimientos ?? 0} movimientos
            </span>
          </div>
        </div>

        <div className="bg-primaryBlue/5 p-4 rounded-xl border border-primaryBlue/20 flex flex-col justify-center sm:col-span-2 xl:col-span-1">
            <button 
                type="button" 
                className="btn btn-primary w-full py-3 h-auto text-base flex items-center justify-center gap-2"
                disabled={resumenQuery.isLoading || (resumenQuery.data?.cantidadMovimientos ?? 0) === 0}
                onClick={() => setShowConfirm(true)}
            >
                <ClipboardList size={20} />
                Liquidar mi cobranza
            </button>
        </div>
      </div>

      {/* Confirmation Flow */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primaryBlue/10 rounded-lg">
                <ClipboardList className="text-primaryBlue" size={24} />
              </div>
              <h2 className="text-xl font-bold text-textDark">Confirmar Liquidación</h2>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-textMuted text-base">Efectivo</span>
                <span className="font-semibold text-textDark text-base">${(resumenQuery.data?.totalEfectivo ?? 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-textMuted text-base">Tarjeta</span>
                <span className="font-semibold text-textDark text-base">${(resumenQuery.data?.totalTarjeta ?? 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-textMuted text-base">Transferencia</span>
                <span className="font-semibold text-textDark text-base">${(resumenQuery.data?.totalTransferencia ?? 0).toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between">
                <span className="font-bold text-textDark text-lg">Total</span>
                <span className="font-bold text-primaryBlue text-lg">${(resumenQuery.data?.total ?? 0).toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-textDark mb-1">Evidencia / Notas (opcional)</label>
                <textarea 
                  className="form-input w-full min-h-[100px] py-3 text-base" 
                  value={evidencia} 
                  onChange={(e) => setEvidencia(e.target.value)}
                  placeholder="Ej: Ficha de depósito, folio, comentario..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button" 
                  className="btn btn-light py-3" 
                  disabled={crearMutation.isPending}
                  onClick={() => setShowConfirm(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary py-3" 
                  disabled={crearMutation.isPending}
                  onClick={handleLiquidar}
                >
                  {crearMutation.isPending ? 'Enviando...' : 'Confirmar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-textDark flex items-center gap-2">
            <Clock className="text-textMuted" size={20} />
            Historial de Liquidaciones
          </h3>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
              <CalendarIcon size={16} className="text-textMuted" />
              <input 
                type="date" 
                className="bg-transparent border-none text-sm focus:ring-0 p-0" 
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
              <span className="text-gray-300">|</span>
              <input 
                type="date" 
                className="bg-transparent border-none text-sm focus:ring-0 p-0" 
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {historyQuery.isLoading && (
            <div className="p-20 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primaryBlue mb-4"></div>
                <p className="text-textMuted">Cargando historial...</p>
            </div>
          )}
          
          {historyQuery.isError && <StatusPanel variant="error" title="Error" message="No fue posible cargar el historial" />}
          
          {!historyQuery.isLoading && !historyQuery.isError && (
            <>
              {historyQuery.data?.length === 0 ? (
                <div className="p-20 text-center">
                  <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-gray-300" size={32} />
                  </div>
                  <p className="text-lg font-medium text-textDark">No hay liquidaciones en este rango</p>
                  <p className="text-textMuted">Prueba seleccionando otras fechas.</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 text-xs font-semibold text-textMuted uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Fecha / Hora</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4">Detalle</th>
                      <th className="px-6 py-4">Evidencia</th>
                      <th className="px-6 py-4">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {historyQuery.data?.map((liq) => (
                      <tr key={liq.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-textDark">
                            {formatCalendarDateFromApi(liq.fecha)}
                          </div>
                          <div className="text-xs text-textMuted">
                            {liq.hora}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-textDark">
                            ${liq.total.toLocaleString()}
                          </div>
                          <div className="flex gap-2 mt-1">
                            <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-textMuted">
                                E: ${liq.totalEfectivo.toLocaleString()}
                            </span>
                            <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-textMuted">
                                T: ${liq.totalTransferencia.toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="text-xs text-textMuted flex items-center gap-1">
                                <ClipboardList size={12} />
                                Envíado el {new Date(liq.fechaCreacion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs text-textMuted max-w-[200px] truncate" title={liq.evidencia ?? undefined}>
                            {liq.evidencia || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(liq.estatus)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiquidacionesPage;
