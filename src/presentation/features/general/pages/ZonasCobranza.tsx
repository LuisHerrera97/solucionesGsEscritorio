import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import type { ZonaCobranzaDto } from '../../../../domain/general/types';
import { getErrorMessage } from '../../../../infrastructure/utils/getErrorMessage';
import { asNumber, type NumberInputValue } from '../../../../infrastructure/utils/numberInput';
import {
  useActualizarZonaCobranzaMutation,
  useCrearZonaCobranzaMutation,
  useEliminarZonaCobranzaMutation,
  useZonasCobranzaQuery,
} from '../hooks/generalHooks';
import { NuevaZonaForm } from '../components/zonas/NuevaZonaForm';
import { ZonasCobranzaTable } from '../components/zonas/ZonasCobranzaTable';

const ZonasCobranza = () => {
  const zonasQuery = useZonasCobranzaQuery();

  const zonas = useMemo(() => zonasQuery.data ?? [], [zonasQuery.data]);
  const [nombre, setNombre] = useState('');
  const [orden, setOrden] = useState<NumberInputValue>(0);

  const createMutation = useCrearZonaCobranzaMutation();
  const updateMutation = useActualizarZonaCobranzaMutation();
  const deleteMutation = useEliminarZonaCobranzaMutation();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    try {
      await createMutation.mutateAsync({ nombre: nombre.trim(), orden: asNumber(orden) });
      toast.success('Zona agregada');
      setNombre('');
      setOrden(0);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible agregar la zona'));
    }
  };

  const handleToggleActivo = async (zona: ZonaCobranzaDto) => {
    try {
      await updateMutation.mutateAsync({ id: zona.id, payload: { ...zona, activo: !zona.activo } });
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible actualizar la zona'));
    }
  };

  const handleUpdateOrden = async (zona: ZonaCobranzaDto, nextOrden: number) => {
    if (Number.isNaN(nextOrden)) return;
    try {
      await updateMutation.mutateAsync({ id: zona.id, payload: { ...zona, orden: nextOrden } });
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible actualizar la zona'));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Zonas de Cobranza</h1>
        <p className="text-sm text-textMuted mt-1">Administra colonias o zonas para asignación de clientes.</p>
      </div>

      <NuevaZonaForm
        nombre={nombre}
        orden={orden}
        loading={createMutation.isPending}
        onChangeNombre={setNombre}
        onChangeOrden={setOrden}
        onSubmit={handleCreate}
      />

      <ZonasCobranzaTable
        zonas={zonas}
        isLoading={zonasQuery.isLoading}
        isError={zonasQuery.isError}
        isMutating={updateMutation.isPending}
        isDeleting={deleteMutation.isPending}
        onToggleActivo={handleToggleActivo}
        onUpdateOrden={handleUpdateOrden}
        onDelete={async (zona) => {
          try {
            await deleteMutation.mutateAsync(zona.id);
            toast.success('Zona eliminada');
          } catch (err: unknown) {
            toast.error(getErrorMessage(err, 'No fue posible eliminar la zona'));
          }
        }}
      />
    </div>
  );
};

export default ZonasCobranza;
