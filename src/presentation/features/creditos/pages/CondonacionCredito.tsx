import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import StatusPanel from '../../../../infrastructure/ui/components/StatusPanel';
import { getErrorMessage } from '../../../../infrastructure/utils/getErrorMessage';
import { asNumber, type NumberInputValue } from '../../../../infrastructure/utils/numberInput';
import { useCreditoByIdQuery, useCondonarInteresMontoMutation } from '../hooks/creditosHooks';

const CondonacionCredito = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const creditoQuery = useCreditoByIdQuery(id);
  const condonarMontoMutation = useCondonarInteresMontoMutation();

  const [monto, setMonto] = useState<NumberInputValue>(0);

  const credito = creditoQuery.data;

  const handleCondonar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !credito) return;

    const montoNum = asNumber(monto);
    if (montoNum <= 0) {
      toast.error('El monto debe ser mayor a 0');
      return;
    }

    const fichasPendientes = credito.fichas.filter((f) => !f.pagada);
    const interesTotalPendiente = fichasPendientes.reduce((acc, f) => acc + (f.interes ?? 0), 0);

    if (montoNum > interesTotalPendiente) {
      toast.error('El monto no puede superar el interés pendiente de las fichas no pagadas.');
      return;
    }

    if (!window.confirm(`¿Estás seguro de condonar $${montoNum} de intereses? Esta acción descontará el interés a las fichas pendientes en orden.`)) {
      return;
    }

    try {
      await condonarMontoMutation.mutateAsync({ creditoId: id, monto: montoNum });
      toast.success('Interés global condonado exitosamente');
      navigate(`/creditos/${id}`);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible condonar el interés global'));
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

  const fichasPendientes = credito.fichas.filter((f) => !f.pagada);
  const interesTotalPendiente = fichasPendientes.reduce((acc, f) => acc + (f.interes ?? 0), 0);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Condonación de Interés</h1>
          <p className="text-sm text-textMuted">Aplica un descuento global a los intereses pendientes.</p>
        </div>
        <button className="btn btn-light" onClick={() => navigate(`/creditos/${credito.id}`)}>
          Volver al crédito
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs uppercase text-textMuted tracking-wide">Crédito</p>
            <p className="text-lg font-semibold text-textDark">{credito.folio}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-xs uppercase text-blue-600 tracking-wide">Interés total pendiente</p>
            <p className="text-lg font-semibold text-blue-800">${interesTotalPendiente.toLocaleString()}</p>
          </div>
        </div>

        <form onSubmit={handleCondonar} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monto a condonar ($)</label>
            <input
              type="number"
              required
              min="0.01"
              max={interesTotalPendiente}
              step="0.01"
              value={monto}
              onChange={(e) => setMonto(e.target.value as unknown as NumberInputValue)}
              className="input w-full"
              placeholder="Ej. 150.00"
            />
            <p className="mt-1 text-xs text-textMuted">El monto se descontará de los intereses de las fichas pendientes, empezando por la más antigua.</p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button type="button" className="btn btn-light" onClick={() => navigate(`/creditos/${credito.id}`)}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={condonarMontoMutation.isPending || asNumber(monto) <= 0 || asNumber(monto) > interesTotalPendiente}>
              {condonarMontoMutation.isPending ? 'Condonando...' : 'Aplicar condonación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CondonacionCredito;
