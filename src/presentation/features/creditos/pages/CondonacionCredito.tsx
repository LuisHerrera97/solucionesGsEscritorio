import { useMemo, useState } from 'react';
import { ArrowLeft, Percent, Wallet } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ConfirmDialog } from '../../../../infrastructure/ui/components/ConfirmDialog';
import StatusPanel from '../../../../infrastructure/ui/components/StatusPanel';
import { getErrorMessage } from '../../../../infrastructure/utils/getErrorMessage';
import { asNumber, numberInputDisplay, parseNumberInput, type NumberInputValue } from '../../../../infrastructure/utils/numberInput';
import { useAuth } from '../../auth/context/useAuth';
import { useCreditoByIdQuery, useCondonarInteresMontoMutation } from '../hooks/creditosHooks';

const CondonacionCredito = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { canBoton, isMenuLoading } = useAuth();
  const puedeCondonar = canBoton('CREDITO_CONDONAR_INTERES');

  const creditoQuery = useCreditoByIdQuery(id);
  const condonarMontoMutation = useCondonarInteresMontoMutation();

  const [monto, setMonto] = useState<NumberInputValue>('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const credito = creditoQuery.data;

  const { interesTotalPendiente, fichasPendientesCount } = useMemo(() => {
    if (!credito) return { interesTotalPendiente: 0, fichasPendientesCount: 0 };
    const pend = credito.fichas.filter((f) => !f.pagada);
    const total = pend.reduce((acc, f) => acc + (f.interes ?? 0), 0);
    return { interesTotalPendiente: total, fichasPendientesCount: pend.length };
  }, [credito]);

  const montoNum = asNumber(monto);
  const montoValido = montoNum > 0 && montoNum <= interesTotalPendiente;

  const solicitarConfirmacion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !credito) return;
    if (!puedeCondonar) {
      toast.error('No tienes permiso para condonar interés.');
      return;
    }
    if (montoNum <= 0) {
      toast.error('El monto debe ser mayor a 0');
      return;
    }
    if (montoNum > interesTotalPendiente) {
      toast.error('El monto no puede superar el interés pendiente.');
      return;
    }
    setConfirmOpen(true);
  };

  const aplicarCondonacion = async () => {
    if (!id || !montoValido) return;
    try {
      await condonarMontoMutation.mutateAsync({ creditoId: id, monto: montoNum });
      toast.success('Interés condonado correctamente');
      setConfirmOpen(false);
      navigate(`/creditos/${id}`);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible aplicar la condonación'));
    }
  };

  if (creditoQuery.isLoading) {
    return <StatusPanel variant="loading" title="Cargando crédito" message="Consultando el servidor..." />;
  }

  if (isMenuLoading) {
    return <StatusPanel variant="loading" title="Cargando permisos" message="Validando acceso..." />;
  }

  if (creditoQuery.isError || !credito) {
    return (
      <div className="mx-auto max-w-lg space-y-4 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-textDark">Crédito no encontrado</h1>
        <button type="button" className="btn btn-primary" onClick={() => navigate('/creditos')}>
          Volver a créditos
        </button>
      </div>
    );
  }

  if (!puedeCondonar) {
    return (
      <div className="mx-auto max-w-lg space-y-4">
        <StatusPanel variant="empty" title="Sin permiso" message="Tu perfil no incluye la acción de condonar interés. Solicita acceso a un administrador si aplica." />
        <button type="button" className="btn btn-light w-full" onClick={() => navigate(`/creditos/${credito.id}`)}>
          Volver al crédito
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Créditos</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">Condonación de interés</h1>
          <p className="mt-2 text-sm leading-relaxed text-textMuted lg:text-base">
            Aplica un descuento global al interés pendiente de las fichas no pagadas. El monto se reparte desde la ficha más antigua. No genera movimiento de caja.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-light shrink-0 gap-2 self-start lg:self-auto"
          onClick={() => navigate(`/creditos/${credito.id}`)}
        >
          <ArrowLeft size={18} />
          Volver al crédito
        </button>
      </div>

      <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_20px_50px_-24px_rgba(15,23,42,0.18)] ring-1 ring-slate-900/5">
        <div className="xl:grid xl:grid-cols-12 xl:divide-x xl:divide-slate-100">
          <div className="relative border-b border-slate-100 bg-gradient-to-br from-sky-50/90 via-white to-amber-50/30 px-6 py-6 sm:px-8 sm:py-8 xl:col-span-5 xl:border-b-0">
            <div className="pointer-events-none absolute -right-16 -top-12 h-36 w-36 rounded-full bg-sky-200/25 blur-2xl xl:hidden" aria-hidden />
            <div className="relative grid gap-4 sm:grid-cols-2 xl:grid-cols-1 xl:gap-5">
              <div className="flex gap-3 rounded-xl border border-white/80 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-white">
                  <Wallet size={20} strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Crédito</p>
                  <p className="mt-0.5 font-semibold text-slate-900">{credito.folio}</p>
                  <p className="mt-1 text-xs text-textMuted">
                    {fichasPendientesCount} ficha(s) con saldo de interés pendiente
                  </p>
                </div>
              </div>
              <div className="flex gap-3 rounded-xl border border-sky-100 bg-sky-50/80 p-4 shadow-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white">
                  <Percent size={20} strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-sky-800">Interés total pendiente</p>
                  <p className="mt-0.5 text-2xl font-bold tabular-nums text-sky-900 lg:text-3xl">${interesTotalPendiente.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="min-w-0 xl:col-span-7">
            {interesTotalPendiente <= 0 ? (
              <div className="px-6 py-10 sm:px-8">
                <StatusPanel variant="empty" title="Sin interés pendiente" message="No hay interés por condonar en fichas no pagadas." />
                <button type="button" className="btn btn-primary mt-4 w-full sm:w-auto" onClick={() => navigate(`/creditos/${credito.id}`)}>
                  Volver al crédito
                </button>
              </div>
            ) : (
              <form onSubmit={solicitarConfirmacion} className="space-y-6 px-6 py-6 sm:px-8 sm:py-8 lg:py-10">
                <div>
                  <label htmlFor="monto-condonacion" className="mb-2 block text-sm font-medium text-slate-800 lg:text-base">
                    Monto a condonar
                  </label>
                  <div className="relative max-w-2xl">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">$</span>
                    <input
                      id="monto-condonacion"
                      type="number"
                      inputMode="decimal"
                      min="0.01"
                      max={interesTotalPendiente}
                      step="0.01"
                      className="input w-full pl-8 text-lg font-semibold tabular-nums lg:text-xl"
                      placeholder="0.00"
                      value={numberInputDisplay(monto)}
                      onChange={(e) => setMonto(parseNumberInput(e.target.value))}
                    />
                  </div>
                  <p className="mt-2 max-w-3xl text-xs leading-relaxed text-textMuted lg:text-sm">
                    Máximo permitido: <span className="font-semibold text-slate-700">${interesTotalPendiente.toLocaleString()}</span>. Se aplicará primero a las fichas más antiguas.
                  </p>
                  {monto !== '' && montoNum > interesTotalPendiente && (
                    <p className="mt-2 text-xs font-medium text-red-600">El monto supera el interés pendiente.</p>
                  )}
                </div>

                <div className="max-w-3xl rounded-xl border border-amber-200/80 bg-amber-50/60 px-4 py-3 text-xs text-amber-950 lg:text-sm">
                  Esta acción queda registrada en auditoría e historial del crédito. Revise el monto antes de confirmar.
                </div>

                <div className="flex max-w-3xl flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                  <button type="button" className="btn btn-light w-full sm:w-auto" onClick={() => navigate(`/creditos/${credito.id}`)}>
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary w-full sm:min-w-[220px]"
                    disabled={condonarMontoMutation.isPending || !montoValido}
                  >
                    Aplicar condonación
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Confirmar condonación"
        message={`Se condonarán $${montoNum.toLocaleString()} de interés en el crédito ${credito.folio}. El saldo se distribuirá en las fichas pendientes desde la más antigua.`}
        confirmLabel="Sí, aplicar"
        cancelLabel="Cancelar"
        type="warning"
        loading={condonarMontoMutation.isPending}
        onConfirm={() => void aplicarCondonacion()}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default CondonacionCredito;
