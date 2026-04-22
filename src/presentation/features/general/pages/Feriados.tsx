import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import StatusPanel from '../../../../infrastructure/ui/components/StatusPanel';
import { getErrorMessage } from '../../../../infrastructure/utils/getErrorMessage';
import type { FeriadoDto } from '../../../../domain/general/feriados';
import { useActualizarFeriadoMutation, useCrearFeriadoMutation, useEliminarFeriadoMutation, useFeriadosQuery } from '../hooks/generalHooks';
import { formatCalendarDateFromApi, localCalendarDayKey } from '../../../../shared/date/calendarDate';

const Feriados = () => {
  const feriadosQuery = useFeriadosQuery();
  const crearMutation = useCrearFeriadoMutation();
  const actualizarMutation = useActualizarFeriadoMutation();
  const eliminarMutation = useEliminarFeriadoMutation();

  const [fecha, setFecha] = useState(() => localCalendarDayKey());
  const [nombre, setNombre] = useState('');
  const [activo, setActivo] = useState(true);

  const feriados = useMemo(() => feriadosQuery.data ?? [], [feriadosQuery.data]);

  const crear = async () => {
    try {
      await crearMutation.mutateAsync({ fecha, nombre: nombre.trim(), activo });
      toast.success('Feriado creado');
      setNombre('');
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible crear el feriado'));
    }
  };

  const toggleActivo = async (item: FeriadoDto) => {
    try {
      await actualizarMutation.mutateAsync({ id: item.id, payload: { fecha: item.fecha, nombre: item.nombre, activo: !item.activo } });
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible actualizar el feriado'));
    }
  };

  const eliminar = async (id: string) => {
    if (!confirm('¿Eliminar feriado?')) return;
    try {
      await eliminarMutation.mutateAsync(id);
      toast.success('Feriado eliminado');
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible eliminar el feriado'));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Feriados</h1>
        <p className="text-sm text-textMuted">Catálogo de fechas que el sistema puede considerar inhábiles.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="form-label">Fecha</label>
            <input className="form-input" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </div>
          <div>
            <label className="form-label">Nombre</label>
            <input className="form-input" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Año Nuevo" />
          </div>
          <div className="flex items-end gap-2">
            <label className="flex items-center gap-2 text-sm text-textDark">
              <input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} />
              Activo
            </label>
            <button type="button" className="btn btn-primary ml-auto" disabled={crearMutation.isPending || !nombre.trim()} onClick={crear}>
              Agregar
            </button>
          </div>
        </div>
      </div>

      {feriadosQuery.isLoading && <StatusPanel variant="loading" title="Cargando feriados" message="Consultando el servidor..." />}
      {feriadosQuery.isError && <StatusPanel variant="error" title="No fue posible cargar feriados" message="Intenta nuevamente." />}

      {!feriadosQuery.isLoading && !feriadosQuery.isError && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left p-3">Fecha</th>
                <th className="text-left p-3">Nombre</th>
                <th className="text-left p-3">Activo</th>
                <th className="text-right p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {feriados.map((f) => (
                <tr key={f.id} className="border-t border-gray-100">
                  <td className="p-3 whitespace-nowrap">{formatCalendarDateFromApi(f.fecha)}</td>
                  <td className="p-3">{f.nombre}</td>
                  <td className="p-3">
                    <button type="button" className="btn btn-light" onClick={() => toggleActivo(f)} disabled={actualizarMutation.isPending}>
                      {f.activo ? 'Sí' : 'No'}
                    </button>
                  </td>
                  <td className="p-3 text-right">
                    <button type="button" className="btn btn-light" onClick={() => eliminar(f.id)} disabled={eliminarMutation.isPending}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {feriados.length === 0 && <div className="p-10 text-center text-textMuted">Sin feriados registrados.</div>}
        </div>
      )}
    </div>
  );
};

export default Feriados;

