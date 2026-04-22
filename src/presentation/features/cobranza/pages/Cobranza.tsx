import { useMemo, useState } from 'react';
import { useDebouncedValue } from '../../../../infrastructure/hooks/useDebouncedValue';
import { useCobranzaQuery } from '../hooks/cobranzaHooks';
import { useCobranzaZonaFiltro } from '../hooks/useCobranzaZonaFiltro';
import { CobranzaFilters } from '../components/cobranza/CobranzaFilters';
import { CobranzaMovimientoCard } from '../components/cobranza/CobranzaMovimientoCard';
import { CobranzaSummary } from '../components/cobranza/CobranzaSummary';
import { CobranzaZonaFiltroPanel } from '../components/cobranza/CobranzaZonaFiltroPanel';
import { useAuth } from '../../auth/context/useAuth';

const Cobranza = () => {
  const { user } = useAuth();
  const zonaCtx = useCobranzaZonaFiltro('COBRANZA_TODAS_ZONAS');

  const [fechaInicio, setFechaInicio] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [fechaFin, setFechaFin] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [busqueda, setBusqueda] = useState('');
  const busquedaDebounced = useDebouncedValue(busqueda);

  const cobranzaQuery = useCobranzaQuery({
    fechaInicio,
    fechaFin,
    busqueda: busquedaDebounced,
    zonaId: zonaCtx.zonaIdParam,
  });

  const movimientos = useMemo(() => cobranzaQuery.data ?? [], [cobranzaQuery.data]);

  const totalAbono = movimientos.reduce((sum, item) => sum + (item.abono ?? 0), 0);
  const totalMora = movimientos.reduce((sum, item) => sum + (item.mora ?? 0), 0);
  const totalCobrado = movimientos.reduce((sum, item) => sum + (item.totalCobrado ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Cobranza</h1>
          <p className="text-sm text-textMuted">Registro por rango de fechas de pagos de fichas, penalizaciones y abonos.</p>
        </div>
      </div>

      <CobranzaZonaFiltroPanel
        user={user}
        puedeElegirZona={zonaCtx.puedeElegirZona}
        zonas={zonaCtx.zonas}
        zonasLoading={zonaCtx.zonasLoading}
        zonaFiltro={zonaCtx.zonaFiltro}
        onChangeZona={zonaCtx.setZonaFiltro}
        esZonaDelUsuario={zonaCtx.esZonaDelUsuario}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4">
        <CobranzaFilters
          fechaInicio={fechaInicio}
          fechaFin={fechaFin}
          busqueda={busqueda}
          onChangeFechaInicio={setFechaInicio}
          onChangeFechaFin={setFechaFin}
          onChangeBusqueda={setBusqueda}
        />
        <CobranzaSummary movimientos={movimientos.length} totalAbono={totalAbono} totalMora={totalMora} totalCobrado={totalCobrado} />

        <div className="space-y-3 pt-2">
          {cobranzaQuery.isLoading && <div className="py-8 text-center text-textMuted">Cargando...</div>}
          {cobranzaQuery.isError && <div className="py-8 text-center text-red-600">No fue posible cargar la cobranza</div>}
          {!cobranzaQuery.isLoading &&
            !cobranzaQuery.isError &&
            movimientos.map((item) => (
              <CobranzaMovimientoCard key={`${item.creditoId}-${item.numFicha}-${item.fechaPago}-${item.horaPago}`} item={item} />
            ))}

          {!cobranzaQuery.isLoading && !cobranzaQuery.isError && movimientos.length === 0 && (
            <div className="py-8 text-center text-textMuted">No hay pagos registrados en el rango de fechas seleccionado.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cobranza;
