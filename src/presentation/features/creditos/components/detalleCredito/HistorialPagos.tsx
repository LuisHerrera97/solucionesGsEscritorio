import { ArrowRightLeft, Banknote, CreditCard, History, Scale } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../auth/context/useAuth';
import { useMovimientosByCreditoQuery } from '../../hooks/creditosHooks';
import { useReversarMovimientoCreditoMutation } from '../../hooks/creditosHooks';
import StatusPanel from '../../../../../infrastructure/ui/components/StatusPanel';
import { formatCalendarDateFromApi } from '../../../../../shared/date/calendarDate';
import { getErrorMessage } from '../../../../../infrastructure/utils/getErrorMessage';
import { buildTicketHtml } from '../../../../../shared/ticket/buildTicketHtml';

type HistorialPagosProps = {
  creditoId: string;
};

export const HistorialPagos = ({ creditoId }: HistorialPagosProps) => {
  const { canBoton } = useAuth();
  const puedeReversarMovimiento = canBoton('CREDITO_PAGAR_FICHA') || canBoton('CREDITO_ABONAR_FICHA');
  const movimientosQuery = useMovimientosByCreditoQuery(creditoId);
  const reversarMutation = useReversarMovimientoCreditoMutation();

  if (movimientosQuery.isLoading) {
    return <StatusPanel variant="loading" title="Cargando historial" message="Obteniendo movimientos del crédito..." />;
  }

  const movimientos = movimientosQuery.data ?? [];
  const printTicket = (mId: string) => {
    const movimiento = movimientos.find((m) => m.id === mId);
    if (!movimiento) return;
    const html = buildTicketHtml({
      fecha: formatCalendarDateFromApi(movimiento.fecha),
      hora: movimiento.hora ?? '-',
      cliente: movimiento.clienteNombre ?? '-',
      folio: movimiento.creditoFolio ?? '-',
      concepto: movimiento.concepto ?? movimiento.tipo,
      ficha: movimiento.numeroFicha ? `#${movimiento.numeroFicha}` : '-',
      total: movimiento.total,
    });
    const electronApi = (window as any).ipcRenderer;
    if (electronApi?.printTicketHtml) {
      void electronApi.printTicketHtml(html);
      return;
    }
    const win = window.open('', '_blank', 'width=380,height=640');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  };

  const handleReversa = async (movimientoId: string) => {
    try {
      await reversarMutation.mutateAsync({ creditoId, movimientoId });
      toast.success('Operación desaplicada');
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible desaplicar la operación'));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-primaryBlue/10 text-primaryBlue">
          <History size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Historial de Movimientos</h2>
          <p className="text-xs text-textMuted font-medium uppercase tracking-[0.1em]">Registro cronológico de transacciones</p>
        </div>
      </div>

      {movimientos.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-[2rem] bg-gray-50/30">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-300 mb-4">
            <History size={32} />
          </div>
          <p className="text-sm font-bold text-gray-400">Aún no se han registrado pagos o abonos</p>
          <p className="text-[10px] text-gray-300 uppercase font-black tracking-widest mt-1 text-center px-8">
            Abonos, penalizaciones y condonaciones de interés aparecen aquí; las condonaciones no generan entrada en caja.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="hidden md:grid grid-cols-6 px-6 text-[10px] font-black uppercase text-slate-300 tracking-[0.2em] mb-2">
            <span className="col-span-1">Tipo</span>
            <span className="col-span-1 text-center">Ficha</span>
            <span className="col-span-1">Fecha / Hora</span>
            <span className="col-span-1 text-center">Medio</span>
            <span className="col-span-1 text-right">Monto</span>
            <span className="col-span-1 text-right">Total</span>
          </div>

          {movimientos.map((m) => {
            const fecha = formatCalendarDateFromApi(m.fecha, { day: '2-digit', month: '2-digit', year: 'numeric' });
            const esSoloHistorial = m.registraCaja === false;

            return (
              <div 
                key={m.id} 
                className="group relative bg-white border border-gray-100 rounded-2xl p-4 md:p-6 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:border-primaryBlue/20"
              >
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2/3 bg-transparent group-hover:bg-primaryBlue rounded-r-full transition-all duration-300" />
                
                <div className="grid grid-cols-1 md:grid-cols-6 items-center gap-4">
                  {/* Tipo */}
                  <div className="col-span-1">
                    <div className="flex flex-col">
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                          m.concepto?.startsWith('Pago')
                            ? 'text-emerald-500'
                            : esSoloHistorial
                              ? 'text-violet-600'
                              : 'text-primaryBlue'
                        }`}
                      >
                        {m.concepto}
                      </span>
                      <span className="text-xs font-bold text-slate-400 font-mono tracking-tighter truncate w-24" title={m.id}>
                        {m.id.split('-')[0]}...
                      </span>
                    </div>
                  </div>

                  {/* Ficha */}
                  <div className="col-span-1 text-center">
                    {m.numeroFicha ? (
                      <span className="px-3 py-1 rounded-full bg-slate-50 text-slate-400 text-[10px] font-black border border-slate-100">
                        #{m.numeroFicha}
                      </span>
                    ) : (
                      <span className="text-slate-200">—</span>
                    )}
                  </div>

                  {/* Fecha */}
                  <div className="col-span-1">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700">{fecha}</span>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">{m.hora}</span>
                    </div>
                  </div>

                  {/* Medio */}
                  <div className="col-span-1 flex justify-center">
                    {esSoloHistorial ? (
                      <div className="p-2 rounded-xl border flex items-center gap-2 bg-slate-50 text-slate-500 border-slate-100">
                        <Scale size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">No aplica</span>
                      </div>
                    ) : (
                      <div
                        className={`p-2 rounded-xl border flex items-center gap-2 ${
                          m.medio === 'Efectivo'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            : m.medio === 'Transferencia'
                              ? 'bg-blue-50 text-blue-600 border-blue-100'
                              : 'bg-violet-50 text-violet-600 border-violet-100'
                        }`}
                      >
                        {m.medio === 'Efectivo' && <Banknote size={14} />}
                        {m.medio === 'Transferencia' && <ArrowRightLeft size={14} />}
                        {m.medio === 'Mixto' && <CreditCard size={14} />}
                        <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">{m.medio}</span>
                      </div>
                    )}
                  </div>

                  {/* Detalle Montos */}
                  <div className="col-span-1 text-right">
                    <div className="flex flex-col items-end">
                      {(m.abono ?? 0) > 0 && (
                        <span className="text-[10px] font-bold text-slate-400 leading-none">Abono: ${(m.abono ?? 0).toLocaleString()}</span>
                      )}
                      {(m.mora ?? 0) > 0 && (
                        <span className="text-[10px] font-bold text-amber-500 leading-none mt-1">Mora: +${(m.mora ?? 0).toLocaleString()}</span>
                      )}
                      {esSoloHistorial && (
                        <span className="text-[10px] font-bold text-violet-600 leading-none mt-1">Interés condonado</span>
                      )}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="col-span-1 text-right">
                    <span className="text-lg font-black text-slate-800 font-mono tracking-tighter">
                      ${m.total.toLocaleString()}
                    </span>
                    <div className="mt-2 flex justify-end gap-2">
                      <button type="button" className="btn btn-light px-2 py-1 text-[10px]" onClick={() => printTicket(m.id)}>
                        Reimprimir
                      </button>
                      {puedeReversarMovimiento && !m.revertido && !m.reversaDeId && (m.tipo === 'Ficha' || m.tipo === 'Penalizacion') && (
                        <button type="button" className="btn btn-light px-2 py-1 text-[10px]" onClick={() => handleReversa(m.id)}>
                          Desaplicar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

