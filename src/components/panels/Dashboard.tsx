import { Card, Stat } from '../ui/Card';
import { useSimulation } from '../../context/SimulationContext';
import { useMetrics } from '../../hooks/useMetrics';
import { formatKg } from '../../utils/calculations';
import './Dashboard.css';

export function Dashboard() {
  const { state } = useSimulation();
  const metrics = useMetrics();

  const impactTone = metrics.impactLabel === 'BAIXO' ? 'green' : metrics.impactLabel === 'MODERADO' ? 'amber' : 'red';

  return (
    <div className="dashboard-grid">
      <Card className="dashboard-card"><Stat label="Peso total" value={formatKg(metrics.totalWeightKg)} tone="cyan" /></Card>
      <Card className="dashboard-card">
        <Stat
          label="Distribuição (eixo dianteiro)"
          value={`${metrics.frontPct}%`}
          tone={metrics.unbalanced ? 'amber' : 'green'}
        />
      </Card>
      <Card className="dashboard-card">
        <Stat
          label="Temperatura"
          value={state.cabin.temperatureC.toFixed(1)}
          unit="°C"
          tone={metrics.cabinLevel === 'normal' ? 'green' : metrics.cabinLevel === 'atencao' ? 'amber' : 'red'}
        />
      </Card>
      <Card className="dashboard-card">
        <Stat label="Umidade" value={state.cabin.humidityPct} unit="%" />
      </Card>
      <Card className="dashboard-card">
        <Stat
          label="CO"
          value={state.cabin.coPpm}
          unit=" ppm"
          tone={metrics.cabinLevel === 'critico' ? 'red' : metrics.cabinLevel === 'atencao' ? 'amber' : 'default'}
        />
      </Card>
      <Card className="dashboard-card">
        <Stat
          label="Eficiência"
          value={`${metrics.efficiencyPct}%`}
          tone={metrics.efficiencyPct > 75 ? 'green' : metrics.efficiencyPct > 45 ? 'amber' : 'red'}
        />
      </Card>
      <Card className="dashboard-card">
        <Stat label="Consumo estimado" value={metrics.consumption.toFixed(1).replace('.', ',')} unit=" L/100km" tone="cyan" />
      </Card>
      <Card className="dashboard-card">
        <Stat label="Impacto ambiental" value={metrics.impactLabel} tone={impactTone} />
      </Card>
    </div>
  );
}
