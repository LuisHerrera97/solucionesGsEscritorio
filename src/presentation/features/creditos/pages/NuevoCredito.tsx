import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../../../../infrastructure/utils/getErrorMessage';
import { asNumber, type NumberInputValue } from '../../../../infrastructure/utils/numberInput';
import { useAuth } from '../../auth/context/useAuth';
import { useCrearCreditoMutation } from '../hooks/creditosHooks';
import { useConfiguracionSistemaQuery } from '../../general/hooks/generalHooks';
import { ConfirmarNuevoCreditoModal } from '../components/nuevoCredito/ConfirmarNuevoCreditoModal';
import { NuevoCreditoForm } from '../components/nuevoCredito/NuevoCreditoForm';
import { NuevoCreditoResumen } from '../components/nuevoCredito/NuevoCreditoResumen';

const NUEVO_CREDITO_FORM_ID = 'nuevo-credito-form';

const NuevoCredito = () => {
  const navigate = useNavigate();
  const { canBoton } = useAuth();
  const canCrear = canBoton('CREDITO_CREAR');

  const configQuery = useConfiguracionSistemaQuery();

  const config = configQuery.data;

  const [clienteId, setClienteId] = useState('');
  const [clienteNombre, setClienteNombre] = useState('');
  const [monto, setMonto] = useState<NumberInputValue>(0);
  const [plazo, setPlazo] = useState<NumberInputValue>(13);
  const [tipo, setTipo] = useState<'diario' | 'semanal' | 'mensual'>('semanal');
  const [permitirDomingo, setPermitirDomingo] = useState<boolean | null>(null);
  const [aplicarFeriados, setAplicarFeriados] = useState<boolean | null>(null);
  const [tasaManual, setTasaManual] = useState<number | null>(null);
  const [observacion, setObservacion] = useState('');
  const [confirmarOpen, setConfirmarOpen] = useState(false);
  const selectedClienteId = clienteId;

  const crearMutation = useCrearCreditoMutation();

  const permitirDomingoValue = useMemo(() => {
    const defaultValue = config ? !config.domingoInhabilDefault : false;
    return permitirDomingo ?? defaultValue;
  }, [permitirDomingo, config]);
  const aplicarFeriadosValue = useMemo(() => {
    const defaultValue = config ? config.aplicarFeriadosDefault : false;
    return aplicarFeriados ?? defaultValue;
  }, [aplicarFeriados, config]);

  const ejecutarCreacion = useCallback(async () => {
    const mNum = asNumber(monto);
    const pNum = asNumber(plazo);
    if (!selectedClienteId || mNum <= 0 || pNum <= 0) return;
    try {
      await crearMutation.mutateAsync({
        clienteId: selectedClienteId,
        monto: mNum,
        plazo: pNum,
        tipo,
        permitirDomingo: permitirDomingoValue,
        aplicarFeriados: aplicarFeriadosValue,
        tasaManual: tasaManual ?? undefined,
        observacion,
      });
      toast.success('Crédito creado');
      setConfirmarOpen(false);
      navigate('/creditos');
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible crear el crédito'));
    }
  }, [
    aplicarFeriadosValue,
    crearMutation,
    monto,
    navigate,
    observacion,
    permitirDomingoValue,
    plazo,
    selectedClienteId,
    tasaManual,
    tipo,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mNum = asNumber(monto);
    const pNum = asNumber(plazo);
    if (!selectedClienteId) {
      toast.error('Selecciona un cliente');
      return;
    }
    if (mNum <= 0) {
      toast.error('Indica un monto mayor a cero');
      return;
    }
    if (pNum <= 0) {
      toast.error('Indica un plazo válido');
      return;
    }
    setConfirmarOpen(true);
  };

  const tasaDefault = tipo === 'diario' ? (config?.tasaDiaria ?? 0) : (tipo === 'semanal' ? (config?.tasaSemanal ?? 0) : (config?.tasaMensual ?? 0));
  const tasa = tasaManual ?? tasaDefault;
  const montoNum = asNumber(monto);
  const plazoNum = asNumber(plazo);
  const interesTotal = Math.round(montoNum * tasa);
  const total = montoNum + interesTotal;
  const cuota = plazoNum > 0 ? Math.ceil(total / plazoNum) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nuevo Crédito</h1>
          <p className="text-sm text-textMuted">
            Registra un nuevo crédito para un cliente existente.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
        <NuevoCreditoForm
          formId={NUEVO_CREDITO_FORM_ID}
          selectedClienteId={selectedClienteId}
          monto={monto}
          plazo={plazo}
          tipo={tipo}
          permitirDomingo={permitirDomingoValue}
          aplicarFeriados={aplicarFeriadosValue}
          onChangeClienteId={setClienteId}
          onClienteEtiqueta={setClienteNombre}
          onChangeMonto={setMonto}
          onChangePlazo={setPlazo}
          onChangeTipo={setTipo}
          onChangePermitirDomingo={(v) => setPermitirDomingo(v)}
          onChangeAplicarFeriados={(v) => setAplicarFeriados(v)}
          onSubmit={handleSubmit}
          submitting={crearMutation.isPending}
          tasaManual={tasaManual}
          tasaDefault={tasaDefault}
          observacion={observacion}
          onChangeTasaManual={setTasaManual}
          onChangeObservacion={setObservacion}
        />

        <div className="flex flex-col gap-4">
          <NuevoCreditoResumen tipo={tipo} monto={monto} tasa={tasa} interesTotal={interesTotal} total={total} cuota={cuota} />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => navigate('/creditos')} className="btn btn-light">
              Cancelar
            </button>
            <button
              type="submit"
              form={NUEVO_CREDITO_FORM_ID}
              className="btn btn-primary"
              disabled={!canCrear || crearMutation.isPending || !selectedClienteId}
            >
              {crearMutation.isPending ? 'Creando...' : 'Crear Crédito'}
            </button>
          </div>
        </div>
      </div>

      <ConfirmarNuevoCreditoModal
        open={confirmarOpen}
        clienteNombre={clienteNombre}
        tipo={tipo}
        monto={monto}
        plazo={plazo}
        tasa={tasa}
        interesTotal={interesTotal}
        total={total}
        cuota={cuota}
        saving={crearMutation.isPending}
        onClose={() => setConfirmarOpen(false)}
        onConfirm={ejecutarCreacion}
      />
    </div>
  );
};

export default NuevoCredito;
