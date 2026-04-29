import { AppSearchInput } from '../../../../../infrastructure/ui/components/AppSearchInput';

type ClientesSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export const ClientesSearchBar = ({ value, onChange }: ClientesSearchBarProps) => {
  return (
    <div className="max-w-2xl">
      <AppSearchInput
        value={value}
        onChange={onChange}
        placeholder="Buscar por nombre, negocio, zona o dirección..."
        aria-label="Buscar clientes en la lista"
        wrapperClassName="relative w-full"
      />
    </div>
  );
};
