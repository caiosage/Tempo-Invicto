import { FormEvent, useMemo, useState } from 'react';
import { useTemploStore } from '../store/useTemploStore';

export function RitualDeRetorno() {
  const ritoId = useTemploStore((estado) => estado.ritoEmRitualDeRetornoId);
  const ritos = useTemploStore((estado) => estado.ritos);
  const concluirRitual = useTemploStore((estado) => estado.concluirRitualDeRetorno);

  const rito = useMemo(() => ritos.find((item) => item.id === ritoId), [ritos, ritoId]);

  const [emocaoDominante, definirEmocaoDominante] = useState('');
  const [pensamentoNuclear, definirPensamentoNuclear] = useState('');
  const [escolhaDeTransmutacao, definirEscolhaDeTransmutacao] = useState('');

  if (!rito) return null;

  const podeConcluir =
    emocaoDominante.trim().length > 0 &&
    pensamentoNuclear.trim().length > 0 &&
    escolhaDeTransmutacao.trim().length > 0;

  const aoSubmeter = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    if (!podeConcluir) return;

    concluirRitual(rito.id, {
      emocaoDominante,
      pensamentoNuclear,
      escolhaDeTransmutacao
    });
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 marble-overlay">
      <section className="rounded-3xl border border-gold/25 bg-black/30 p-6 shadow-temple">
        <header className="mb-5">
          <p className="text-xs uppercase tracking-[0.24em] text-bronze">Ritual de Retorno</p>
          <h1 className="mt-2 font-serif text-3xl text-gold">{rito.tituloDaBatalha}</h1>
          <p className="mt-3 text-sm italic text-stone-300">
            '“A dor e o sofrimento são sempre inevitáveis para uma grande inteligência e um coração profundo” - Fiódor Dostoiévski'
          </p>
          <p className="mt-3 text-sm text-stone-300">
            Nomeie a emoção e o pensamento que antecederam a queda. O retorno ao Templo exige lucidez.
          </p>
        </header>

        <form className="space-y-4" onSubmit={aoSubmeter}>
          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-stone-400">Emoção dominante</span>
            <input
              value={emocaoDominante}
              onChange={(evento) => definirEmocaoDominante(evento.target.value)}
              className="w-full rounded-lg border border-bronze/30 bg-slate px-3 py-2 text-sm text-stone-100 outline-none ring-gold/40 focus:ring"
              placeholder="Ex.: inquietação"
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-stone-400">Pensamento nuclear</span>
            <textarea
              value={pensamentoNuclear}
              onChange={(evento) => definirPensamentoNuclear(evento.target.value)}
              className="h-20 w-full rounded-lg border border-bronze/30 bg-slate px-3 py-2 text-sm text-stone-100 outline-none ring-gold/40 focus:ring"
              placeholder="Qual narrativa interna abriu a porta para a queda?"
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-stone-400">Escolha de transmutação</span>
            <textarea
              value={escolhaDeTransmutacao}
              onChange={(evento) => definirEscolhaDeTransmutacao(evento.target.value)}
              className="h-20 w-full rounded-lg border border-bronze/30 bg-slate px-3 py-2 text-sm text-stone-100 outline-none ring-gold/40 focus:ring"
              placeholder="Qual ato sóbrio você executará nas próximas 24h?"
              required
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-xs uppercase tracking-[0.2em] text-gold transition hover:bg-gold/20"
          >
            Selar Ritual de Retorno
          </button>
        </form>
      </section>
    </main>
  );
}
