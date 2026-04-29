import { useMemo } from 'react';
import { CheckCircle, Calculator } from 'lucide-react';
import type { CreditoApi } from '../../../../../application/creditos/creditosAppService';
import { calendarDayKeyFromApi, formatCalendarDateFromApi, localCalendarDayKey } from '../../../../../shared/date/calendarDate';

type FichasEstadoCuentaProps = {
  fichas: CreditoApi['fichas'];
  /** Ficha mínima no pagada (solo referencia visual “orden sugerido”). */
  fichaSiguienteNum?: number;
  onPagarFicha?: (numFicha: number, pendiente: number, fechaFicha: string) => void;
  onAbonar?: (numFicha: number, pendiente: number, fechaFicha: string) => void;
  onPenalizar?: (numFicha: number, pendiente: number, fechaFicha: string) => void;
  onCondonarInteres?: (numFicha: number) => void;
};

export const FichasEstadoCuenta = ({
  fichas,
  fichaSiguienteNum,
  onPagarFicha,
  onAbonar,
  onPenalizar,
  onCondonarInteres,
}: FichasEstadoCuentaProps) => {
  const totales = useMemo(() => {
    return fichas.reduce(
      (acc, f) => {
        const moraAcum = f.moraAcumulada ?? 0;
        const abonoAcum = f.abonoAcumulado ?? 0;

        return {
          capital: acc.capital + f.capital,
          interes: acc.interes + f.interes,
          mora: acc.mora + moraAcum,
          abono: acc.abono + abonoAcum,
          saldo: acc.saldo + (f.saldoPendiente ?? 0),
        };
      },
      { capital: 0, interes: 0, mora: 0, abono: 0, saldo: 0 },
    );
  }, [fichas]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primaryBlue/10 text-primaryBlue rounded-lg">
          <Calculator size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-textDark leading-tight">Estado de cuenta</h2>
          <p className="text-xs text-textMuted font-medium uppercase tracking-wider">Desglose de fichas y saldos acumulados</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 transition-all hover:shadow-sm">
          <p className="text-[10px] uppercase text-textMuted font-black tracking-widest mb-1">Capital Total</p>
          <p className="text-xl font-black text-slate-800">${totales.capital.toLocaleString()}</p>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 transition-all hover:shadow-sm">
          <p className="text-[10px] uppercase text-textMuted font-black tracking-widest mb-1">Interés Total</p>
          <p className="text-xl font-black text-slate-800">${totales.interes.toLocaleString()}</p>
        </div>

        <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 transition-all hover:shadow-sm">
          <p className="text-[10px] uppercase text-amber-600 font-black tracking-widest mb-1">Mora Acumulada</p>
          <p className="text-xl font-black text-amber-700">${totales.mora.toLocaleString()}</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 transition-all hover:shadow-sm border-b-2 border-b-emerald-200">
          <p className="text-[10px] uppercase text-emerald-600 font-black tracking-widest mb-1">Pagos Acumulados</p>
          <p className="text-xl font-black text-emerald-700">${totales.abono.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-1">
            <div className="w-1 h-1 rounded-full bg-emerald-400" />
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">Total Cobrado (Abonos)</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-textMuted mb-6 bg-gray-50 p-3 rounded-xl border border-dashed border-gray-200">
        En cada ficha pendiente puedes usar las acciones permitidas por tu perfil. El cobrador elige la ficha sobre la que opera.
      </p>

      <div className="grid grid-cols-1 gap-6 md:gap-4">
        {fichas.map((ficha) => {
          const fechaVencimiento = formatCalendarDateFromApi(ficha.fecha, { day: '2-digit', month: '2-digit', year: 'numeric' });
          const totalALiquidar = ficha.total;
          const fichaAplicada = ficha.aplicado ?? ficha.pagada;
          const montoFichaPagada = (ficha.capital ?? 0) + (ficha.interes ?? 0) + (ficha.moraAcumulada ?? 0);

          const esFichaSiguiente = fichaSiguienteNum != null && fichaSiguienteNum === ficha.num;
          const estaVencida =
            !fichaAplicada &&
            !!ficha.fecha &&
            calendarDayKeyFromApi(ficha.fecha) !== '' &&
            calendarDayKeyFromApi(ficha.fecha) < localCalendarDayKey();

          const hayAccionesPendiente =
            !fichaAplicada &&
            (Boolean(onPagarFicha) || Boolean(onAbonar) || Boolean(onPenalizar) || (ficha.interes > 0 && Boolean(onCondonarInteres)));

          return (
            <div
              key={ficha.num}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                fichaAplicada
                  ? 'border-green-100 bg-white shadow-sm'
                  : estaVencida
                    ? 'border-amber-200 bg-amber-50/20 shadow-md'
                    : 'border-gray-100 bg-white shadow-sm hover:shadow-md'
              }`}
            >
              <div
                className={`px-5 py-3 flex justify-between items-center ${
                  fichaAplicada ? 'bg-green-50/50' : estaVencida ? 'bg-amber-50' : 'bg-gray-50/50'
                }`}
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-lg font-bold text-textDark">Ficha #{ficha.num}</span>
                  {esFichaSiguiente && !fichaAplicada && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold uppercase tracking-wider">
                      Orden sugerido
                    </span>
                  )}
                  {estaVencida && !fichaAplicada && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold uppercase tracking-wider animate-pulse">
                      Atrasada
                    </span>
                  )}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                    fichaAplicada ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {fichaAplicada ? 'Aplicada' : 'Pendiente'}
                </span>
              </div>

              <div className="p-5 space-y-4">
                {!fichaAplicada ? (
                  <div className="bg-primaryBlue/5 rounded-xl p-4 border border-primaryBlue/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-primaryBlue tracking-widest mb-1">Total a pagar</p>
                      <h3 className="text-3xl font-black text-primaryBlue">
                        ${totalALiquidar.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </h3>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 rounded-xl p-4 border border-green-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-green-700 tracking-widest mb-1">Aplicada</p>
                      <h3 className="text-3xl font-black text-green-700">
                        ${montoFichaPagada.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </h3>
                      <div className="flex items-center gap-2 text-green-600 mt-1">
                        <CheckCircle size={14} />
                        <span className="font-semibold text-xs text-green-700">
                          Pagado el {ficha.fechaPago ? formatCalendarDateFromApi(ficha.fechaPago) : '-'}
                        </span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-green-200">
                      <p className="text-xs text-green-600 font-medium">Capital: ${ficha.capital.toLocaleString()}</p>
                      <p className="text-xs text-green-600 font-medium">Interés: ${ficha.interes.toLocaleString()}</p>
                      <p className="text-xs text-green-600 font-medium">Mora Acum: ${ficha.moraAcumulada.toLocaleString()}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm bg-slate-50/50 p-4 rounded-xl border border-gray-100">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-textMuted font-bold">Vencimiento</p>
                    <p className="font-semibold text-slate-700">{fechaVencimiento}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-textMuted font-bold">Capital</p>
                    <p className="font-medium text-slate-600">${(ficha.capital ?? 0).toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-textMuted font-bold">Interés</p>
                    <p className="font-medium text-slate-600">${(ficha.interes ?? 0).toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-textMuted font-bold">Mora Acumulada</p>
                    <p className="font-bold text-amber-600">${(ficha.moraAcumulada ?? 0).toLocaleString()}</p>
                  </div>
                  <div className="space-y-1 text-right md:text-left">
                    <p className="text-[10px] uppercase text-textMuted font-bold">Abono Acumulado</p>
                    <p className="font-bold text-emerald-700">${(ficha.abonoAcumulado ?? 0).toLocaleString()}</p>
                  </div>
                </div>

                {hayAccionesPendiente && (
                  <div className="flex flex-col gap-2 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Boolean(onPagarFicha) && (
                        <button
                          type="button"
                          className="btn btn-primary py-3 shadow-lg shadow-primaryBlue/20 transform active:scale-95 transition-all text-sm font-bold"
                          onClick={() => onPagarFicha?.(ficha.num, totalALiquidar, ficha.fecha)}
                        >
                          Pagar Ficha
                        </button>
                      )}
                      {Boolean(onAbonar) && (
                        <button
                          type="button"
                          className="btn btn-light py-3 border-primaryBlue text-primaryBlue hover:bg-blue-50 shadow-sm transform active:scale-95 transition-all text-sm font-bold"
                          onClick={() => onAbonar?.(ficha.num, totalALiquidar, ficha.fecha)}
                        >
                          Abonar
                        </button>
                      )}
                    </div>
                    {Boolean(onPenalizar) && (
                      <button
                        type="button"
                        className="btn btn-light py-3 border-amber-300 text-amber-700 hover:bg-amber-50 shadow-sm transform active:scale-95 transition-all text-sm font-bold"
                        onClick={() => onPenalizar?.(ficha.num, totalALiquidar, ficha.fecha)}
                      >
                        Penalizar
                      </button>
                    )}
                    {ficha.interes > 0 && Boolean(onCondonarInteres) && (
                      <button
                        type="button"
                        className="btn btn-light w-full py-2.5 border-amber-200 text-amber-700 hover:bg-amber-50"
                        onClick={() => onCondonarInteres?.(ficha.num)}
                      >
                        Condonar interés (${ficha.interes.toLocaleString()})
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
