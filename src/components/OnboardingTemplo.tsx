import { FormEvent, useMemo, useState } from 'react';
import { useTemploStore } from '../store/useTemploStore';
import { TipoDeMeta } from '../types/discipline';

const sugestoesDeBatalha = [
  'Alcoolismo',
  'Cigarro',
  'Maconha',
  'Pornografia',
  'Brain rot',
  'Redes sociais'
];

const hojeISO = () => new Date().toISOString().slice(0, 10);

export function OnboardingTemplo() {
  const iniciarTemplo = useTemploStore((estado) => estado.iniciarTemplo);

  const [tituloDaBatalha, definirTituloDaBatalha] = useState('Alcoolismo');
  const [tipoDeMeta, definirTipoDeMeta] = useState<TipoDeMeta>('quaresma_40');
  const [dataInicioISO, definirDataInicioISO] = useState(hojeISO);
  const [dataFimISO, definirDataFimISO] = useState(hojeISO);
  const [gastoRecorrente, definirGastoRecorrente] = useState('0');
  const [frequenciaDeGasto, definirFrequenciaDeGasto] = useState<'diario' | 'semanal' | 'mensal'>(
    'diario'
  );

  const dataFimObrigatoria = tipoDeMeta === 'personalizada';
  const gastoNumerico = Number(gastoRecorrente.replace(',', '.'));

  const podeIniciar = useMemo(() => {
    if (tituloDaBatalha.trim().length < 3) return false;
    if (!dataInicioISO) return false;
    if (Number.isNaN(gastoNumerico) || gastoNumerico <= 0) return false;
    if (dataFimObrigatoria && (!dataFimISO || dataFimISO < dataInicioISO)) return false;
    return true;
  }, [dataFimISO, dataFimObrigatoria, dataInicioISO, gastoNumerico, tituloDaBatalha]);

  const aoEnviar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    if (!podeIniciar) return;

    iniciarTemplo({
      tituloDaBatalha: tituloDaBatalha.trim(),
      tipoDeMeta,
      dataInicioISO,
      dataFimISO: dataFimObrigatoria ? dataFimISO : null,
      gastoRecorrente: gastoNumerico,
      frequenciaDeGasto
    });
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 marble-overlay">
      <header className="mb-8 border-b border-bronze/20 pb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-bronze">Tempus Invictus</p>
        <h1 className="mt-2 font-serif text-4xl text-stone-100">Escolha Sua Batalha</h1>
        <p className="mt-2 max-w-2xl text-sm text-stone-300">
          Configure seu rito inicial de sobriedade para começar a contagem de dias invictos e ouro
          preservado.
        </p>
      </header>

      <form onSubmit={aoEnviar} className="space-y-6 rounded-3xl border border-gold/20 bg-black/30 p-6 shadow-temple">
        <label className="block space-y-2">
          <span className="text-xs uppercase tracking-[0.16em] text-stone-400">
            Nome do inimigo ou batalha
          </span>
          <input
            list="sugestoes-batalha"
            value={tituloDaBatalha}
            onChange={(evento) => definirTituloDaBatalha(evento.target.value)}
            className="w-full rounded-lg border border-bronze/30 bg-slate px-3 py-2 text-sm text-stone-100 outline-none ring-gold/40 focus:ring"
            placeholder="Ex.: alcoolismo"
          />
          <datalist id="sugestoes-batalha">
            {sugestoesDeBatalha.map((sugestao) => (
              <option key={sugestao} value={sugestao} />
            ))}
          </datalist>
        </label>

        <fieldset className="space-y-3">
          <legend className="text-xs uppercase tracking-[0.16em] text-stone-400">Meta de sobriedade</legend>
          <label className="flex cursor-pointer gap-3 rounded-xl border border-bronze/30 bg-slate/40 p-3">
            <input
              type="radio"
              name="tipo-meta"
              value="quaresma_40"
              checked={tipoDeMeta === 'quaresma_40'}
              onChange={() => definirTipoDeMeta('quaresma_40')}
            />
            <span className="text-sm text-stone-200">40 dias de sobriedade (Quaresma do Guerreiro)</span>
          </label>
          <label className="flex cursor-pointer gap-3 rounded-xl border border-bronze/30 bg-slate/40 p-3">
            <input
              type="radio"
              name="tipo-meta"
              value="permanente"
              checked={tipoDeMeta === 'permanente'}
              onChange={() => definirTipoDeMeta('permanente')}
            />
            <span className="text-sm text-stone-200">Sobriedade permanente (Tempus Invictus)</span>
          </label>
          <label className="flex cursor-pointer gap-3 rounded-xl border border-bronze/30 bg-slate/40 p-3">
            <input
              type="radio"
              name="tipo-meta"
              value="personalizada"
              checked={tipoDeMeta === 'personalizada'}
              onChange={() => definirTipoDeMeta('personalizada')}
            />
            <span className="text-sm text-stone-200">Data final personalizada</span>
          </label>
        </fieldset>

        <section className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-stone-400">
              Data de início da sobriedade
            </span>
            <input
              type="date"
              value={dataInicioISO}
              onChange={(evento) => definirDataInicioISO(evento.target.value)}
              className="w-full rounded-lg border border-bronze/30 bg-slate px-3 py-2 text-sm text-stone-100 outline-none ring-gold/40 focus:ring"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-stone-400">
              Data final da meta
            </span>
            <input
              type="date"
              min={dataInicioISO}
              value={dataFimISO}
              onChange={(evento) => definirDataFimISO(evento.target.value)}
              disabled={!dataFimObrigatoria}
              className="w-full rounded-lg border border-bronze/30 bg-slate px-3 py-2 text-sm text-stone-100 outline-none ring-gold/40 focus:ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </label>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-stone-400">Gasto com o vício</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={gastoRecorrente}
              onChange={(evento) => definirGastoRecorrente(evento.target.value)}
              className="w-full rounded-lg border border-bronze/30 bg-slate px-3 py-2 text-sm text-stone-100 outline-none ring-gold/40 focus:ring"
              placeholder="Ex.: 25"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-stone-400">Recorrência</span>
            <select
              value={frequenciaDeGasto}
              onChange={(evento) =>
                definirFrequenciaDeGasto(evento.target.value as 'diario' | 'semanal' | 'mensal')
              }
              className="w-full rounded-lg border border-bronze/30 bg-slate px-3 py-2 text-sm text-stone-100 outline-none ring-gold/40 focus:ring"
            >
              <option value="diario">Diário</option>
              <option value="semanal">Semanal</option>
              <option value="mensal">Mensal</option>
            </select>
          </label>
        </section>

        <button
          type="submit"
          disabled={!podeIniciar}
          className="w-full rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-xs uppercase tracking-[0.2em] text-gold transition enabled:hover:bg-gold/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Iniciar Tempus Invictus
        </button>
      </form>
    </main>
  );
}
