import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import StatusPanel from '../../../../infrastructure/ui/components/StatusPanel';
import { useAbonarFichasVigentesCreditoMutation, useCreditoByIdQuery, useCreditosQuery } from '../hooks/creditosHooks';
import { CreditoCard } from '../components/creditos/CreditoCard';
import { CreditosHeader } from '../components/creditos/CreditosHeader';
import { useCobranzaZonaFiltro } from '../../cobranza/hooks/useCobranzaZonaFiltro';
import { CobranzaZonaFiltroPanel } from '../../cobranza/components/cobranza/CobranzaZonaFiltroPanel';
import { useAuth } from '../../auth/context/useAuth';
import { asNumber, numberInputDisplay, parseNumberInput, type NumberInputValue } from '../../../../infrastructure/utils/numberInput';
import { getErrorMessage } from '../../../../infrastructure/utils/getErrorMessage';
import { ConfirmDialog } from '../../../../infrastructure/ui/components/ConfirmDialog';
import { ModalShell } from '../../../../infrastructure/ui/components/ModalShell';
import { fichasNoPagadasOrdenadasParaPagoMultiples } from '../../../../shared/creditos/fichasPagoOrden';

const PERM_CREDITOS_TODAS_ZONAS = 'CREDITO_LISTA_TODAS_ZONAS';

