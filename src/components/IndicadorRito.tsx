import { Rito } from '../types/discipline';

interface IndicadorRitoProps {
  rito: Rito;
  aoRegistrarQueda: (ritoId: string) => void;
}

export function IndicadorRito({ rito, aoRegistrarQueda }: IndicadorRitoProps) {
  return (
    <article className="rounded-2xl border border-bronze/20 bg-slate/40 p-5 shadow-temple backdrop-blur-sm">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-lg tracking-wide text-stone-100">{rito.nome}</h3>
          <p className="text-xs uppercase tracking-[0.18em] text-bronze">
            {rito.estado === 'vigente' ? 'Rito em vigília' : 'Rito em queda'}
          </p>
        </div>
        <button
          onClick={() => aoRegistrarQueda(rito.id)}
          className="rounded-md border border-amber-200/20 px-3 py-1 text-xs uppercase tracking-[0.15em] text-stone-300 transition hover:border-gold/50 hover:text-gold"
        >
          Registrar Queda
        </button>
      </header>

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-black/20 p-3">
          <dt className="text-[11px] uppercase tracking-[0.16em] text-stone-400">Dias Invictos</dt>
          <dd className="mt-1 font-serif text-xl text-gold">{rito.diasInvictos}</dd>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <dt className="text-[11px] uppercase tracking-[0.16em] text-stone-400">Ouro Preservado</dt>
          <dd className="mt-1 font-serif text-xl text-gold">{rito.ouroPreservado} min</dd>
        </div>
      </dl>
    </article>
  );
}
