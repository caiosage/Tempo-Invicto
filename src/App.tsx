import { useState } from 'react';
import { DashboardTemplo } from './components/DashboardTemplo';
import { OnboardingTemplo } from './components/OnboardingTemplo';
import { RitualDeRetorno } from './components/RitualDeRetorno';
import { useTemploStore } from './store/useTemploStore';

export default function App() {
  const [estaCadastrandoNovaBatalha, definirCadastroDeNovaBatalha] = useState(false);
  const possuiRito = useTemploStore((estado) => estado.ritos.length > 0);
  const ritoEmRitualDeRetornoId = useTemploStore((estado) => estado.ritoEmRitualDeRetornoId);

  if (!possuiRito || estaCadastrandoNovaBatalha) {
    return (
      <OnboardingTemplo
        modo={possuiRito ? 'adicao' : 'inicial'}
        aoConcluirCadastro={() => definirCadastroDeNovaBatalha(false)}
        aoCancelarCadastro={() => definirCadastroDeNovaBatalha(false)}
      />
    );
  }

  if (ritoEmRitualDeRetornoId) return <RitualDeRetorno />;

  return <DashboardTemplo aoRegistrarNovaBatalha={() => definirCadastroDeNovaBatalha(true)} />;
}
