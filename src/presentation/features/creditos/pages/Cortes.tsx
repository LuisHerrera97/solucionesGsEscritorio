import { useState } from 'react';
import { useCortesQuery } from '../hooks/creditosHooks';
import { CortesFilters } from '../components/cortes/CortesFilters';
import { CortesStats } from '../components/cortes/CortesStats';
import { CortesTable } from '../components/cortes/CortesTable';

const Cortes = () => {
  const [fechaInicio, setFechaInicio] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [fechaFin, setFechaFin] = useState(() => new Date().toISOString().split('T')[0]);
  const [expandido, setExpandido] = useState<string | null>(null);

  const cortesQuery = useCortesQuery({ fechaInicio, fechaFin });

  const cortesFiltrados = (cortesQuery.data ?? []).slice().sort((a, b) => {
    const fa = a.fecha ?? '';
    const fb = b.fecha ?? '';
    const ha = a.hora ?? '';
    const hb = b.hora ?? '';
    return fb.localeCompare(fa) || hb.localeCompare(ha);
  });

  const totalTeorico = cortesFiltrados.reduce((s, c) => s + c.totalTeorico, 0);
  const totalReal = cortesFiltrados.reduce((s, c) => s + c.totalReal, 0);
  const totalDiferencia = cortesFiltrados.reduce((s, c) => s + c.diferencia, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Registro de cortes</h1>
          <p className="text-sm text-textMuted">Consulta los cortes de caja por rango de fecha.</p>
        </div>
      </div>

      <CortesFilters fechaInicio={fechaInicio} fechaFin={fechaFin} onChangeFechaInicio={setFechaInicio} onChangeFechaFin={setFechaFin} />

      <CortesStats cantidad={cortesFiltrados.length} totalTeorico={totalTeorico} totalReal={totalReal} totalDiferencia={totalDiferencia} />

      <div className="space-y-0">
        <CortesTable cortes={cortesFiltrados} expandido={expandido} onToggleExpand={(id) => setExpandido(id || null)} />
        {cortesQuery.isLoading && <div className="py-12 text-center text-textMuted">Cargando...</div>}
        {cortesQuery.isError && <div className="py-12 text-center text-red-600">No fue posible cargar los cortes.</div>}
        {!cortesQuery.isLoading && !cortesQuery.isError && cortesFiltrados.length === 0 && <div className="py-12 text-center text-textMuted">No hay cortes en el rango de fechas seleccionado.</div>}
      </div>
    </div>
  );
};

export default Cortes;

