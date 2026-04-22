type Tab = 'modulos' | 'paginas' | 'botones';

export const ElementosSistemaTabs = ({ tab, onChange }: { tab: Tab; onChange: (tab: Tab) => void }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" className={`btn ${tab === 'modulos' ? 'btn-primary' : 'btn-light'}`} onClick={() => onChange('modulos')}>
        Módulos
      </button>
      <button type="button" className={`btn ${tab === 'paginas' ? 'btn-primary' : 'btn-light'}`} onClick={() => onChange('paginas')}>
        Páginas
      </button>
      <button type="button" className={`btn ${tab === 'botones' ? 'btn-primary' : 'btn-light'}`} onClick={() => onChange('botones')}>
        Botones
      </button>
    </div>
  );
};

