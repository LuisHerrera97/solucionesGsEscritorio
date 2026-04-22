import { ArrowRightLeft, Banknote, CreditCard } from 'lucide-react';

type CajaStatsProps = {
  fichasPagadas: number;
  totalEfectivo: number;
  totalTransferencia: number;
  esperadoEfectivo: number;
};

export const CajaStats = ({ fichasPagadas, totalEfectivo, totalTransferencia, esperadoEfectivo }: CajaStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="p-3 rounded-lg bg-green-100 text-green-700">
          <CreditCard size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Fichas pagadas</p>
          <p className="text-xl font-bold text-gray-900">{fichasPagadas}</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="p-3 rounded-lg bg-emerald-100 text-emerald-700">
          <Banknote size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Efectivo</p>
          <p className="text-xl font-bold text-gray-900">${totalEfectivo.toLocaleString()}</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="p-3 rounded-lg bg-blue-100 text-blue-700">
          <ArrowRightLeft size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Transferencia</p>
          <p className="text-xl font-bold text-gray-900">${totalTransferencia.toLocaleString()}</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="p-3 rounded-lg bg-amber-100 text-amber-700">
          <Banknote size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Esperado en efectivo</p>
          <p className="text-xl font-bold text-gray-900">${esperadoEfectivo.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

