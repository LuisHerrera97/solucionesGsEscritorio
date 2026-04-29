import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { MedioPago } from '../../../../domain/creditos/types';
import StatusPanel from '../../../../infrastructure/ui/components/StatusPanel';
import { getErrorMessage } from '../../../../infrastructure/utils/getErrorMessage';
import { asNumber, type NumberInputValue } from '../../../../infrastructure/utils/numberInput';
import { useCreditoByIdQuery, useAbonarFichaCreditoMutation, usePenalizarFichaCreditoMutation, useCondonarInteresMutation, useActualizarObservacionMutation } from '../hooks/creditosHooks';
import { useConfiguracionSistemaQuery } from '../../general/hooks/generalHooks';
import { CreditoInfoCards } from '../components/detalleCredito/CreditoInfoCards';
import { FichasEstadoCuenta } from '../components/detalleCredito/FichasEstadoCuenta';
import { HistorialPagos } from '../components/detalleCredito/HistorialPagos';
import { PagoCuotaModal } from '../components/detalleCredito/PagoCuotaModal';
import { PenalizacionModal } from '../components/detalleCredito/PenalizacionModal';
import { ConfirmDialog } from '../../../../infrastructure/ui/components/ConfirmDialog';
import { ModalShell } from '../../../../infrastructure/ui/components/ModalShell';
import { useAuth } from '../../auth/context/useAuth';
import { parseCalendarDateFromApi } from '../../../../shared/date/calendarDate';
import { buildTicketHtml } from '../../../../shared/ticket/buildTicketHtml';

