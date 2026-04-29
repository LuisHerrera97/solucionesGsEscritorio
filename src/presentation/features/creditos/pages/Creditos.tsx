import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusPanel from '../../../../infrastructure/ui/components/StatusPanel';
import { useCreditosQuery } from '../hooks/creditosHooks';
import { CreditoCard } from '../components/creditos/CreditoCard';
import { CreditosHeader } from '../components/creditos/CreditosHeader';
import { useCobranzaZonaFiltro } from '../../cobranza/hooks/useCobranzaZonaFiltro';
import { CobranzaZonaFiltroPanel } from '../../cobranza/components/cobranza/CobranzaZonaFiltroPanel';
import { useAuth } from '../../auth/context/useAuth';

const PERM_CREDITOS_TODAS_ZONAS = 'CREDITO_LISTA_TODAS_ZONAS';

const Creditos = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [page, setPage] = useState(1);
  const pageSize = 50;
  const [searchTerm, setSearchTerm] = useState('');

  const {
    puedeElegirZona,
    zonaFiltro,
    setZonaFiltro,
    zonaIdParam,
    zonas,
    zonasLoading,
    esZonaDelUsuario,
  } = useCobranzaZonaFiltro(PERM_CREDITOS_TODAS_ZONAS);

  const creditosQuery = useCreditosQuery({ searchTerm, page, pageSize, zonaId: zonaIdParam });

  const creditos = creditosQuery.data ?? [];
  const canGoNext = useMemo(() => creditos.length === pageSize, [creditos.length]);

  return (
    <div className="space-y-6">
      <CreditosHeader 
        onNuevo={() => navigate('/creditos/nuevo')} 
        searchTerm={searchTerm} 
        onSearchTermChange={(val) => {
          setSearchTerm(val);
          setPage(1); // reset to page 1 on search
        }} 
      />

      <CobranzaZonaFiltroPanel
        user={user}
        puedeElegirZona={puedeElegirZona}
        zonas={zonas}
        zonasLoading={zonasLoading}
        zonaFiltro={zonaFiltro}
        onChangeZona={(val) => {
          setZonaFiltro(val);
          setPage(1);
        }}
        esZonaDelUsuario={esZonaDelUsuario}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="text-sm text-textMuted">
          Página <span className="font-semibold text-textDark">{page}</span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="btn btn-light" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            Anterior
          </button>
          <button type="button" className="btn btn-light" onClick={() => setPage((p) => p + 1)} disabled={!canGoNext}>
            Siguiente
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {creditosQuery.isLoading && <StatusPanel variant="loading" title="Cargando créditos" message="Consultando el servidor..." />}
        {creditosQuery.isError && <StatusPanel variant="error" title="No fue posible cargar créditos" message="Intenta nuevamente." />}
        {creditos.map((credito) => (
          <CreditoCard key={credito.id} credito={credito} onVerDetalles={() => navigate(`/creditos/${credito.id}`)} />
        ))}
        {!creditosQuery.isLoading && !creditosQuery.isError && creditos.length === 0 && (
          <StatusPanel variant="empty" title="Sin créditos" message="Crea un crédito para empezar." />
        )}
      </div>
    </div>
  );
};

export default Creditos;
