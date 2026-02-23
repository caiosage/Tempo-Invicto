export type EstadoDoRito = 'vigente' | 'em_queda';

export interface RegistroDeRetorno {
  id: string;
  dataISO: string;
  emocaoDominante: string;
  pensamentoNuclear: string;
  escolhaDeTransmutacao: string;
}

export interface Rito {
  id: string;
  nome: string;
  estado: EstadoDoRito;
  diasInvictos: number;
  ouroPreservado: number;
  ultimaQuedaEmISO: string | null;
  registrosDeRetorno: RegistroDeRetorno[];
}

export interface NovoRegistroDeRetorno {
  emocaoDominante: string;
  pensamentoNuclear: string;
  escolhaDeTransmutacao: string;
}
