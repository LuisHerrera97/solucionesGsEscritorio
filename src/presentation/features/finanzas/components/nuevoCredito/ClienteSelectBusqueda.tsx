import { useQuery } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { Cliente } from '../../../../../domain/finanzas/types';
import { useDebouncedValue } from '../../../../../infrastructure/hooks/useDebouncedValue';
import { useAppContainer } from '../../../../../infrastructure/di/useAppContainer';

const PAGE_SIZE = 30;
const DEBOUNCE_MS = 300;

const etiquetaCliente = (c: Cliente) => `${c.nombre} ${c.apellido} - ${c.negocio}`.trim();

type ClienteSelectBusquedaProps = {
  value: string;
  onChange: (clienteId: string) => void;
  /** Etiqueta mostrada al elegir cliente (`nombre apellido - negocio`). Vacío si no hay selección. */
  onClienteEtiqueta?: (etiqueta: string) => void;
  disabled?: boolean;
  /** Texto de ayuda bajo el campo */
  hint?: string;
};

export const ClienteSelectBusqueda = ({ value, onChange, onClienteEtiqueta, disabled, hint }: ClienteSelectBusquedaProps) => {
  const { services } = useAppContainer();
  const inputId = useId();
  const listId = `${inputId}-lista`;
  const containerRef = useRef<HTMLDivElement>(null);
  const blurTimerRef = useRef<number | undefined>(undefined);

  const [abierto, setAbierto] = useState(false);
  const [termino, setTermino] = useState('');
  const [etiquetaCerrado, setEtiquetaCerrado] = useState('');
  const debounced = useDebouncedValue(termino, DEBOUNCE_MS);
  const buscarApi = debounced.trim() === '' ? undefined : debounced.trim();

  const { data: opciones = [], isFetching } = useQuery({
    queryKey: ['finanzas', 'clientes', 'selector', buscarApi ?? ''],
    queryFn: () => services.finanzas.clientes.getAll({ page: 1, pageSize: PAGE_SIZE, buscar: buscarApi }).then((r) => r.items),
    staleTime: 30_000,
  });

  // Sincronizar borrado remoto del id (p. ej. reset del formulario padre).
  useEffect(() => {
    if (!value) {
      /* eslint-disable react-hooks/set-state-in-effect -- reset explícito cuando el padre limpia `value` */
      setEtiquetaCerrado('');
      setTermino('');
      onClienteEtiqueta?.('');
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [value, onClienteEtiqueta]);

  const cerrarLista = useCallback(() => {
    setAbierto(false);
    if (value && etiquetaCerrado) {
      setTermino(etiquetaCerrado);
    } else if (!value) {
      setTermino('');
    }
  }, [value, etiquetaCerrado]);

  useEffect(() => {
    if (!abierto) return;
    const onDocMouseDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        cerrarLista();
      }
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [abierto, cerrarLista]);

  const onElegir = (c: Cliente) => {
    const label = etiquetaCliente(c);
    setEtiquetaCerrado(label);
    onChange(c.id);
    onClienteEtiqueta?.(label);
    setTermino(label);
    setAbierto(false);
    if (blurTimerRef.current) window.clearTimeout(blurTimerRef.current);
  };

  const onInputChange = (v: string) => {
    setTermino(v);
    if (value && v !== etiquetaCerrado) {
      onChange('');
      onClienteEtiqueta?.('');
    }
    if (!abierto) setAbierto(true);
  };

  const textoEntrada = abierto ? termino : value ? etiquetaCerrado : termino;

  return (
    <div ref={containerRef} className="space-y-1">
      <label className="form-label" htmlFor={inputId}>
        Cliente
      </label>
      <div className="relative">
        <input
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={abierto}
          aria-controls={abierto ? listId : undefined}
          aria-autocomplete="list"
          autoComplete="off"
          disabled={disabled}
          placeholder="Escribe para buscar cliente…"
          className="form-input w-full pr-9"
          value={textoEntrada}
          onChange={(e) => onInputChange(e.target.value)}
          onFocus={() => {
            if (blurTimerRef.current) window.clearTimeout(blurTimerRef.current);
            setAbierto(true);
            if (value && etiquetaCerrado) {
              setTermino(etiquetaCerrado);
            }
          }}
          onBlur={() => {
            blurTimerRef.current = window.setTimeout(() => cerrarLista(), 180);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              cerrarLista();
            }
          }}
        />
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-40"
          aria-label={abierto ? 'Cerrar lista' : 'Abrir lista'}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            if (abierto) {
              cerrarLista();
            } else {
              setAbierto(true);
              if (value && etiquetaCerrado) {
                setTermino(etiquetaCerrado);
              }
            }
          }}
        >
          <ChevronDown size={18} className={abierto ? 'rotate-180 transition-transform' : 'transition-transform'} />
        </button>

        {abierto && (
          <ul
            id={listId}
            role="listbox"
            className="absolute left-0 right-0 top-full z-30 mt-1 max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
          >
            {isFetching && (
              <li className="px-3 py-2 text-sm text-textMuted" role="presentation">
                Buscando…
              </li>
            )}
            {!isFetching && opciones.length === 0 && (
              <li className="px-3 py-2 text-sm text-textMuted" role="presentation">
                Sin coincidencias
              </li>
            )}
            {!isFetching &&
              opciones.map((c) => (
                <li key={c.id} role="option" aria-selected={c.id === value}>
                  <button
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm text-textDark hover:bg-gray-50"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => onElegir(c)}
                  >
                    {etiquetaCliente(c)}
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>
      {hint ? <p className="text-xs text-textMuted">{hint}</p> : null}
    </div>
  );
};
