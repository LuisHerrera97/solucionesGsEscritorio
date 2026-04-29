import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import StatusPanel from '../../../../infrastructure/ui/components/StatusPanel';
import { getErrorMessage } from '../../../../infrastructure/utils/getErrorMessage';
import { asNumber, type NumberInputValue } from '../../../../infrastructure/utils/numberInput';
import { useCreditoByIdQuery, useReestructurarCreditoMutation } from '../hooks/creditosHooks';
import { ReestructuraForm } from '../components/reestructura/ReestructuraForm';
import { ReestructuraInfoCards } from '../components/reestructura/ReestructuraInfoCards';

const Reestructura = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const creditoQuery = useCreditoByIdQuery(id);

  const credito = creditoQuery.data;

  const [montoExtra, setMontoExtra] = useState<NumberInputValue>(0);
  const [nuevoPlazo, setNuevoPlazo] = useState<NumberInputValue>(0);

  const reestructuraMutation = useReestructurarCreditoMutation();

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

  const saldoPendiente = credito.total - credito.pagado;
  const plazoDefault = (nuevoPlazo === '' ? 0 : nuevoPlazo) || credito.totalFichas;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const plazo = plazoDefault;
    if (plazo <= 0) return;
    const nuevoMonto = saldoPendiente + Math.max(0, asNumber(montoExtra));
    try {
      await reestructuraMutation.mutateAsync({
        creditoId: credito.id,
        nuevoMonto,
        nuevoPlazo: plazo,
        tipo: credito.tipo,
      });
      toast.success('Crédito reestructurado');
      navigate('/creditos');
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible reestructurar el crédito'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reestructura de crédito</h1>
          <p className="text-sm text-textMuted">
            Se toma el saldo pendiente (después de los abonos ya aplicados), se puede agregar monto extra y se genera un nuevo crédito con nuevo plazo.
          </p>
        </div>
        <button className="btn btn-light" onClick={() => navigate(-1)}>
          Volver
        </button>
      </div>

      <ReestructuraInfoCards credito={credito} saldoPendiente={saldoPendiente} />
      <ReestructuraForm
        saldoPendiente={saldoPendiente}
        montoExtra={montoExtra}
        plazo={nuevoPlazo}
        plazoFallback={credito.totalFichas}
        onChangeMontoExtra={setMontoExtra}
        onChangePlazo={setNuevoPlazo}
        onCancel={() => navigate(-1)}
        onSubmit={handleSubmit}
        submitting={reestructuraMutation.isPending}
      />
    </div>
  );
};

export default Reestructura;

