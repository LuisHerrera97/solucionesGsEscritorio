import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, DollarSign, Users } from 'lucide-react';
import type { MovimientoCajaDto } from '../../../../domain/finanzas/caja/types';
import { useCajaMovimientosRangoQuery, useClientesQuery, useCreditosQuery, useDashboardResumenQuery } from '../hooks/finanzasHooks';
import { ActividadRecienteTable } from '../components/dashboard/ActividadRecienteTable';
import { CobradoPorDiaChart } from '../components/dashboard/CobradoPorDiaChart';
import { CobradoVencidoChart } from '../components/dashboard/CobradoVencidoChart';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { MedioPagoPie } from '../components/dashboard/MedioPagoPie';
import { StatCard } from '../components/dashboard/StatCard';
import { calendarDayKeyFromApi, formatCalendarDateFromApi, localCalendarDayKey, parseCalendarDateFromApi } from '../../../../shared/date/calendarDate';

const today = () => localCalendarDayKey();

const Dashboard = () => {
  const navigate = useNavigate();
  const [fechaDesde, setFechaDesde] = useState(today());
  const [fechaHasta, setFechaHasta] = useState(today());

  const clientesQuery = useClientesQuery({ page: 1, pageSize: 1 });
  const dashboardResumenQuery = useDashboardResumenQuery();
  const creditosQuery = useCreditosQuery();
  const movimientosQuery = useCajaMovimientosRangoQuery({ fechaDesde, fechaHasta });

  const creditos = useMemo(() => creditosQuery.data ?? [], [creditosQuery.data]);
  const movimientosRango = useMemo<MovimientoCajaDto[]>(() => movimientosQuery.data ?? [], [movimientosQuery.data]);

  const resumen = dashboardResumenQuery.data;
  const totalClientes = resumen?.totalClientes ?? clientesQuery.data?.totalCount ?? 0;
  const creditosActivos = resumen?.creditosActivos ?? creditos.filter(c => c.estatus === 'Activo').length;
  const totalVencido = resumen?.totalVencido ?? 0;

  const cobradoPeriodo = movimientosRango
    .filter(m => (m.tipo === 'Ficha' || m.tipo === 'Ingreso') && m.total > 0)
    .reduce((acc, curr) => acc + curr.total, 0);
  const ingresoPeriodo = cobradoPeriodo;

  // Gráfica Cobrado (período) vs Vencido (pendiente actual)
  const chartCobradoVencido = [
    { name: 'Cobrado (período)', monto: cobradoPeriodo, fill: '#22c55e' },
    { name: 'Vencido (pendiente)', monto: totalVencido, fill: '#f59e0b' },
  ];

  // Lo cobrado por medio de pago (efectivo / transferencia) en el período
  const efectivo = movimientosRango
    .filter(m => m.total > 0)
    .reduce((a, m) => a + (m.montoEfectivo ?? (m.medio === 'Efectivo' ? m.total : 0)), 0);
  const transferencia = movimientosRango
    .filter(m => m.total > 0)
    .reduce((a, m) => a + (m.montoTransferencia ?? (m.medio === 'Transferencia' ? m.total : 0)), 0);
  const chartPorMedio = [
    { name: 'Efectivo', value: efectivo, color: '#10b981' },
    { name: 'Transferencia', value: transferencia, color: '#3b82f6' },
  ].filter(d => d.value > 0);

  // Lo cobrado por día en el rango (solo ingresos, sin gastos)
  const cobradoPorDia = useMemo(() => {
    const map = new Map<string, number>();
    const desde = parseCalendarDateFromApi(fechaDesde);
    const hasta = parseCalendarDateFromApi(fechaHasta);
    if (!desde || !hasta) return [];
    for (let d = new Date(desde); d <= hasta; d.setDate(d.getDate() + 1)) {
      map.set(localCalendarDayKey(d), 0);
    }
    movimientosRango.forEach(m => {
      if (m.total <= 0) return;
      const key = calendarDayKeyFromApi(m.fecha);
      if (!key) return;
      const prev = map.get(key) ?? 0;
      map.set(key, prev + m.total);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([fecha, cobrado]) => ({
        fecha: formatCalendarDateFromApi(fecha, { day: '2-digit', month: 'short', year: 'numeric' }),
        cobrado,
      }));
  }, [movimientosRango, fechaDesde, fechaHasta]);

  return (
    <div className="space-y-6">
      <DashboardHeader fechaDesde={fechaDesde} fechaHasta={fechaHasta} onChangeFechaDesde={setFechaDesde} onChangeFechaHasta={setFechaHasta} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Clientes Totales" 
          value={totalClientes.toString()} 
          icon={Users} 
          color="bg-blue-500"
          onClick={() => navigate('/clientes')}
        />
        <StatCard 
          title="Créditos Activos" 
          value={creditosActivos.toString()} 
          icon={Activity} 
          color="bg-green-500"
          onClick={() => navigate('/creditos')}
        />
        <StatCard
          title="Saldo vencido (fichas)"
          value={`$${totalVencido.toLocaleString()}`}
          icon={DollarSign}
          color="bg-orange-500"
          onClick={() => navigate('/pendientes')}
        />
        <StatCard 
          title={fechaDesde === fechaHasta ? 'Ingreso del Día' : 'Ingreso del Período'} 
          value={`$${ingresoPeriodo.toLocaleString()}`} 
          icon={DollarSign} 
          color="bg-purple-500"
          onClick={() => navigate('/caja')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CobradoVencidoChart data={chartCobradoVencido} />
        <MedioPagoPie data={chartPorMedio} />
      </div>

      <CobradoPorDiaChart data={cobradoPorDia} />

      <ActividadRecienteTable movimientos={movimientosRango} isLoading={movimientosQuery.isLoading} isError={movimientosQuery.isError} />
    </div>
  );
};

export default Dashboard;
