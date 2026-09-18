import { Card, Stat } from '../ui/Card';
import { Slider } from '../ui/Slider';
import { StatusBadge } from '../layout/StatusBadge';
import { useSimulation } from '../../context/SimulationContext';
import { useMetrics } from '../../hooks/useMetrics';
import './CabinMonitoringPanel.css';

export function CabinMonitoringPanel() {
  const { state, setCabin } = useSimulation();
  const metrics = useMetrics();
  const { cabin } = state;

  const tone = (level: typeof metrics.cabinLevel) => (level === 'critico' ? 'red' : level === 'atencao' ? 'amber' : 'green');

  return (
    <Card
      eyebrow="Cabine"
      title="Monitoramento da cabine"
      accent={metrics.cabinLevel === 'critico' ? 'red' : metrics.cabinLevel === 'atencao' ? 'amber' : 'green'}
      right={<StatusBadge level={metrics.cabinLevel} />}
    >
      <div className="cabin-panel__stats">
        <Stat label="Temperatura" value={cabin.temperatureC.toFixed(1)} unit="°C" tone={tone(metrics.cabinLevel)} />
        <Stat label="Umidade" value={cabin.humidityPct} unit="%" tone={tone(metrics.cabinLevel)} />
        <Stat label="CO" value={cabin.coPpm} unit=" ppm" tone={tone(metrics.cabinLevel)} />
      </div>

      <div className="cabin-panel__sliders">
        <Slider
          label="Temperatura"
          min={10}
          max={48}
          step={0.5}
          unit="°C"
          value={cabin.temperatureC}
          onChange={(v) => setCabin({ temperatureC: v })}
          tone={cabin.temperatureC >= 40 ? 'red' : cabin.temperatureC >= 34 ? 'amber' : 'cyan'}
        />
        <Slider
          label="Umidade"
          min={5}
          max={95}
          step={1}
          unit="%"
          value={cabin.humidityPct}
          onChange={(v) => setCabin({ humidityPct: v })}
          tone={cabin.humidityPct >= 85 || cabin.humidityPct <= 15 ? 'red' : cabin.humidityPct >= 70 || cabin.humidityPct <= 25 ? 'amber' : 'cyan'}
        />
        <Slider
          label="Monóxido de carbono (CO)"
          min={0}
          max={60}
          step={1}
          unit=" ppm"
          value={cabin.coPpm}
          onChange={(v) => setCabin({ coPpm: v })}
          tone={cabin.coPpm >= 35 ? 'red' : cabin.coPpm >= 15 ? 'amber' : 'cyan'}
        />
      </div>

      {metrics.cabinLevel !== 'normal' && (
        <p className={`cabin-panel__explainer cabin-panel__explainer--${metrics.cabinLevel}`}>
          {metrics.cabinLevel === 'critico'
            ? 'Níveis fora da faixa segura. Em um sistema real, o SIMAC² acionaria o buzzer e recomendaria parada e ventilação da cabine.'
            : 'Leituras se aproximando dos limites recomendados. O sistema recomenda atenção ao motorista.'}
        </p>
      )}
    </Card>
  );
}
