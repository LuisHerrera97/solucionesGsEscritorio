type CortesStatsProps = {
  cantidad: number;
  totalTeorico: number;
  totalReal: number;
  totalDiferencia: number;
};

export const CortesStats = ({ cantidad, totalTeorico, totalReal, totalDiferencia }: CortesStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <p className="text-xs uppercase text-textMuted tracking-wide">Cortes en rango</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{cantidad}</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <p className="text-xs uppercase text-textMuted tracking-wide">Total teórico</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">${totalTeorico.toLocaleString()}</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <p className="text-xs uppercase text-textMuted tracking-wide">Total real / Diferencia</p>
        <p className="text-xl font-bold text-gray-900 mt-1">${totalReal.toLocaleString()}</p>
        <p className={`text-sm font-medium mt-0.5 ${totalDiferencia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {totalDiferencia >= 0 ? '+' : ''}
          {totalDiferencia.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

