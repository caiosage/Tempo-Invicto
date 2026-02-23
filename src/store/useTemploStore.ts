import { create } from 'zustand';
import {
  NovoRegistroDeRetorno,
  RegistroDeRetorno,
  Rito
} from '../types/discipline';

const CHAVE_LOCAL_STORAGE = 'tempus-invictus-templo-v1';

interface EstadoDoTemplo {
  ritos: Rito[];
  ritoEmRitualDeRetornoId: string | null;
  registrarQueda: (ritoId: string) => void;
  concluirRitualDeRetorno: (ritoId: string, registro: NovoRegistroDeRetorno) => void;
  encerrarRitualSemRegistro: () => void;
}

const ritosIniciais: Rito[] = [
  {
    id: 'rito-claridade-matinal',
    nome: 'Claridade Matinal',
    estado: 'vigente',
    diasInvictos: 9,
    ouroPreservado: 180,
    ultimaQuedaEmISO: null,
    registrosDeRetorno: []
  },
  {
    id: 'rito-sobriedade-digital',
    nome: 'Sobriedade Digital',
    estado: 'em_queda',
    diasInvictos: 0,
    ouroPreservado: 0,
    ultimaQuedaEmISO: new Date().toISOString(),
    registrosDeRetorno: []
  }
];

const carregarEstado = (): Pick<EstadoDoTemplo, 'ritos' | 'ritoEmRitualDeRetornoId'> => {
  const cru = localStorage.getItem(CHAVE_LOCAL_STORAGE);
  if (!cru) {
    return {
      ritos: ritosIniciais,
      ritoEmRitualDeRetornoId: ritosIniciais.find((rito) => rito.estado === 'em_queda')?.id ?? null
    };
  }

  try {
    const parseado = JSON.parse(cru) as Pick<
      EstadoDoTemplo,
      'ritos' | 'ritoEmRitualDeRetornoId'
    >;
    return parseado;
  } catch {
    return {
      ritos: ritosIniciais,
      ritoEmRitualDeRetornoId: null
    };
  }
};

const persistirEstado = (estado: Pick<EstadoDoTemplo, 'ritos' | 'ritoEmRitualDeRetornoId'>) => {
  localStorage.setItem(CHAVE_LOCAL_STORAGE, JSON.stringify(estado));
};

export const useTemploStore = create<EstadoDoTemplo>((set, get) => ({
  ...carregarEstado(),
  registrarQueda: (ritoId) => {
    set((estadoAnterior) => {
      const proximo = {
        ritos: estadoAnterior.ritos.map((rito) =>
          rito.id === ritoId
            ? {
                ...rito,
                estado: 'em_queda',
                ultimaQuedaEmISO: new Date().toISOString(),
                diasInvictos: 0
              }
            : rito
        ),
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

      const proximo = {
        ritos: estadoAnterior.ritos.map((rito) =>
          rito.id === ritoId
            ? {
                ...rito,
                estado: 'vigente',
                diasInvictos: 1,
                registrosDeRetorno: [novoRegistro, ...rito.registrosDeRetorno]
              }
            : rito
        ),
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
