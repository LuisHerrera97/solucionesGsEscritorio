import { useMemo, useState } from 'react';
import type { Guid } from '../../../../domain/seguridad/types';
import StatusPanel from '../../../../infrastructure/ui/components/StatusPanel';
import { PermisosEditor } from '../components/permisos/PermisosEditor';
import { PermisosHeader } from '../components/permisos/PermisosHeader';
import { useMenuPerfilQuery, usePerfilesQuery } from '../hooks/seguridadHooks';

const Permisos = () => {
  const perfilesQuery = usePerfilesQuery();

  const perfiles = useMemo(() => perfilesQuery.data ?? [], [perfilesQuery.data]);
  const [perfilId, setPerfilId] = useState<Guid | ''>('');
  const selectedPerfilId = (perfilId || perfiles[0]?.id || '') as Guid | '';

  const menuQuery = useMenuPerfilQuery(selectedPerfilId);

  return (
    <div className="space-y-6">
      <PermisosHeader
        perfiles={perfiles}
        selectedPerfilId={selectedPerfilId}
        loadingPerfiles={perfilesQuery.isLoading}
        onChangePerfilId={(value) => setPerfilId(value)}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        {menuQuery.isLoading && <StatusPanel variant="loading" title="Cargando permisos" message="Consultando el servidor..." />}
        {menuQuery.isError && <StatusPanel variant="error" title="No fue posible cargar permisos" message="Intenta nuevamente." />}
        {!menuQuery.isLoading && !menuQuery.isError && menuQuery.data && selectedPerfilId && (
          <PermisosEditor key={selectedPerfilId} perfilId={selectedPerfilId} menu={menuQuery.data} />
        )}
        {!menuQuery.isLoading && !menuQuery.isError && (!menuQuery.data || menuQuery.data.length === 0) && selectedPerfilId && (
          <StatusPanel variant="empty" title="Sin módulos" message="No hay módulos registrados para este perfil." />
        )}
      </div>
    </div>
  );
};

export default Permisos;
