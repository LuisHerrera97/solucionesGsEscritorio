import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../../../../infrastructure/utils/getErrorMessage';
import { asNumber, type NumberInputValue } from '../../../../infrastructure/utils/numberInput';
import {
  useCajaMovimientosRangoQuery,
  useCajaTurnoQuery,
  useRealizarCorteMutation,
} from '../hooks/finanzasHooks';
import { CajaHeader } from '../components/caja/CajaHeader';
import { CajaStats } from '../components/caja/CajaStats';

import { TurnoResumen } from '../components/caja/TurnoResumen';
import { useAuth } from '../../auth/context/useAuth';
import { formatCalendarDateFromApi } from '../../../../shared/date/calendarDate';
import { ConfirmDialog } from '../../../../infrastructure/ui/components/ConfirmDialog';

const today = () => new Date().toISOString().split('T')[0];

function efectivoMov(m: { total: number; montoEfectivo?: number | null; medio: string }): number {
  if (m.total < 0) return 0;
  if (m.montoEfectivo != null) return m.montoEfectivo;
  return m.medio === 'Efectivo' ? m.total : 0;
}
function transferenciaMov(m: { total: number; montoTransferencia?: number | null; medio: string }): number {
  if (m.total < 0) return 0;
  if (m.montoTransferencia != null) return m.montoTransferencia;
  return m.medio === 'Transferencia' ? m.total : 0;
}

const Caja = () => {
  const { canBoton } = useAuth();
  const canCorte = canBoton('CAJA_REALIZAR_CORTE');
  const [totalReal, setTotalReal] = useState<NumberInputValue>(0);
  const [fechaDesde, setFechaDesde] = useState(today());
  const [fechaHasta, setFechaHasta] = useState(today());

  const [modalCerrarTurno, setModalCerrarTurno] = useState(false);
  const turnoQuery = useCajaTurnoQuery({ fecha: fechaDesde });
  const rangoQuery = useCajaMovimientosRangoQuery({ fechaDesde, fechaHasta });
  const corteMutation = useRealizarCorteMutation();

  const movimientosTurno = useMemo(() => turnoQuery.data ?? [], [turnoQuery.data]);
  const movimientosRango = useMemo(() => rangoQuery.data ?? [], [rangoQuery.data]);

  const confirmCerrarTurno = async () => {
    try {
      await corteMutation.mutateAsync({
        totalReal: asNumber(totalReal),
        fechaCorte: fechaDesde,
      });
      toast.success('Corte realizado');
      setTotalReal(0);
      setModalCerrarTurno(false);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible realizar el corte'));
    }
  };




  const totalCaja = movimientosTurno.reduce((acc, curr) => acc + curr.total, 0);

  const ingresosRango = useMemo(() => movimientosRango.filter((m) => m.total > 0 && m.recibidoCaja), [movimientosRango]);
  const fichasPagadas = ingresosRango.filter((m) => m.tipo === 'Ficha').length;
  const totalEfectivo = ingresosRango.reduce((acc, m) => acc + efectivoMov(m), 0);
  const totalTransferencia = ingresosRango.reduce((acc, m) => acc + transferenciaMov(m), 0);
  const esperadoEfectivo = totalEfectivo;



  return (
    <div className="space-y-6">
      <CajaHeader
        fechaDesde={fechaDesde}
        fechaHasta={fechaHasta}
        onChangeFechaDesde={setFechaDesde}
        onChangeFechaHasta={setFechaHasta}
      />

      <CajaStats fichasPagadas={fichasPagadas} totalEfectivo={totalEfectivo} totalTransferencia={totalTransferencia} esperadoEfectivo={esperadoEfectivo} />

      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <TurnoResumen
            totalCaja={totalCaja}
            totalReal={totalReal}
            onChangeTotalReal={setTotalReal}
            onCerrarTurno={canCorte ? () => setModalCerrarTurno(true) : undefined}
            cerrando={corteMutation.isPending}
            diaTurnoLabel={formatCalendarDateFromApi(fechaDesde)}
          />
        </div>
      </div>

      <ConfirmDialog
        isOpen={modalCerrarTurno}
        title="Corte de Caja"
        message={`¿Está seguro de realizar el corte de caja? Se registrará el corte con el total real indicado ($${asNumber(totalReal).toLocaleString()}).`}
        onConfirm={confirmCerrarTurno}
        onCancel={() => setModalCerrarTurno(false)}
        loading={corteMutation.isPending}
        confirmLabel="Confirmar Corte"
        cancelLabel="Cancelar"
        type="warning"
      />


    </div>
  );
};

export default Caja;
