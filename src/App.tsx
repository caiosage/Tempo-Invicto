import { DashboardTemplo } from './components/DashboardTemplo';
import { OnboardingTemplo } from './components/OnboardingTemplo';
import { useTemploStore } from './store/useTemploStore';

export default function App() {
  const possuiRito = useTemploStore((estado) => estado.ritos.length > 0);

  if (!possuiRito) return <OnboardingTemplo />;

  return <DashboardTemplo />;
}
