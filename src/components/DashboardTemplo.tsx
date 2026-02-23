import { RitualDeRetorno } from './RitualDeRetorno';
import { useTemploStore } from '../store/useTemploStore';
import {
  calcularDiasInvictos,
  calcularDistribuicaoDoOuro,
  calcularOuroPreservado
} from '../utils/ritoMetrics';

const moedaBRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

const formataData = (dataISO: string) => {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(`${dataISO}T12:00:00`));
};

export function DashboardTemplo() {
  const ritos = useTemploStore((estado) => estado.ritos);
  const registrarQueda = useTemploStore((estado) => estado.registrarQueda);

  const rito = ritos[0];
  if (!rito) return null;

  const diasInvictos = calcularDiasInvictos(rito);
  const ouroPreservado = calcularOuroPreservado(rito);
  const distribuicao = calcularDistribuicaoDoOuro(rito);
  const percentualPreservado =
    distribuicao.total > 0 ? (distribuicao.preservado / distribuicao.total) * 100 : 0;

  const tipoMeta =
    rito.tipoDeMeta === 'quaresma_40'
      ? '40 dias (Quaresma do Guerreiro)'
      : rito.tipoDeMeta === 'permanente'
      ? 'Permanente (Tempus Invictus)'
      : 'Meta personalizada';

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 marble-overlay">
      <header className="mb-8 border-b border-bronze/20 pb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-bronze">Tempus Invictus</p>
        <h1 className="mt-2 font-serif text-4xl text-stone-100">O Templo</h1>
        <p className="mt-2 max-w-2xl text-sm text-stone-300">
          Um espaco de autogoverno: observe sua batalha, mantenha o rito vivo e transforme cada
          queda em precisao interior.
        </p>
      </header>

      <section className="mb-7 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-bronze/20 bg-slate/30 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-stone-400">Batalha atual</p>
          <p className="mt-2 font-serif text-3xl text-gold">{rito.tituloDaBatalha}</p>
        </div>
        <div className="rounded-2xl border border-bronze/20 bg-slate/30 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-stone-400">Dias Invictos</p>
          <p className="mt-2 font-serif text-3xl text-gold">{diasInvictos}</p>
        </div>
        <div className="rounded-2xl border border-bronze/20 bg-slate/30 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-stone-400">Ouro Preservado</p>
          <p className="mt-2 font-serif text-3xl text-gold">{moedaBRL.format(ouroPreservado)}</p>
        </div>
      </section>

      <section className="mb-8 grid gap-5 md:grid-cols-2">
        <article className="rounded-2xl border border-bronze/20 bg-slate/40 p-5 shadow-temple backdrop-blur-sm">
          <header className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="font-serif text-lg tracking-wide text-stone-100">{rito.nome}</h2>
              <p className="text-xs uppercase tracking-[0.18em] text-bronze">
                {rito.estado === 'vigente' ? 'Rito em vigilia' : 'Rito em queda'}
              </p>
            </div>
            <button
              onClick={() => registrarQueda(rito.id)}
              className="rounded-md border border-amber-200/20 px-3 py-1 text-xs uppercase tracking-[0.15em] text-stone-300 transition hover:border-gold/50 hover:text-gold"
            >
              Registrar Queda
            </button>
          </header>

          <dl className="grid gap-3 text-sm">
            <div className="rounded-lg bg-black/20 p-3">
              <dt className="text-[11px] uppercase tracking-[0.16em] text-stone-400">
                Inicio da sobriedade
              </dt>
              <dd className="mt-1 text-base text-stone-100">{formataData(rito.dataInicioISO)}</dd>
            </div>
            <div className="rounded-lg bg-black/20 p-3">
              <dt className="text-[11px] uppercase tracking-[0.16em] text-stone-400">Meta</dt>
              <dd className="mt-1 text-base text-stone-100">{tipoMeta}</dd>
            </div>
            <div className="rounded-lg bg-black/20 p-3">
              <dt className="text-[11px] uppercase tracking-[0.16em] text-stone-400">Data final</dt>
              <dd className="mt-1 text-base text-stone-100">
                {rito.dataFimISO ? formataData(rito.dataFimISO) : 'Sem data final'}
              </dd>
            </div>
          </dl>
        </article>

        <article className="rounded-2xl border border-bronze/20 bg-slate/40 p-5 shadow-temple backdrop-blur-sm">
          <h2 className="font-serif text-lg tracking-wide text-stone-100">Ouro Preservado</h2>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-bronze">Grafico de pizza</p>

          <div className="mt-4 flex items-center gap-5">
            <div
              className="h-36 w-36 rounded-full border border-gold/30"
              style={{
                background: `conic-gradient(#cfb57f ${percentualPreservado}%, #27303a ${percentualPreservado}% 100%)`
              }}
              aria-label="Distribuicao do ouro preservado"
            />
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-[0.12em] text-stone-400">Ouro preservado</dt>
                <dd className="text-base text-gold">{moedaBRL.format(distribuicao.preservado)}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.12em] text-stone-400">
                  {distribuicao.rotuloRisco}
                </dt>
                <dd className="text-base text-stone-200">{moedaBRL.format(distribuicao.emRisco)}</dd>
              </div>
            </dl>
          </div>
        </article>
      </section>

      <section className="mt-8">
        <RitualDeRetorno />
      </section>
    </main>
  );
}
