import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useTemploStore } from '../store/useTemploStore';
import { FrequenciaDeGasto, TipoDeMeta } from '../types/discipline';

interface OnboardingTemploProps {
  modo: 'inicial' | 'adicao';
  aoConcluirCadastro: () => void;
  aoCancelarCadastro: () => void;
}

const inimigosDaVigilia = [
  'Vinho da Queda (alcoolismo)',
  'Brasa do Hábito (cigarro)',
  'Neblina da Mente (maconha)',
  'Luxuria Compulsiva (pornografia)',
  'Ruido Mental (brain rot)',
  'Arena Infinita (redes sociais)'
];

const batalhaSemOuro = (titulo: string) => {
  const texto = titulo.toLowerCase();
  return texto.includes('brain rot') || texto.includes('redes sociais');
};

const hojeISO = () => new Date().toISOString().slice(0, 10);

const adicionarDias = (dataISO: string, dias: number) => {
  const data = new Date(`${dataISO}T12:00:00`);
  data.setDate(data.getDate() + dias);
  return data.toISOString().slice(0, 10);
};

export function OnboardingTemplo({
  modo,
  aoConcluirCadastro,
  aoCancelarCadastro
}: OnboardingTemploProps) {
  const iniciarTemplo = useTemploStore((estado) => estado.iniciarTemplo);

  const [tituloDaBatalha, definirTituloDaBatalha] = useState(inimigosDaVigilia[0]);
  const [tipoDeMeta, definirTipoDeMeta] = useState<TipoDeMeta>('quaresma_40');
  const [dataInicioISO, definirDataInicioISO] = useState(hojeISO);
  const [dataFimISO, definirDataFimISO] = useState(adicionarDias(hojeISO(), 40));
  const [gastoRecorrente, definirGastoRecorrente] = useState('0');
  const [proventosMensais, definirProventosMensais] = useState('0');
  const [frequenciaDeGasto, definirFrequenciaDeGasto] = useState<FrequenciaDeGasto>('diario');
  const [tempoRecorrenteEmHoras, definirTempoRecorrenteEmHoras] = useState('0');
  const [frequenciaDeTempo, definirFrequenciaDeTempo] = useState<FrequenciaDeGasto>('diario');

  useEffect(() => {
    if (tipoDeMeta === 'quaresma_40') {
      definirDataFimISO(adicionarDias(dataInicioISO, 40));
      return;
    }

    if (tipoDeMeta === 'permanente') {
      definirDataFimISO('');
      return;
    }

    if (!dataFimISO || dataFimISO < dataInicioISO) {
      definirDataFimISO(dataInicioISO);
    }
  }, [dataInicioISO, dataFimISO, tipoDeMeta]);

  const dataFimObrigatoria = tipoDeMeta === 'personalizada';
  const aplicaOuro = !batalhaSemOuro(tituloDaBatalha);
  const gastoNumerico = Number(gastoRecorrente.replace(',', '.'));
  const proventosNumerico = Number(proventosMensais.replace(',', '.'));
  const tempoNumerico = Number(tempoRecorrenteEmHoras.replace(',', '.'));

  const podeIniciar = useMemo(() => {
    if (tituloDaBatalha.trim().length < 3) return false;
    if (!dataInicioISO) return false;
    if (aplicaOuro && (Number.isNaN(gastoNumerico) || gastoNumerico <= 0)) return false;
    if (Number.isNaN(tempoNumerico) || tempoNumerico <= 0) return false;
    if (dataFimObrigatoria && (!dataFimISO || dataFimISO < dataInicioISO)) return false;
    return true;
  }, [
    aplicaOuro,
    dataFimISO,
    dataFimObrigatoria,
    dataInicioISO,
    gastoNumerico,
    tempoNumerico,
    tituloDaBatalha
  ]);

  const aoEnviar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    if (!podeIniciar) return;

    iniciarTemplo({
      tituloDaBatalha: tituloDaBatalha.trim(),
      aplicaOuro,
      tipoDeMeta,
      dataInicioISO,
      dataFimISO: dataFimObrigatoria ? dataFimISO : null,
      proventosMensais:
        Number.isNaN(proventosNumerico) || proventosNumerico <= 0 ? 0 : proventosNumerico,
      gastoRecorrente: aplicaOuro ? gastoNumerico : 0,
      frequenciaDeGasto,
      tempoRecorrenteEmHoras: tempoNumerico,
      frequenciaDeTempo
    });
    aoConcluirCadastro();
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 marble-overlay">
      <header className="mb-8 border-b border-bronze/20 pb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-bronze">Tempus Invictus</p>
        <h1 className="mt-2 font-serif text-4xl text-stone-100">
          {modo === 'inicial' ? 'Escolha Sua Batalha' : 'Forjar Nova Batalha'}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-stone-300">
          Configure o rito para iniciar a contagem de sobriedade, ouro preservado e tempo de vida ganho.
        </p>
      </header>

      <form
        onSubmit={aoEnviar}
        className="space-y-6 rounded-3xl border border-gold/20 bg-black/30 p-6 shadow-temple"
      >
        <label className="block space-y-2">
          <span className="text-xs uppercase tracking-[0.16em] text-stone-400">Inimigo da vigília</span>
          <select
            value={tituloDaBatalha}
            onChange={(evento) => definirTituloDaBatalha(evento.target.value)}
            className="w-full rounded-lg border border-bronze/30 bg-slate px-3 py-2 text-sm text-stone-100 outline-none ring-gold/40 focus:ring"
          >
            {inimigosDaVigilia.map((inimigo) => (
              <option key={inimigo} value={inimigo}>
                {inimigo}
              </option>
            ))}
          </select>
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
            <span className="text-xs uppercase tracking-[0.16em] text-stone-400">Data de início da sobriedade</span>
            <input
              type="date"
              value={dataInicioISO}
              onChange={(evento) => definirDataInicioISO(evento.target.value)}
              className="w-full rounded-lg border border-bronze/30 bg-slate px-3 py-2 text-sm text-stone-100 outline-none ring-gold/40 focus:ring"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-stone-400">Data final da meta</span>
            {tipoDeMeta === 'permanente' ? (
              <div className="flex h-[42px] items-center rounded-lg border border-bronze/30 bg-slate px-3 text-2xl text-gold">
                ∞
              </div>
            ) : (
              <input
                type="date"
                min={dataInicioISO}
                value={dataFimISO}
                onChange={(evento) => definirDataFimISO(evento.target.value)}
                disabled={tipoDeMeta === 'quaresma_40'}
                className="w-full rounded-lg border border-bronze/30 bg-slate px-3 py-2 text-sm text-stone-100 outline-none ring-gold/40 focus:ring disabled:cursor-not-allowed disabled:opacity-70"
              />
            )}
          </label>
        </section>

        {aplicaOuro ? (
          <section className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-xs uppercase tracking-[0.16em] text-stone-400">Tributo em ouro (R$)</span>
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
              <span className="text-xs uppercase tracking-[0.16em] text-stone-400">Cadência do ouro</span>
              <select
                value={frequenciaDeGasto}
                onChange={(evento) => definirFrequenciaDeGasto(evento.target.value as FrequenciaDeGasto)}
                className="w-full rounded-lg border border-bronze/30 bg-slate px-3 py-2 text-sm text-stone-100 outline-none ring-gold/40 focus:ring"
              >
                <option value="diario">Diario</option>
                <option value="semanal">Semanal</option>
                <option value="mensal">Mensal</option>
              </select>
            </label>
          </section>
        ) : null}

        <section className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-stone-400">Horas drenadas pelo inimigo</span>
            <input
              type="number"
              min="0"
              step="0.1"
              value={tempoRecorrenteEmHoras}
              onChange={(evento) => definirTempoRecorrenteEmHoras(evento.target.value)}
              className="w-full rounded-lg border border-bronze/30 bg-slate px-3 py-2 text-sm text-stone-100 outline-none ring-gold/40 focus:ring"
              placeholder="Ex.: 3"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-stone-400">Cadência do tempo</span>
            <select
              value={frequenciaDeTempo}
              onChange={(evento) => definirFrequenciaDeTempo(evento.target.value as FrequenciaDeGasto)}
              className="w-full rounded-lg border border-bronze/30 bg-slate px-3 py-2 text-sm text-stone-100 outline-none ring-gold/40 focus:ring"
            >
              <option value="diario">Diario</option>
              <option value="semanal">Semanal</option>
              <option value="mensal">Mensal</option>
            </select>
          </label>
        </section>

        <details className="rounded-xl border border-bronze/30 bg-slate/30 p-4">
          <summary className="cursor-pointer text-xs uppercase tracking-[0.16em] text-stone-300">
            Informações adicionais do arsenal
          </summary>
          <div className="mt-4">
            <label className="block space-y-2">
              <span className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-stone-400">
                <span>Proventos mensais (R$)</span>
                <span
                  className="inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full border border-bronze/40 text-[10px]"
                  title="Dado sigiloso do guerreiro: fica privado no seu templo"
                >
                  ?
                </span>
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={proventosMensais}
                onChange={(evento) => definirProventosMensais(evento.target.value)}
                className="w-full rounded-lg border border-bronze/30 bg-slate px-3 py-2 text-sm text-stone-100 outline-none ring-gold/40 focus:ring"
                placeholder="Opcional - ex.: 4200"
              />
              <p className="text-xs text-stone-400">
                <strong>Transparência: </strong> Seguindo a máxima <strong><i>tempo é dinheiro</i></strong>, este valor apoia a conversão de
                ouro poupado em horas equivalentes de trabalho.
              </p>
            </label>
          </div>
        </details>

        <div className="flex flex-col gap-3 md:flex-row">
          {modo === 'adicao' ? (
            <button
              type="button"
              onClick={aoCancelarCadastro}
              className="w-full rounded-lg border border-bronze/30 px-4 py-3 text-xs uppercase tracking-[0.2em] text-stone-300 transition hover:border-gold/50 hover:text-gold"
            >
              Voltar ao Templo
            </button>
          ) : null}

          <button
            type="submit"
            disabled={!podeIniciar}
            className="w-full rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-xs uppercase tracking-[0.2em] text-gold transition enabled:hover:bg-gold/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {modo === 'inicial' ? 'Iniciar Tempus Invictus' : 'Adicionar Batalha ao Templo'}
          </button>
        </div>
      </form>
    </main>
  );
}

