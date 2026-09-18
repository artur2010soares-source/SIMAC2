import { useSimulation } from '../../context/SimulationContext';
import { useMetrics } from '../../hooks/useMetrics';
import { sensorPoints } from '../../data/initialState';
import './SensorDetailPanel.css';

export function SensorDetailPanel() {
  const { state, setSelectedSensor } = useSimulation();
  const metrics = useMetrics();

  const sensor = sensorPoints.find((s) => s.id === state.selectedSensorId);
  if (!sensor) return null;

  let valueLabel = '';
  let valueUnit = '';

  switch (sensor.id) {
    case 'load-cell-1':
    case 'load-cell-2':
      valueLabel = Math.round(metrics.axle.frontKg / 2).toLocaleString('pt-BR');
      valueUnit = 'kg (estimado)';
      break;
    case 'load-cell-3':
    case 'load-cell-4':
      valueLabel = Math.round(metrics.axle.rearKg / 2).toLocaleString('pt-BR');
      valueUnit = 'kg (estimado)';
      break;
    case 'sensor-temp-umid':
      valueLabel = `${state.cabin.temperatureC.toFixed(1)}°C / ${state.cabin.humidityPct}%`;
      valueUnit = 'temperatura / umidade';
      break;
    case 'sensor-co':
      valueLabel = `${state.cabin.coPpm}`;
      valueUnit = 'ppm de CO';
      break;
    default:
      break;
  }

  return (
    <div className="sensor-detail">
      <button className="sensor-detail__close" onClick={() => setSelectedSensor(null)} aria-label="Fechar">
        ✕
      </button>
      <p className="sensor-detail__label">{sensor.label}</p>
      <p className="sensor-detail__desc">{sensor.description}</p>
      <p className="sensor-detail__value mono">
        {valueLabel} <span>{valueUnit}</span>
      </p>
    </div>
  );
}
