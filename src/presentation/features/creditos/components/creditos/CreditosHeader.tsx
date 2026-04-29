import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../auth/context/useAuth';
import { useAplicarMoraMutation } from '../../hooks/creditosHooks';
import { AppSearchInput } from '../../../../../infrastructure/ui/components/AppSearchInput';
import { ConfirmDialog } from '../../../../../infrastructure/ui/components/ConfirmDialog';
import { getErrorMessage } from '../../../../../infrastructure/utils/getErrorMessage';

type CreditosHeaderProps = {
  onNuevo: () => void;
  searchTerm: string;
  onSearchTermChange: (val: string) => void;
};

export const CreditosHeader = ({ onNuevo, searchTerm, onSearchTermChange }: CreditosHeaderProps) => {
  const { canBoton } = useAuth();
  const canCrear = canBoton('CREDITO_CREAR');
  const canAplicarMora = canBoton('CREDITO_REESTRUCTURAR'); // Usamos el mismo permiso o uno general
  
  const aplicarMoraMutation = useAplicarMoraMutation();
  const [confirmMoraOpen, setConfirmMoraOpen] = useState(false);

  const handleConfirmAplicarMora = async () => {
    try {
      const updated = await aplicarMoraMutation.mutateAsync();
      toast.success(`Se aplicó mora a ${updated} fichas.`);
      setConfirmMoraOpen(false);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Error al aplicar mora'));
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 className="text-2xl font-bold text-gray-800">Créditos</h1>
      
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <AppSearchInput
          value={searchTerm}
          onChange={onSearchTermChange}
          placeholder="Buscar por nombre o folio..."
          aria-label="Buscar créditos"
          wrapperClassName="relative flex-1 sm:w-72 min-w-0"
        />

        {canAplicarMora && (
          <button 
            type="button"
            onClick={() => setConfirmMoraOpen(true)} 
            className="btn btn-light shrink-0"
            disabled={aplicarMoraMutation.isPending}
          >
            Aplicar Mora
          </button>
        )}

        {canCrear && (
          <button onClick={onNuevo} className="btn btn-primary shrink-0">
            + Nuevo crédito
          </button>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmMoraOpen}
        title="Aplicar mora a fichas pendientes"
        message="¿Estás seguro de que deseas aplicar la mora a todas las fichas pendientes hoy?"
        type="warning"
        confirmLabel="Sí, aplicar mora"
        cancelLabel="Cancelar"
        loading={aplicarMoraMutation.isPending}
        onConfirm={handleConfirmAplicarMora}
        onCancel={() => setConfirmMoraOpen(false)}
      />
    </div>
  );
};
