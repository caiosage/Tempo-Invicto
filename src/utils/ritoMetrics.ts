import { FrequenciaDeGasto, Rito } from '../types/discipline';

const MS_POR_DIA = 1000 * 60 * 60 * 24;

const normalizarDataISO = (dataISO: string) => new Date(`${dataISO}T12:00:00`);

const hojeISO = () => new Date().toISOString().slice(0, 10);

const diasEntre = (inicioISO: string, fimISO: string) => {
  const inicio = normalizarDataISO(inicioISO).getTime();
  const fim = normalizarDataISO(fimISO).getTime();
  const diferenca = Math.floor((fim - inicio) / MS_POR_DIA);
  return Math.max(0, diferenca);
};

export const valorDiario = (gasto: number, frequencia: FrequenciaDeGasto) => {
  if (frequencia === 'diario') return gasto;
  if (frequencia === 'semanal') return gasto / 7;
  return gasto / 30;
};

export const horasDiarias = (horas: number, frequencia: FrequenciaDeGasto) => {
  if (frequencia === 'diario') return horas;
  if (frequencia === 'semanal') return horas / 7;
  return horas / 30;
};

export const calcularDiasInvictos = (rito: Rito, referenciaISO = hojeISO()) => {
  if (rito.estado === 'em_queda') return 0;
  return diasEntre(rito.dataInicioISO, referenciaISO);
};

export const calcularOuroPreservado = (rito: Rito, referenciaISO = hojeISO()) => {
  if (!rito.aplicaOuro) return 0;
  return calcularDiasInvictos(rito, referenciaISO) * valorDiario(rito.gastoRecorrente, rito.frequenciaDeGasto);
};

export const calcularTempoDeVidaGanho = (rito: Rito, referenciaISO = hojeISO()) => {
  return calcularDiasInvictos(rito, referenciaISO) * horasDiarias(rito.tempoRecorrenteEmHoras, rito.frequenciaDeTempo);
};

export const calcularDistribuicaoDoOuro = (rito: Rito, referenciaISO = hojeISO()) => {
  const preservado = calcularOuroPreservado(rito, referenciaISO);
  if (preservado <= 0) {
    return { preservado: 0, emRisco: 0, rotuloRisco: 'Proximos 30 dias', total: 0 };
  }
  const valorPorDia = valorDiario(rito.gastoRecorrente, rito.frequenciaDeGasto);
  const emRisco = valorPorDia * 30;
  const total = preservado + emRisco;
  return { preservado, emRisco, rotuloRisco: 'Proximos 30 dias', total };
};

export const calcularDistribuicaoDoTempo = (rito: Rito, referenciaISO = hojeISO()) => {
  const preservado = calcularTempoDeVidaGanho(rito, referenciaISO);
  if (preservado <= 0) {
    return { preservado: 0, emRisco: 0, rotuloRisco: 'Proximos 30 dias', total: 0 };
  }
  const horasPorDia = horasDiarias(rito.tempoRecorrenteEmHoras, rito.frequenciaDeTempo);
  const emRisco = horasPorDia * 30;
  const total = preservado + emRisco;
  return { preservado, emRisco, rotuloRisco: 'Proximos 30 dias', total };
};

// Regra CLT simplificada: 8h por dia, 5 dias/semana, ~4.5 semanas por mes.
export const calcularValorHoraCLT = (proventosMensais: number) => {
  const horasMensais = 8 * 5 * 4.5;
  if (proventosMensais <= 0) return 0;
  return proventosMensais / horasMensais;
};

export const calcularHorasEquivalentesDoOuro = (rito: Rito, referenciaISO = hojeISO()) => {
  if (!rito.aplicaOuro) return 0;
  const valorHora = calcularValorHoraCLT(rito.proventosMensais);
  if (valorHora <= 0) return 0;
  return calcularOuroPreservado(rito, referenciaISO) / valorHora;
};

export const calcularDistribuicaoHorasEquivalentes = (rito: Rito, referenciaISO = hojeISO()) => {
  if (!rito.aplicaOuro) {
    return { preservado: 0, emRisco: 0, total: 0 };
  }

  const valorHora = calcularValorHoraCLT(rito.proventosMensais);
  if (valorHora <= 0) {
    return { preservado: 0, emRisco: 0, total: 0 };
  }

  const ouro = calcularDistribuicaoDoOuro(rito, referenciaISO);
  const preservado = ouro.preservado / valorHora;
  const emRisco = ouro.emRisco / valorHora;
  return { preservado, emRisco, total: preservado + emRisco };
};

export const calcularDinheiroEquivalenteDoTempo = (rito: Rito, referenciaISO = hojeISO()) => {
  const valorHora = calcularValorHoraCLT(rito.proventosMensais);
  if (valorHora <= 0) return 0;
  return calcularTempoDeVidaGanho(rito, referenciaISO) * valorHora;
};

export const calcularDistribuicaoDinheiroEquivalenteDoTempo = (rito: Rito, referenciaISO = hojeISO()) => {
  const valorHora = calcularValorHoraCLT(rito.proventosMensais);
  if (valorHora <= 0) return { preservado: 0, emRisco: 0, total: 0 };

  const tempo = calcularDistribuicaoDoTempo(rito, referenciaISO);
  const preservado = tempo.preservado * valorHora;
  const emRisco = tempo.emRisco * valorHora;
  return { preservado, emRisco, total: preservado + emRisco };
};
