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
    emocaoDominante.trim().length > 2 &&
    pensamentoNuclear.trim().length > 6 &&
    escolhaDeTransmutacao.trim().length > 6;

  const aoSubmeter = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    if (!podeConcluir) return;

    concluirRitual(rito.id, {
      emocaoDominante,
      pensamentoNuclear,
      escolhaDeTransmutacao
    });

    definirEmocaoDominante('');
    definirPensamentoNuclear('');
    definirEscolhaDeTransmutacao('');
  };

  return (
    <section className="rounded-3xl border border-gold/25 bg-black/30 p-6 shadow-temple">
      <header className="mb-5">
        <p className="text-xs uppercase tracking-[0.24em] text-bronze">Ritual de Retorno</p>
        <h2 className="mt-2 font-serif text-2xl text-gold">{rito.nome}</h2>
        <p className="mt-2 text-sm text-stone-300">
          Nomeie a emoção e o pensamento que antecederam a queda. Sem punição. Apenas lucidez e
          direção.
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
          />
        </label>

        <label className="block space-y-2">
          <span className="text-xs uppercase tracking-[0.16em] text-stone-400">Pensamento nuclear</span>
          <textarea
            value={pensamentoNuclear}
            onChange={(evento) => definirPensamentoNuclear(evento.target.value)}
            className="h-20 w-full rounded-lg border border-bronze/30 bg-slate px-3 py-2 text-sm text-stone-100 outline-none ring-gold/40 focus:ring"
            placeholder="Qual narrativa interna abriu a porta para a queda?"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-xs uppercase tracking-[0.16em] text-stone-400">Escolha de transmutação</span>
          <textarea
            value={escolhaDeTransmutacao}
            onChange={(evento) => definirEscolhaDeTransmutacao(evento.target.value)}
            className="h-20 w-full rounded-lg border border-bronze/30 bg-slate px-3 py-2 text-sm text-stone-100 outline-none ring-gold/40 focus:ring"
            placeholder="Qual ato sóbrio você executará nas próximas 24h?"
          />
        </label>

        <button
          type="submit"
          disabled={!podeConcluir}
          className="w-full rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-xs uppercase tracking-[0.2em] text-gold transition enabled:hover:bg-gold/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Selar Ritual de Retorno
        </button>
      </form>
    </section>
  );
}
