import { create } from 'zustand';
import {
  FrequenciaDeGasto,
  NovoRito,
  NovoRegistroDeRetorno,
  RegistroDeRetorno,
  Rito
} from '../types/discipline';

const CHAVE_LOCAL_STORAGE = 'tempus-invictus-templo-v1';

interface EstadoDoTemplo {
  ritos: Rito[];
  ritoEmRitualDeRetornoId: string | null;
  iniciarTemplo: (novoRito: NovoRito) => void;
  registrarQueda: (ritoId: string) => void;
  concluirRitualDeRetorno: (ritoId: string, registro: NovoRegistroDeRetorno) => void;
  encerrarRitualSemRegistro: () => void;
}

const frequenciasValidas: FrequenciaDeGasto[] = ['diario', 'semanal', 'mensal'];
const metasValidas = ['quaresma_40', 'permanente', 'personalizada'] as const;
const estadosValidos = ['vigente', 'em_queda'] as const;

const hojeISO = () => new Date().toISOString().slice(0, 10);

const ehObjeto = (valor: unknown): valor is Record<string, unknown> => {
  return typeof valor === 'object' && valor !== null;
};

const adicionarDias = (dataISO: string, dias: number) => {
  const data = new Date(`${dataISO}T12:00:00`);
  data.setDate(data.getDate() + dias);
  return data.toISOString().slice(0, 10);
};

const criarRito = (novoRito: NovoRito): Rito => {
  const dataFimPadrao =
    novoRito.tipoDeMeta === 'quaresma_40' ? adicionarDias(novoRito.dataInicioISO, 39) : null;

  return {
    id: crypto.randomUUID(),
    nome: 'Rito de Sobriedade',
    tituloDaBatalha: novoRito.tituloDaBatalha.trim(),
    dataInicioISO: novoRito.dataInicioISO,
    dataFimISO: novoRito.tipoDeMeta === 'personalizada' ? novoRito.dataFimISO : dataFimPadrao,
    tipoDeMeta: novoRito.tipoDeMeta,
    gastoRecorrente: novoRito.gastoRecorrente,
    frequenciaDeGasto: novoRito.frequenciaDeGasto,
    estado: 'vigente',
    ultimaQuedaEmISO: null,
    registrosDeRetorno: []
  };
};

const carregarEstado = (): Pick<EstadoDoTemplo, 'ritos' | 'ritoEmRitualDeRetornoId'> => {
  const cru = localStorage.getItem(CHAVE_LOCAL_STORAGE);
  if (!cru) {
    return {
      ritos: [],
      ritoEmRitualDeRetornoId: null
    };
  }

  try {
    const parseado = JSON.parse(cru) as {
      ritos?: unknown;
      ritoEmRitualDeRetornoId?: unknown;
    };

    const ritos = Array.isArray(parseado.ritos)
      ? parseado.ritos.filter(
          (rito): rito is Rito => {
            if (!ehObjeto(rito)) return false;

            return (
              typeof rito.id === 'string' &&
              typeof rito.nome === 'string' &&
              typeof rito.tituloDaBatalha === 'string' &&
              typeof rito.dataInicioISO === 'string' &&
              (typeof rito.dataFimISO === 'string' || rito.dataFimISO === null) &&
              metasValidas.includes(rito.tipoDeMeta as (typeof metasValidas)[number]) &&
              typeof rito.gastoRecorrente === 'number' &&
              frequenciasValidas.includes(rito.frequenciaDeGasto as FrequenciaDeGasto) &&
              estadosValidos.includes(rito.estado as (typeof estadosValidos)[number]) &&
              (typeof rito.ultimaQuedaEmISO === 'string' || rito.ultimaQuedaEmISO === null) &&
              Array.isArray(rito.registrosDeRetorno)
            );
          }
        )
      : [];

    return {
      ritos,
      ritoEmRitualDeRetornoId:
        typeof parseado.ritoEmRitualDeRetornoId === 'string'
          ? parseado.ritoEmRitualDeRetornoId
          : null
    };
  } catch {
    return {
      ritos: [],
      ritoEmRitualDeRetornoId: null
    };
  }
};

const persistirEstado = (estado: Pick<EstadoDoTemplo, 'ritos' | 'ritoEmRitualDeRetornoId'>) => {
  localStorage.setItem(CHAVE_LOCAL_STORAGE, JSON.stringify(estado));
};

export const useTemploStore = create<EstadoDoTemplo>((set, get) => ({
  ...carregarEstado(),
  iniciarTemplo: (novoRito) => {
    const proximo: Pick<EstadoDoTemplo, 'ritos' | 'ritoEmRitualDeRetornoId'> = {
      ritos: [criarRito(novoRito)],
      ritoEmRitualDeRetornoId: null
    };

    persistirEstado(proximo);
    set(proximo);
  },
  registrarQueda: (ritoId) => {
    set((estadoAnterior) => {
      const ritosAtualizados: Rito[] = estadoAnterior.ritos.map((rito) =>
          rito.id === ritoId
            ? {
                ...rito,
                estado: 'em_queda' as const,
                ultimaQuedaEmISO: new Date().toISOString()
              }
            : rito
        );

      const proximo: Pick<EstadoDoTemplo, 'ritos' | 'ritoEmRitualDeRetornoId'> = {
        ritos: ritosAtualizados,
        ritoEmRitualDeRetornoId: ritoId
      };
      persistirEstado(proximo);
      return proximo;
    });
  },
  concluirRitualDeRetorno: (ritoId, registro) => {
    set((estadoAnterior) => {
      const novoRegistro: RegistroDeRetorno = {
        ...registro,
        id: crypto.randomUUID(),
        dataISO: new Date().toISOString()
      };
      const dataAtualISO = hojeISO();

      const ritosAtualizados: Rito[] = estadoAnterior.ritos.map((rito) =>
          rito.id !== ritoId
            ? rito
            : {
                ...rito,
                estado: 'vigente' as const,
                dataInicioISO: dataAtualISO,
                dataFimISO:
                  rito.tipoDeMeta === 'quaresma_40' ? adicionarDias(dataAtualISO, 39) : rito.dataFimISO,
                registrosDeRetorno: [novoRegistro, ...rito.registrosDeRetorno]
              }
        );

      const proximo: Pick<EstadoDoTemplo, 'ritos' | 'ritoEmRitualDeRetornoId'> = {
        ritos: ritosAtualizados,
        ritoEmRitualDeRetornoId: null
      };

      persistirEstado(proximo);
      return proximo;
    });
  },
  encerrarRitualSemRegistro: () => {
    const proximo = {
      ritos: get().ritos,
      ritoEmRitualDeRetornoId: null
    };
    persistirEstado(proximo);
    set(proximo);
  }
}));
