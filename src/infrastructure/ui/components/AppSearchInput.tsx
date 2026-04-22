import { Search } from 'lucide-react';

const inputClassName =
  'w-full pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 bg-white border border-slate-200 rounded-xl shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow focus:outline-none focus:ring-2 focus:ring-primaryBlue/25 focus:border-primaryBlue';

export type AppSearchInputProps = {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  'aria-label'?: string;
  wrapperClassName?: string;
  onEnter?: () => void;
  disabled?: boolean;
};

export const AppSearchInput = ({
  value,
  onChange,
  placeholder,
  'aria-label': ariaLabel,
  wrapperClassName,
  onEnter,
  disabled,
}: AppSearchInputProps) => {
  return (
    <div className={wrapperClassName ?? 'relative w-full'}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-slate-400" strokeWidth={2} />
      <input
        type="search"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onEnter) {
            e.preventDefault();
            onEnter();
          }
        }}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={`${inputClassName} ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
      />
    </div>
  );
};
