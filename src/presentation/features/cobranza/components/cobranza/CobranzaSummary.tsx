type CobranzaSummaryProps = {
  movimientos: number;
  totalCobrado: number;
};

export const CobranzaSummary = ({ movimientos, totalCobrado }: CobranzaSummaryProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 border-t border-gray-100 pt-2 md:grid-cols-2">
      <div>
        <p className="text-xs uppercase tracking-wide text-textMuted">Movimientos</p>
        <p className="text-lg font-semibold text-textDark">{movimientos.toLocaleString()}</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-textMuted">Total cobrado</p>
        <p className="text-lg font-semibold text-textDark">${totalCobrado.toLocaleString()}</p>
      </div>
    </div>
  );
};
