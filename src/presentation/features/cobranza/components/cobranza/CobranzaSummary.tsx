type CobranzaSummaryProps = {
  movimientos: number;
  totalAbono: number;
  totalMora: number;
  totalCobrado: number;
};

export const CobranzaSummary = ({ movimientos, totalAbono, totalMora, totalCobrado }: CobranzaSummaryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 border-t border-gray-100">
      <div>
        <p className="text-xs text-textMuted uppercase tracking-wide">Movimientos</p>
        <p className="text-lg font-semibold text-textDark">{movimientos.toLocaleString()}</p>
      </div>
      <div>
        <p className="text-xs text-textMuted uppercase tracking-wide">Total abonos</p>
        <p className="text-lg font-semibold text-textDark">${totalAbono.toLocaleString()}</p>
      </div>
      <div>
        <p className="text-xs text-textMuted uppercase tracking-wide">Total penalización</p>
        <p className="text-lg font-semibold text-textDark">${totalMora.toLocaleString()}</p>
      </div>
      <div>
        <p className="text-xs text-textMuted uppercase tracking-wide">Total cobrado</p>
        <p className="text-lg font-semibold text-textDark">${totalCobrado.toLocaleString()}</p>
      </div>
    </div>
  );
};

