import type { AppScreen } from '../../types';
import { useSimulation } from '../../context/SimulationContext';
import './Navigation.css';

const NAV_ITEMS: { id: AppScreen; label: string }[] = [
  { id: 'visao-geral', label: 'Visão geral' },
  { id: 'cabine', label: 'Cabine' },
  { id: 'sustentabilidade', label: 'Sustentabilidade' },
  { id: 'historico', label: 'Histórico' },
  { id: 'sobre', label: 'Sobre o projeto' },
];

export function Navigation() {
  const { state, setScreen } = useSimulation();

  return (
    <nav className="nav" aria-label="Navegação principal">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          className={`nav__item ${state.screen === item.id ? 'is-active' : ''}`}
          onClick={() => setScreen(item.id)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
