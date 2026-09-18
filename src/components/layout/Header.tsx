import { useSimulation } from '../../context/SimulationContext';
import { useMetrics } from '../../hooks/useMetrics';
import { Button } from '../ui/Button';
import './Header.css';

export function Header() {
  const { state, togglePresentation, setDemoRunning, setDemoStep, reset } = useSimulation();
  const metrics = useMetrics();

  const startDemo = () => {
    setDemoStep('sistema-normal');
    setDemoRunning(true);
  };

  const dotColor =
    metrics.overallLevel === 'critico' ? 'red' : metrics.overallLevel === 'atencao' ? 'amber' : 'green';

  return (
    <header className="header">
      <div className="header__brand">
        <div className="header__mark">SC²</div>
        <div>
          <h1 className="header__title">
            SIMAC<sup>2</sup>
          </h1>
          <p className="header__subtitle">Sistema Inteligente de Monitoramento Ambiental de Cabine e Carga</p>
        </div>
      </div>

      <div className="header__status">
        <span className={`header__dot header__dot--${dotColor}`} />
        <span className="mono header__status-text">
          {state.demoRunning ? 'DEMONSTRAÇÃO EM ANDAMENTO' : 'SISTEMA ONLINE — DADOS SIMULADOS'}
        </span>
      </div>

      <div className="header__actions">
        <Button variant="ghost" onClick={reset}>
          Reiniciar simulação
        </Button>
        <Button variant="ghost" onClick={togglePresentation}>
          {state.presentationMode ? 'Sair do modo apresentação' : 'Modo apresentação'}
        </Button>
        <Button variant="primary" onClick={startDemo} disabled={state.demoRunning}>
          ▶ Iniciar demonstração
        </Button>
      </div>
    </header>
  );
}