const Creditos = () => {
  const navigate = useNavigate();
  const { user, canBoton } = useAuth();
  const puedePagarFichasVigentesListado = canBoton('CREDITO_PAGAR_FICHA') || canBoton('CREDITO_ABONAR_FICHA');

  const [page, setPage] = useState(1);
  const pageSize = 50;
  const [searchTerm, setSearchTerm] = useState('');
  const [creditoPagoSeleccionado, setCreditoPagoSeleccionado] = useState<{ id: string; folio: string } | null>(null);
  const [cantidadFichasPago, setCantidadFichasPago] = useState<NumberInputValue>(1);
  const [medioPago, setMedioPago] = useState<'Efectivo' | 'Transferencia' | 'Mixto'>('Efectivo');
  const [montoEfectivo, setMontoEfectivo] = useState<NumberInputValue>(0);
  const [montoTransferencia, setMontoTransferencia] = useState<NumberInputValue>(0);
  const [confirmarPagoOpen, setConfirmarPagoOpen] = useState(false);

  const {
    puedeElegirZona,
    zonaFiltro,
    setZonaFiltro,
    zonaIdParam,
    zonas,
    zonasLoading,
    esZonaDelUsuario,
  } = useCobranzaZonaFiltro(PERM_CREDITOS_TODAS_ZONAS);

  const creditosQuery = useCreditosQuery({ searchTerm, page, pageSize, zonaId: zonaIdParam });
  const abonarFichasVigentesMutation = useAbonarFichasVigentesCreditoMutation();
  const creditoPagoDetalleQuery = useCreditoByIdQuery(creditoPagoSeleccionado?.id);

  const creditos = creditosQuery.data ?? [];
  const canGoNext = useMemo(() => creditos.length === pageSize, [creditos.length]);
  const fichasVigentesPago = useMemo(
    () => fichasNoPagadasOrdenadasParaPagoMultiples(creditoPagoDetalleQuery.data?.fichas ?? []),
    [creditoPagoDetalleQuery.data?.fichas],
  );
  const maxFichasVigentes = fichasVigentesPago.length;
  const cantidadFichasPagoN = Math.floor(asNumber(cantidadFichasPago));
  const cantidadFichasValida = cantidadFichasPagoN > 0 && cantidadFichasPagoN <= maxFichasVigentes;
  const montoPagoCalculado = useMemo(() => {
    if (!cantidadFichasValida) return 0;
    return fichasVigentesPago.slice(0, cantidadFichasPagoN).reduce((acc, ficha) => acc + (ficha.saldoPendiente ?? ficha.total ?? 0), 0);
  }, [cantidadFichasPagoN, cantidadFichasValida, fichasVigentesPago]);
  const totalMedioMixto = asNumber(montoEfectivo) + asNumber(montoTransferencia);
  const diferenciaMixto = montoPagoCalculado - totalMedioMixto;
  const medioValido = medioPago !== 'Mixto' || Math.abs(totalMedioMixto - montoPagoCalculado) <= 0.01;
  const puedeConfirmarPagoFichas = Boolean(creditoPagoSeleccionado) && !abonarFichasVigentesMutation.isPending && cantidadFichasValida && montoPagoCalculado > 0 && medioValido;

  const abrirModalPagarFichas = (creditoId: string, folio: string) => {
    setCreditoPagoSeleccionado({ id: creditoId, folio });
    setCantidadFichasPago(1);
    setMedioPago('Efectivo');
    setMontoEfectivo(0);
    setMontoTransferencia(0);
  };

  const seleccionarMedioPago = (medio: 'Efectivo' | 'Transferencia' | 'Mixto') => {
    setMedioPago(medio);
    if (medio === 'Mixto') {
      setMontoEfectivo(montoPagoCalculado);
      setMontoTransferencia(0);
    }
  };

  const cerrarModalPagarFichas = () => {
    setCreditoPagoSeleccionado(null);
    setCantidadFichasPago(1);
    setMedioPago('Efectivo');
    setMontoEfectivo(0);
    setMontoTransferencia(0);
    setConfirmarPagoOpen(false);
  };

  const handlePagarFichasVigentes = async () => {
    if (!creditoPagoSeleccionado || !puedeConfirmarPagoFichas) return;
    try {
      await abonarFichasVigentesMutation.mutateAsync({
        creditoId: creditoPagoSeleccionado.id,
        cantidadFichas: cantidadFichasPagoN,
        montoAbono: montoPagoCalculado,
        medio: medioPago,
        montoEfectivo: medioPago === 'Mixto' ? asNumber(montoEfectivo) : undefined,
        montoTransferencia: medioPago === 'Mixto' ? asNumber(montoTransferencia) : undefined,
      });
      toast.success('Pago de fichas registrado');
      cerrarModalPagarFichas();
      setConfirmarPagoOpen(false);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible registrar el pago de fichas vigentes'));
    }
  };

  return (
    <div className="space-y-6">
      <CreditosHeader 
        onNuevo={() => navigate('/creditos/nuevo')} 
        searchTerm={searchTerm} 
        onSearchTermChange={(val) => {
          setSearchTerm(val);
          setPage(1); // reset to page 1 on search
        }} 
      />

      <CobranzaZonaFiltroPanel
        user={user}
        puedeElegirZona={puedeElegirZona}
        zonas={zonas}
        zonasLoading={zonasLoading}
        zonaFiltro={zonaFiltro}
        onChangeZona={(val) => {
          setZonaFiltro(val);
          setPage(1);
        }}
        esZonaDelUsuario={esZonaDelUsuario}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="text-sm text-textMuted">
          Página <span className="font-semibold text-textDark">{page}</span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="btn btn-light" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            Anterior
          </button>
          <button type="button" className="btn btn-light" onClick={() => setPage((p) => p + 1)} disabled={!canGoNext}>
            Siguiente
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {creditosQuery.isLoading && <StatusPanel variant="loading" title="Cargando créditos" message="Consultando el servidor..." />}
        {creditosQuery.isError && <StatusPanel variant="error" title="No fue posible cargar créditos" message="Intenta nuevamente." />}
        {creditos.map((credito) => (
          <CreditoCard
            key={credito.id}
            credito={credito}
            onVerDetalles={() => navigate(`/creditos/${credito.id}`)}
            onPagarFichas={puedePagarFichasVigentesListado ? () => abrirModalPagarFichas(credito.id, credito.folio) : undefined}
          />
        ))}
        {!creditosQuery.isLoading && !creditosQuery.isError && creditos.length === 0 && (
          <StatusPanel variant="empty" title="Sin créditos" message="Crea un crédito para empezar." />
        )}
      </div>

      {creditoPagoSeleccionado && (
        <ModalShell
          open
          onClose={cerrarModalPagarFichas}
          title="Pagar fichas vigentes"
          subtitle={creditoPagoSeleccionado.folio}
          maxWidthClassName="max-w-md"
          titleId="creditos-pago-fichas-modal-titulo"
        >
          <div className="space-y-4">
            {creditoPagoDetalleQuery.isLoading && <StatusPanel variant="loading" title="Cargando crédito" message="Obteniendo fichas vigentes..." />}
            {creditoPagoDetalleQuery.isError && <StatusPanel variant="error" title="No fue posible cargar el crédito" message="Intenta nuevamente." />}

            {!creditoPagoDetalleQuery.isLoading && !creditoPagoDetalleQuery.isError && (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium text-textDark">Cantidad de fichas a pagar</label>
                  <input
                    type="number"
                    min={1}
                    max={Math.max(1, maxFichasVigentes)}
                    className="input w-full"
                    value={numberInputDisplay(cantidadFichasPago)}
                    onChange={(e) => setCantidadFichasPago(parseNumberInput(e.target.value))}
                  />
                  <p className="mt-1 text-xs text-textMuted">Vigentes disponibles: {maxFichasVigentes}</p>
                  {!cantidadFichasValida && <p className="mt-1 text-xs text-red-600">La cantidad no puede ser mayor a las fichas vigentes.</p>}
                </div>

                <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-textMuted">Monto a pagar</p>
                  <p className="text-2xl font-bold text-textDark">${montoPagoCalculado.toLocaleString()}</p>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-textDark">Tipo de pago</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Efectivo', 'Transferencia', 'Mixto'] as const).map((m) => (
                      <button key={m} type="button" className={`btn ${medioPago === m ? 'btn-primary' : 'btn-light'}`} onClick={() => seleccionarMedioPago(m)}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {medioPago === 'Mixto' && (
                  <div className="space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-textDark">Efectivo</label>
                        <div className="relative">
                          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-textMuted">$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="input w-full pl-7"
                            placeholder="0.00"
                            value={numberInputDisplay(montoEfectivo)}
                            onChange={(e) => setMontoEfectivo(parseNumberInput(e.target.value))}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-textDark">Transferencia</label>
                        <div className="relative">
                          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-textMuted">$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="input w-full pl-7"
                            placeholder="0.00"
                            value={numberInputDisplay(montoTransferencia)}
                            onChange={(e) => setMontoTransferencia(parseNumberInput(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-textMuted">Total capturado: <span className="font-semibold text-textDark">${totalMedioMixto.toLocaleString()}</span></p>
                      <p className={`text-xs ${medioValido ? 'text-emerald-600' : 'text-red-600'}`}>
                        Diferencia: ${Math.abs(diferenciaMixto).toLocaleString()}
                        {diferenciaMixto > 0 ? ' pendiente' : diferenciaMixto < 0 ? ' excedente' : ' exacto'}
                      </p>
                    </div>
                    {!medioValido && <p className="text-xs text-red-600">La suma de efectivo y transferencia debe coincidir con el monto a pagar.</p>}
                  </div>
                )}

                <button type="button" className="btn btn-primary w-full" disabled={!puedeConfirmarPagoFichas} onClick={() => setConfirmarPagoOpen(true)}>
                  {abonarFichasVigentesMutation.isPending ? 'Procesando...' : 'Confirmar pago'}
                </button>
              </>
            )}
          </div>
        </ModalShell>
      )}
      <ConfirmDialog
        isOpen={confirmarPagoOpen}
        title="Confirmar pago"
        message={`¿Registrar pago de ${cantidadFichasPagoN || 0} ficha(s) por $${montoPagoCalculado.toLocaleString()} al crédito ${creditoPagoSeleccionado?.folio ?? '-'}?`}
        confirmLabel="Pagar"
        cancelLabel="Cancelar"
        type="info"
        loading={abonarFichasVigentesMutation.isPending}
        onConfirm={() => void handlePagarFichasVigentes()}
        onCancel={() => setConfirmarPagoOpen(false)}
      />
    </div>
  );
};

export default Creditos;
