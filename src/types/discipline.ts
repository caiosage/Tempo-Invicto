export type EstadoDoRito = 'vigente' | 'em_queda';
export type TipoDeMeta = 'quaresma_40' | 'permanente' | 'personalizada';
export type FrequenciaDeGasto = 'diario' | 'semanal' | 'mensal';

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
  tituloDaBatalha: string;
  aplicaOuro: boolean;
  dataInicioISO: string;
  dataFimISO: string | null;
  tipoDeMeta: TipoDeMeta;
  proventosMensais: number;
  gastoRecorrente: number;
  frequenciaDeGasto: FrequenciaDeGasto;
  tempoRecorrenteEmHoras: number;
  frequenciaDeTempo: FrequenciaDeGasto;
  estado: EstadoDoRito;
  ultimaQuedaEmISO: string | null;
  registrosDeRetorno: RegistroDeRetorno[];
}

export interface NovoRegistroDeRetorno {
  emocaoDominante: string;
  pensamentoNuclear: string;
  escolhaDeTransmutacao: string;
}

export interface NovoRito {
  tituloDaBatalha: string;
  aplicaOuro: boolean;
  dataInicioISO: string;
  dataFimISO: string | null;
  tipoDeMeta: TipoDeMeta;
  proventosMensais: number;
  gastoRecorrente: number;
  frequenciaDeGasto: FrequenciaDeGasto;
  tempoRecorrenteEmHoras: number;
  frequenciaDeTempo: FrequenciaDeGasto;
}
