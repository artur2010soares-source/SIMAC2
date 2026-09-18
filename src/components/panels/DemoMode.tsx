import { useSimulation } from '../../context/SimulationContext';
import { useDemoRunner, DEMO_SEQUENCE, DEMO_STEP_INFO } from '../../hooks/useDemoRunner';
import './DemoMode.css';

export function DemoMode() {
  useDemoRunner();
  const { state, setDemoRunning, setDemoStep } = useSimulation();

  if (!state.demoRunning) return null;

  const idx = Math.max(0, DEMO_SEQUENCE.indexOf(state.demoStep));
  const info = DEMO_STEP_INFO[state.demoStep];

  const stop = () => {
    setDemoRunning(false);
    setDemoStep('idle');
  };

  return (
    <div className="demo-mode">
      <div className="demo-mode__bar">
        {DEMO_SEQUENCE.map((step, i) => (
          <span key={step} className={`demo-mode__step ${i <= idx ? 'is-done' : ''}`} />
        ))}
      </div>
      <div className="demo-mode__content">
        <div>
          <p className="demo-mode__count mono">
            {idx + 1} / {DEMO_SEQUENCE.length}
          </p>
          <p className="demo-mode__title">{info.title}</p>
          <p className="demo-mode__desc">{info.description}</p>
        </div>
        <button className="demo-mode__stop" onClick={stop}>
          Encerrar demonstração
        </button>
      </div>
    </div>
  );
}
