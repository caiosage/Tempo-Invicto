import { useEffect, useMemo, useState } from 'react';
import { useTemploStore } from '../store/useTemploStore';
import {
  calcularDiasInvictos,
  calcularDinheiroEquivalenteDoTempo,
  calcularDistribuicaoDinheiroEquivalenteDoTempo,
  calcularDistribuicaoDoTempo,
  calcularDistribuicaoDoOuro,
  calcularTempoDeVidaGanho,
  calcularOuroPreservado
} from '../utils/ritoMetrics';

interface DashboardTemploProps {
  aoRegistrarNovaBatalha: () => void;
}

const moedaBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const formataData = (dataISO: string) =>
  new Intl.DateTimeFormat('pt-BR').format(new Date(`${dataISO}T12:00:00`));

export function DashboardTemplo({ aoRegistrarNovaBatalha }: DashboardTemploProps) {
  const ritos = useTemploStore((estado) => estado.ritos);
  const registrarQueda = useTemploStore((estado) => estado.registrarQueda);

  const [ritosSelecionados, definirRitosSelecionados] = useState<string[]>([]);

  useEffect(() => {
    if (ritos.length === 0) {
      definirRitosSelecionados([]);
      return;
    }

    definirRitosSelecionados((anteriores) => {
      const idsValidos = new Set(ritos.map((rito) => rito.id));
      const filtrados = anteriores.filter((id) => idsValidos.has(id));
      return filtrados.length > 0 ? filtrados : ritos.map((rito) => rito.id);
    });
  }, [ritos]);

  const assinaturaQuedas = ritos.map((rito) => `${rito.id}:${rito.ultimaQuedaEmISO ?? ''}`).join('|');
  useEffect(() => {
    if (ritos.length === 0) return;
    definirRitosSelecionados(ritos.map((rito) => rito.id));
  }, [assinaturaQuedas, ritos]);

  const ritosDosGraficos = useMemo(
    () => ritos.filter((rito) => ritosSelecionados.includes(rito.id)),
    [ritos, ritosSelecionados]
  );

  const totalDiasInvictos = ritosDosGraficos.reduce((acc, rito) => acc + calcularDiasInvictos(rito), 0);
  const ritosComOuroSelecionados = ritosDosGraficos.filter((rito) => rito.aplicaOuro);
  const mostrarOuro = ritosComOuroSelecionados.length > 0;
  const totalOuroPreservado = ritosComOuroSelecionados.reduce((acc, rito) => acc + calcularOuroPreservado(rito), 0);
  const totalTempoGanho = ritosDosGraficos.reduce((acc, rito) => acc + calcularTempoDeVidaGanho(rito), 0);

  const ouroPreservadoNosGraficos = ritosComOuroSelecionados.reduce(
    (acc, rito) => acc + calcularDistribuicaoDoOuro(rito).preservado,
    0
  );
  const ouroProximos30 = ritosComOuroSelecionados.reduce(
    (acc, rito) => acc + calcularDistribuicaoDoOuro(rito).emRisco,
    0
  );
  const tempoPreservadoNosGraficos = ritosDosGraficos.reduce(
    (acc, rito) => acc + calcularDistribuicaoDoTempo(rito).preservado,
    0
  );
  const tempoProximos30 = ritosDosGraficos.reduce(
    (acc, rito) => acc + calcularDistribuicaoDoTempo(rito).emRisco,
    0
  );

  const totalOuroPizza = ouroPreservadoNosGraficos + ouroProximos30;
  const totalTempoPizza = tempoPreservadoNosGraficos + tempoProximos30;

  const percentualOuro = totalOuroPizza > 0 ? (ouroPreservadoNosGraficos / totalOuroPizza) * 100 : 0;
  const percentualTempo = totalTempoPizza > 0 ? (tempoPreservadoNosGraficos / totalTempoPizza) * 100 : 0;
  const diasEquivalentesDoTempo = tempoPreservadoNosGraficos / 24;

  const ritosComProventosSelecionados = ritosDosGraficos.filter((rito) => rito.proventosMensais > 0);
  const mostrarBonus = ritosComProventosSelecionados.length > 0;

  const dinheiroEquivalentePreservado = ritosComProventosSelecionados.reduce(
    (acc, rito) => acc + calcularDinheiroEquivalenteDoTempo(rito),
    0
  );
  const dinheiroEquivalenteProximos30 = ritosComProventosSelecionados.reduce(
    (acc, rito) => acc + calcularDistribuicaoDinheiroEquivalenteDoTempo(rito).emRisco,
    0
  );
  const totalDinheiroEquivalente = dinheiroEquivalentePreservado + dinheiroEquivalenteProximos30;
  const percentualDinheiroEquivalente =
    totalDinheiroEquivalente > 0 ? (dinheiroEquivalentePreservado / totalDinheiroEquivalente) * 100 : 0;

  const progressoChumboAoOuro = Math.max(0, Math.min(100, (totalDiasInvictos / 40) * 100));
  const barrasMinerio = Array.from(
    { length: 10 },
    (_, indice) => indice < Math.round(progressoChumboAoOuro / 10)
  );

  const alternarRitoNoGrafico = (ritoId: string) => {
    definirRitosSelecionados((anteriores) =>
      anteriores.includes(ritoId) ? anteriores.filter((id) => id !== ritoId) : [...anteriores, ritoId]
    );
  };

  const descricaoGraficos =
    ritosDosGraficos.length > 0
      ? ritosDosGraficos.map((rito) => rito.tituloDaBatalha).join(', ')
      : 'Nenhuma batalha selecionada';

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 marble-overlay">
      <header className="mb-8 border-b border-bronze/20 pb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-bronze">Tempus Invictus</p>
            <h1 className="mt-2 font-serif text-4xl text-stone-100">O Templo</h1>
            <p className="mt-2 max-w-2xl text-sm text-stone-300">
              Observe as batalhas, selecione quais entram nos gráficos e avance do chumbo ao ouro.
            </p>
          </div>
          <button
            onClick={aoRegistrarNovaBatalha}
            className="rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-gold transition hover:bg-gold/20"
          >
            Forjar Nova Batalha
          </button>
        </div>
      </header>

      <section className={`mb-7 grid gap-4 ${mostrarOuro ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
        <div className="rounded-2xl border border-bronze/20 bg-slate/30 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-stone-400">Dias invictos (selecionados)</p>
          <p className="mt-2 font-serif text-3xl text-gold">{totalDiasInvictos}</p>
        </div>
        {mostrarOuro ? (
          <div className="rounded-2xl border border-bronze/20 bg-slate/30 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-stone-400">Ouro preservado (selecionados)</p>
            <p className="mt-2 font-serif text-3xl text-gold">{moedaBRL.format(totalOuroPreservado)}</p>
          </div>
        ) : null}
        <div className="rounded-2xl border border-bronze/20 bg-slate/30 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-stone-400">Tempo ganho (selecionados)</p>
          <p className="mt-2 font-serif text-3xl text-gold">{totalTempoGanho.toFixed(1)} h</p>
        </div>
      </section>

      <section className="mb-8 rounded-2xl border border-bronze/20 bg-slate/30 p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-stone-400">Medidor de transmutação</p>
        <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-stone-400">
          <span>Chumbo</span>
          <span>Ouro</span>
        </div>
        <div className="mt-2 h-3 rounded-full bg-black/30">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-zinc-500 via-bronze to-gold"
            style={{ width: `${progressoChumboAoOuro}%` }}
          />
        </div>
        <div className="mt-3 grid grid-cols-10 gap-2">
          {barrasMinerio.map((ativa, indice) => (
            <span
              key={indice}
              className={`h-4 rounded-sm border ${ativa ? 'border-gold bg-gold/40' : 'border-bronze/30 bg-black/20'}`}
              aria-hidden="true"
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-stone-400">
          {progressoChumboAoOuro.toFixed(0)}% na trilha de transmutação, considerando os ritos selecionados.
        </p>
      </section>

      <section className="mb-8 rounded-2xl border border-bronze/20 bg-slate/30 p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-stone-400">Ritos considerados nos gráficos</p>
        <p className="mt-2 text-sm text-stone-300">{descricaoGraficos}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {ritos.map((rito) => (
            <label
              key={rito.id}
              className="flex items-center gap-3 rounded-lg border border-bronze/20 bg-black/20 px-3 py-2 text-sm text-stone-200"
            >
              <input
                type="checkbox"
                checked={ritosSelecionados.includes(rito.id)}
                onChange={() => alternarRitoNoGrafico(rito.id)}
              />
              <span>{rito.tituloDaBatalha}</span>
            </label>
          ))}
        </div>
      </section>

      <section className={`mb-8 grid gap-5 ${mostrarOuro ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
        {mostrarOuro ? (
          <article className="rounded-2xl border border-bronze/20 bg-slate/40 p-5 shadow-temple backdrop-blur-sm">
            <h2 className="font-serif text-lg tracking-wide text-stone-100">Ouro preservado</h2>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-bronze">
              "Na casa do sábio há comida e azeite armazenados, mas o tolo devora tudo o que pode" -
              Provérbios 21:20
            </p>
            <div className="mt-4 flex items-center gap-5">
              <div
                className="h-36 w-36 rounded-full border border-gold/30"
                style={{
                  background: `conic-gradient(#cfb57f ${percentualOuro}%, #27303a ${percentualOuro}% 100%)`
                }}
              />
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-[0.12em] text-stone-400">Até agora</dt>
                  <dd className="text-base text-gold">{moedaBRL.format(ouroPreservadoNosGraficos)}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.12em] text-stone-400">Próximos 30 dias</dt>
                  <dd className="text-base text-stone-200">{moedaBRL.format(ouroProximos30)}</dd>
                </div>
              </dl>
            </div>
          </article>
        ) : null}

        <article className="rounded-2xl border border-bronze/20 bg-slate/40 p-5 shadow-temple backdrop-blur-sm">
          <h2 className="font-serif text-lg tracking-wide text-stone-100">Tempo de vida ganho</h2>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-bronze">
            "Seus vícios engolirão qualquer quantidade de tempo" - Seneca
          </p>
          <p className="mt-2 text-xs text-stone-400">
            Horas poupadas que podem ser lidas como horas de trabalho equivalentes ao ouro preservado, com
            base nos proventos mensais da sessão bônus.
          </p>
          <div className="mt-4 flex items-center gap-5">
            <div
              className="h-36 w-36 rounded-full border border-gold/30"
              style={{
                background: `conic-gradient(#cfb57f ${percentualTempo}%, #27303a ${percentualTempo}% 100%)`
              }}
            />
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-[0.12em] text-stone-400">Até agora</dt>
                <dd
                  className="cursor-help text-base text-gold"
                  title={`${diasEquivalentesDoTempo.toFixed(2)} dias equivalentes (horas ÷ 24).`}
                >
                  {tempoPreservadoNosGraficos.toFixed(1)} h
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.12em] text-stone-400">Próximos 30 dias</dt>
                <dd className="text-base text-stone-200">{tempoProximos30.toFixed(1)} h</dd>
              </div>
            </dl>
          </div>
        </article>
      </section>

      {mostrarBonus ? (
        <section className="mb-8">
          <article className="rounded-2xl border border-bronze/20 bg-slate/40 p-5 shadow-temple backdrop-blur-sm">
            <h2 className="font-serif text-lg tracking-wide text-stone-100">Bônus: Tempo é Dinheiro</h2>
            <div className="mt-1 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-bronze">
              <p>Dinheiro equivalente ao tempo poupado</p>
              <span
                className="inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full border border-bronze/40 text-[10px]"
                title="Cálculo com base em proventos mensais, considerando 8h por dia e 5 dias por semana (lógica de folha CLT comum)."
              >
                ?
              </span>
            </div>

            <div className="mt-4 flex items-center gap-5">
              <div
                className="h-36 w-36 rounded-full border border-gold/30"
                style={{
                  background: `conic-gradient(#cfb57f ${percentualDinheiroEquivalente}%, #27303a ${percentualDinheiroEquivalente}% 100%)`
                }}
              />
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-[0.12em] text-stone-400">Até agora</dt>
                  <dd className="text-base text-gold">{moedaBRL.format(dinheiroEquivalentePreservado)}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.12em] text-stone-400">Próximos 30 dias</dt>
                  <dd className="text-base text-stone-200">{moedaBRL.format(dinheiroEquivalenteProximos30)}</dd>
                </div>
              </dl>
            </div>
          </article>
        </section>
      ) : null}

      <section className="grid gap-5 md:grid-cols-2">
        {ritos.map((rito) => (
          <article
            key={rito.id}
            className="rounded-2xl border border-bronze/20 bg-slate/40 p-5 shadow-temple backdrop-blur-sm"
          >
            <header className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-serif text-lg tracking-wide text-stone-100">{rito.tituloDaBatalha}</h3>
                <p className="text-xs uppercase tracking-[0.18em] text-bronze">
                  {calcularDiasInvictos(rito) === 0
                    ? 'Rito em reinício'
                    : rito.estado === 'vigente'
                    ? 'Rito em vigília'
                    : 'Rito em queda'}
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
                <dt className="text-[11px] uppercase tracking-[0.16em] text-stone-400">Início da sobriedade</dt>
                <dd className="mt-1 text-base text-stone-100">{formataData(rito.dataInicioISO)}</dd>
              </div>
              <div className="rounded-lg bg-black/20 p-3">
                <dt className="text-[11px] uppercase tracking-[0.16em] text-stone-400">Dias invictos</dt>
                <dd className="mt-1 text-base text-stone-100">{calcularDiasInvictos(rito)}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>
    </main>
  );
}
