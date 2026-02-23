import { FrequenciaDeGasto, Rito } from '../types/discipline';

const MS_POR_DIA = 1000 * 60 * 60 * 24;

const normalizarDataISO = (dataISO: string) => new Date(`${dataISO}T12:00:00`);

const hojeISO = () => new Date().toISOString().slice(0, 10);

const diasEntreInclusive = (inicioISO: string, fimISO: string) => {
  const inicio = normalizarDataISO(inicioISO).getTime();
  const fim = normalizarDataISO(fimISO).getTime();
  const diferenca = Math.floor((fim - inicio) / MS_POR_DIA);
  return Math.max(0, diferenca + 1);
};

export const valorDiario = (gasto: number, frequencia: FrequenciaDeGasto) => {
  if (frequencia === 'diario') return gasto;
  if (frequencia === 'semanal') return gasto / 7;
  return gasto / 30;
};

export const calcularDiasInvictos = (rito: Rito, referenciaISO = hojeISO()) => {
  if (rito.estado === 'em_queda') return 0;
  return diasEntreInclusive(rito.dataInicioISO, referenciaISO);
};

export const calcularOuroPreservado = (rito: Rito, referenciaISO = hojeISO()) => {
  return calcularDiasInvictos(rito, referenciaISO) * valorDiario(rito.gastoRecorrente, rito.frequenciaDeGasto);
};

export const calcularDistribuicaoDoOuro = (rito: Rito, referenciaISO = hojeISO()) => {
  const preservado = calcularOuroPreservado(rito, referenciaISO);
  const valorPorDia = valorDiario(rito.gastoRecorrente, rito.frequenciaDeGasto);

  if (rito.tipoDeMeta === 'permanente') {
    const emRisco = valorPorDia * 30;
    const total = preservado + emRisco;
    return {
      preservado,
      emRisco,
      rotuloRisco: 'Próximos 30 dias',
      total
    };
  }

  const fimISO = rito.dataFimISO ?? referenciaISO;
  const diasDaMeta = diasEntreInclusive(rito.dataInicioISO, fimISO);
  const diasCumpridos = Math.min(calcularDiasInvictos(rito, referenciaISO), diasDaMeta);
  const diasRestantes = Math.max(0, diasDaMeta - diasCumpridos);
  const emRisco = diasRestantes * valorPorDia;
  const total = preservado + emRisco;

  return {
    preservado,
    emRisco,
    rotuloRisco: 'Meta restante',
    total
  };
};
