type CobranzaFiltersProps = {
  fechaInicio: string;
  fechaFin: string;
  busqueda: string;
  onChangeFechaInicio: (value: string) => void;
  onChangeFechaFin: (value: string) => void;
  onChangeBusqueda: (value: string) => void;
};

export const CobranzaFilters = ({
  fechaInicio,
  fechaFin,
  busqueda,
  onChangeFechaInicio,
  onChangeFechaFin,
  onChangeBusqueda,
}: CobranzaFiltersProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div>
        <label className="form-label text-xs uppercase">Desde</label>
        <input type="date" className="form-input" value={fechaInicio} onChange={(e) => onChangeFechaInicio(e.target.value)} />
      </div>
      <div>
        <label className="form-label text-xs uppercase">Hasta</label>
        <input type="date" className="form-input" value={fechaFin} onChange={(e) => onChangeFechaFin(e.target.value)} />
      </div>
      <div className="ml-auto">
        <label className="form-label text-xs uppercase">Buscar</label>
        <input
          type="text"
          className="form-input max-w-xs"
          placeholder="Cliente, negocio o crédito"
          value={busqueda}
          onChange={(e) => onChangeBusqueda(e.target.value)}
        />
      </div>
    </div>
  );
};

