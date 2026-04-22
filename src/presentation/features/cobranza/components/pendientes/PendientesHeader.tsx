type PendientesHeaderProps = {
  busqueda: string;
  onChangeBusqueda: (value: string) => void;
};

export const PendientesHeader = ({ busqueda, onChangeBusqueda }: PendientesHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Pendientes de cobro</h1>
        <p className="text-sm text-textMuted">
          Fichas de hoy y vencidas. Busca por nombre, apellido, negocio o folio de crédito. El pago se registra desde el detalle del crédito.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          className="form-input max-w-xs"
          placeholder="Nombre, apellido, negocio o folio"
          value={busqueda}
          onChange={(e) => onChangeBusqueda(e.target.value)}
        />
      </div>
    </div>
  );
};