const DetalleCredito = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { canBoton } = useAuth();


  const creditoQuery = useCreditoByIdQuery(id);
  const configQuery = useConfiguracionSistemaQuery();

  const [modalPago, setModalPago] = useState<{ numFicha: number; pendiente: number } | null>(null);
  const [modalType, setModalType] = useState<'pago' | 'abono' | 'penalizacion' | null>(null);
  const [monto, setMonto] = useState<NumberInputValue>(0);
  const [mora, setMora] = useState<NumberInputValue>(0);
  const [medioPago, setMedioPago] = useState<MedioPago>('Efectivo');
  const [montoEfectivo, setMontoEfectivo] = useState<NumberInputValue>(0);
  const [montoTransferencia, setMontoTransferencia] = useState<NumberInputValue>(0);
  const [ticketModal, setTicketModal] = useState<{ concepto: string; total: number; numeroFicha: number } | null>(null);

  const [obsEditMode, setObsEditMode] = useState(false);
  const [obsText, setObsText] = useState('');

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'danger' | 'success';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: () => {},
  });

  const abonarFichaMutation = useAbonarFichaCreditoMutation();
  const penalizarFichaMutation = usePenalizarFichaCreditoMutation();
  const savingFicha = abonarFichaMutation.isPending || penalizarFichaMutation.isPending;
  const condonarMutation = useCondonarInteresMutation();
  const actualizarObsMutation = useActualizarObservacionMutation();

  const credito = creditoQuery.data;
  const fichas = useMemo(() => credito?.fichas ?? [], [credito?.fichas]);

  const calcularMoraSugerida = useCallback(
    (fechaFicha: string): number => {
      const cfg = configQuery.data;
      if (!cfg || !credito) return 0;
      const fecha0 = parseCalendarDateFromApi(fechaFicha);
      if (!fecha0) return 0;
      const hoy = new Date();
      const hoy0 = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
      const diasAtraso = Math.floor((hoy0.getTime() - fecha0.getTime()) / (1000 * 60 * 60 * 24));
      if (diasAtraso <= 0) return 0;
      if (credito.tipo === 'diario') {
        const gracia = Math.max(0, cfg.diasGraciaDiaria ?? 0);
        if (diasAtraso <= gracia) return 0;
        const diasSujetos = diasAtraso - gracia;
        const veces = (cfg.topeMoraDiaria ?? 0) > 0 ? Math.min(diasSujetos, cfg.topeMoraDiaria) : diasSujetos;
        return veces * cfg.moraDiaria;
      }
      if (credito.tipo === 'semanal') {
        const gracia = Math.max(0, cfg.diasGraciaSemanal ?? 0);
        if (diasAtraso <= gracia) return 0;
        const diasSujetos = diasAtraso - gracia;
        const veces = (cfg.topeMoraSemanal ?? 0) > 0 ? Math.min(diasSujetos, cfg.topeMoraSemanal) : diasSujetos;
        return veces * cfg.moraSemanal;
      }
      if (credito.tipo === 'mensual') {
        const gracia = Math.max(0, cfg.diasGraciaMensual ?? 0);
        if (diasAtraso <= gracia) return 0;
        const diasSujetos = diasAtraso - gracia;
        const veces = (cfg.topeMoraMensual ?? 0) > 0 ? Math.min(diasSujetos, cfg.topeMoraMensual) : diasSujetos;
        return veces * cfg.moraMensual;
      }
      return 0;
    },
    [credito, configQuery.data],
  );





  const handleRegistrarPago = async () => {
    if (!credito || !modalPago) return;
    
    const montoAbono = asNumber(monto);

    if (montoAbono <= 0) return;
    if (medioPago === 'Mixto') {
      const sum = asNumber(montoEfectivo) + asNumber(montoTransferencia);
      if (Math.abs(sum - montoAbono) > 0.01) return;
    }

    try {
      await abonarFichaMutation.mutateAsync({
        creditoId: credito.id,
        numeroFicha: modalPago.numFicha,
        montoAbono,
        medio: medioPago,
        montoEfectivo: medioPago === 'Mixto' ? asNumber(montoEfectivo) : undefined,
        montoTransferencia: medioPago === 'Mixto' ? asNumber(montoTransferencia) : undefined,
      });
      toast.success('Pago registrado');
      setTicketModal({
        concepto: modalType === 'abono' ? 'Abono de ficha' : 'Pago de ficha',
        total: montoAbono,
        numeroFicha: modalPago.numFicha,
      });
      setModalPago(null);
      setModalType(null);
      setMonto(0);
      setMora(0);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible completar la operación'));
    }
  };

  const confirmPay = () => {
    const total = asNumber(monto);
    setConfirmDialog({
      isOpen: true,
      title: 'Confirmar pago',
      message: `¿Estás seguro de registrar un pago de $${total.toLocaleString()} por la ficha #${modalPago?.numFicha}?`,
      type: 'info',
      onConfirm: () => {
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        handleRegistrarPago();
      },
    });
  };

  const confirmPenalize = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Aplicar penalización',
      message: `¿Deseas aplicar una penalización de $${asNumber(mora).toLocaleString()} a la ficha #${modalPago?.numFicha}? Esto se registrará como un movimiento de caja independiente del abono principal.`,
      type: 'warning',
      onConfirm: () => {
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        if (!modalPago) return;
    
        penalizarFichaMutation.mutate(
          {
            creditoId: id as string,
            numeroFicha: modalPago.numFicha,
            monto: asNumber(mora),
          },
          {
            onSuccess: () => {
              toast.success('Penalización aplicada correctamente');
              setTicketModal({
                concepto: 'Multa aplicada',
                total: asNumber(mora),
                numeroFicha: modalPago.numFicha,
              });
              setModalPago(null);
              setMora(0);
              setModalType(null);
            },
            onError: (err) => {
              toast.error(getErrorMessage(err, 'No fue posible aplicar la penalización'));
            },
          },
        );
      },
    });
  };

  const handleCondonarInteres = async (numeroFicha: number) => {
    if (!id) return;
    setConfirmDialog({
      isOpen: true,
      title: 'Condonar interés',
      message: `¿Estás seguro de condonar el interés de la ficha #${numeroFicha}? Esta acción no se puede deshacer.`,
      type: 'danger',
      onConfirm: async () => {
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        try {
          await condonarMutation.mutateAsync({ creditoId: id, numeroFicha });
          toast.success('Interés condonado');
        } catch (err: unknown) {
          toast.error(getErrorMessage(err, 'No fue posible condonar el interés'));
        }
      },
    });
  };

  const handleGuardarObservacion = async () => {
    if (!id) return;
    try {
      await actualizarObsMutation.mutateAsync({ creditoId: id, observacion: obsText });
      toast.success('Observación guardada');
      setObsEditMode(false);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible guardar la observación'));
    }
  };

  if (creditoQuery.isLoading) {
    return <StatusPanel variant="loading" title="Cargando crédito" message="Consultando el servidor..." />;
  }

  if (creditoQuery.isError || !credito) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Crédito no encontrado</h1>
        <button className="btn btn-primary" onClick={() => navigate('/creditos')}>
          Volver a créditos
        </button>
      </div>
    );
  }

  const fichasPagadas = fichas.filter((f) => f.pagada);
  const cuotasPagadas = fichasPagadas.length;
  const cuotasTotales = fichas.length;
  const saldoPendiente = credito.total - credito.pagado;
  const fichaSiguiente = fichas.find((f) => !f.pagada);
  const interesTotalPendiente = fichas
    .filter((f) => !f.pagada)
    .reduce((acc, f) => acc + (f.interes ?? 0), 0);
  const hayInteresPorCondonar = interesTotalPendiente > 0;
  const creditoVigente = credito.estatus === 'Activo';
  const canReestructurar = canBoton('CREDITO_REESTRUCTURAR') && creditoVigente;
  const canPagarFicha = canBoton('CREDITO_PAGAR_FICHA') || canBoton('CREDITO_ABONAR_FICHA');
  const canAbonarParcial = canBoton('CREDITO_ABONAR_FICHA');
  const canPenalizarFicha = canBoton('CREDITO_PENALIZAR_FICHA') || canBoton('CREDITO_ABONAR_FICHA');
  const canCondonarInteresFicha = canBoton('CREDITO_CONDONAR_INTERES');
  const printTicket = () => {
    if (!ticketModal || !credito) return;
    const now = new Date();
    const html = buildTicketHtml({
      fecha: now.toLocaleDateString(),
      hora: now.toLocaleTimeString(),
      cliente: `${credito.clienteNombre ?? ''} ${credito.clienteApellido ?? ''}`.trim(),
      folio: credito.folio,
      concepto: ticketModal.concepto,
      ficha: `#${ticketModal.numeroFicha}`,
      total: ticketModal.total,
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Detalle de crédito</h1>
          <p className="text-sm text-textMuted">Estado de cuenta completo del cliente.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-light" onClick={() => navigate(`/creditos/${credito.id}/estado-cuenta`)}>
            Estado de cuenta
          </button>
          {hayInteresPorCondonar && canCondonarInteresFicha && (
            <button type="button" className="btn btn-light" onClick={() => navigate(`/creditos/${credito.id}/condonacion`)}>
              Condonar interés
            </button>
          )}
          {canReestructurar && (
            <button className="btn btn-light" onClick={() => navigate(`/creditos/${credito.id}/reestructura`)}>
              Reestructurar
            </button>
          )}
          <button className="btn btn-light" onClick={() => navigate('/creditos')}>
            Volver
          </button>
        </div>
      </div>

      <CreditoInfoCards credito={credito} cuotasPagadas={cuotasPagadas} cuotasTotales={cuotasTotales} saldoPendiente={saldoPendiente} />

      <div className="card">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs uppercase text-textMuted tracking-wide font-semibold">Observaciones</p>
          {!obsEditMode ? (
            <button
              className="text-primaryBlue text-sm hover:underline"
              onClick={() => {
                setObsText(credito.observacion ?? '');
                setObsEditMode(true);
              }}
            >
              Editar
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                className="text-gray-500 text-sm hover:underline"
                onClick={() => setObsEditMode(false)}
                disabled={actualizarObsMutation.isPending}
              >
                Cancelar
              </button>
              <button
                className="text-primaryBlue text-sm hover:underline font-semibold"
                onClick={handleGuardarObservacion}
                disabled={actualizarObsMutation.isPending}
              >
                Guardar
              </button>
            </div>
          )}
        </div>
        {!obsEditMode ? (
          <p
            className="text-sm text-textDark cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors"
            onClick={() => {
              setObsText(credito.observacion ?? '');
              setObsEditMode(true);
            }}
          >
            {credito.observacion || <span className="text-gray-400 italic">No hay observaciones (clic para añadir)</span>}
          </p>
        ) : (
          <textarea
            className="input w-full min-h-[80px]"
            value={obsText}
            onChange={(e) => setObsText(e.target.value)}
            disabled={actualizarObsMutation.isPending}
            placeholder="Añade observaciones sobre el crédito o cliente..."
            autoFocus
          />
        )}
      </div>

      <FichasEstadoCuenta
        fichas={fichas}
        fichaSiguienteNum={fichaSiguiente?.num}
        onPagarFicha={
          canPagarFicha
            ? (numFicha, pendiente) => {
                setModalPago({ numFicha, pendiente });
                setModalType('pago');
                setMonto(pendiente);
                setMora(0);
                setMedioPago('Efectivo');
                setMontoEfectivo(0);
                setMontoTransferencia(0);
              }
            : undefined
        }
        onAbonar={
          canAbonarParcial
            ? (numFicha, pendiente) => {
                setModalPago({ numFicha, pendiente });
                setModalType('abono');
                setMonto(0);
                setMora(0);
                setMedioPago('Efectivo');
                setMontoEfectivo(0);
                setMontoTransferencia(0);
              }
            : undefined
        }
        onPenalizar={
          canPenalizarFicha
            ? (numFicha, pendiente, fechaFicha) => {
                setModalPago({ numFicha, pendiente });
                setModalType('penalizacion');
                setMonto(0);
                setMora(calcularMoraSugerida(fechaFicha));
                setMedioPago('Efectivo');
                setMontoEfectivo(0);
                setMontoTransferencia(0);
              }
            : undefined
        }
        onCondonarInteres={hayInteresPorCondonar && canCondonarInteresFicha ? handleCondonarInteres : undefined}
      />

      <PagoCuotaModal
        open={(modalType === 'pago' || modalType === 'abono') && Boolean(modalPago)}
        numFicha={modalPago?.numFicha ?? 0}
        monto={monto}
        maxMonto={modalPago?.pendiente}
        medio={medioPago}
        montoEfectivo={montoEfectivo}
        montoTransferencia={montoTransferencia}
        saving={savingFicha}
        onClose={() => {
          setModalPago(null);
          setModalType(null);
        }}
        onChangeMonto={modalType === 'abono' ? setMonto : undefined}
        onChangeMedio={setMedioPago}
        onChangeMontoEfectivo={setMontoEfectivo}
        onChangeMontoTransferencia={setMontoTransferencia}
        onConfirm={confirmPay}
      />

      <PenalizacionModal
        open={modalType === 'penalizacion'}
        numFicha={modalPago?.numFicha ?? 0}
        mora={mora}
        saving={savingFicha}
        onClose={() => setModalType(null)}
        onChangeMora={setMora}
        onConfirm={confirmPenalize}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />

      {ticketModal && (
        <ModalShell
          open
          onClose={() => setTicketModal(null)}
          title="Pago registrado con éxito"
          subtitle={`${ticketModal.concepto} · Ficha #${ticketModal.numeroFicha} · $${ticketModal.total.toLocaleString()}`}
          maxWidthClassName="max-w-sm"
          titleId="detalle-credito-ticket-modal-titulo"
          footer={
            <div className="flex flex-col gap-2 sm:flex-row">
              <button type="button" className="btn btn-primary w-full sm:flex-1" onClick={printTicket}>
                Imprimir ticket
              </button>
              <button type="button" className="btn btn-light w-full sm:flex-1" onClick={() => setTicketModal(null)}>
                Cerrar
              </button>
            </div>
          }
        >
          <p className="text-sm text-textMuted">Puedes reimprimir el ticket más tarde desde el historial de pagos.</p>
        </ModalShell>
      )}

      <HistorialPagos creditoId={credito.id} />
    </div>
  );
};

export default DetalleCredito;

