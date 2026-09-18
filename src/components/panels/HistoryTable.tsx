import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../layout/StatusBadge';
import { useSimulation } from '../../context/SimulationContext';
import { useMetrics } from '../../hooks/useMetrics';
import { formatKg } from '../../utils/calculations';
import './HistoryTable.css';

export function HistoryTable() {
  const { state, addHistory } = useSimulation();
  const metrics = useMetrics();

  const logCurrentState = () => {
    addHistory({
      id: `manual-${Date.now()}`,
      code: `SIMULAÇÃO ${String(state.history.length + 1).padStart(3, '0')}`,
      label: metrics.overloaded ? 'Sobrecarga' : metrics.unbalanced ? 'Carga desbalanceada' : 'Carga equilibrada',
      status: metrics.overallLevel,
      timestamp: new Date().toLocaleString('pt-BR'),
      totalWeightKg: metrics.totalWeightKg,
      efficiencyPct: metrics.efficiencyPct,
    });
  };

  return (
    <Card
      eyebrow="Registros"
      title="Histórico de simulações"
      right={
        <Button variant="ghost" onClick={logCurrentState}>
          Registrar estado atual
        </Button>
      }
    >
      <div className="history-table">
        <div className="history-table__head">
          <span>Simulação</span>
          <span>Peso total</span>
          <span>Eficiência</span>
          <span>Status</span>
          <span>Data</span>
        </div>
        {state.history.map((entry) => (
          <div className="history-table__row" key={entry.id}>
            <div>
              <p className="history-table__code">{entry.code}</p>
              <p className="history-table__label">{entry.label}</p>
            </div>
            <span className="mono">{formatKg(entry.totalWeightKg)}</span>
            <span className="mono">{entry.efficiencyPct}%</span>
            <StatusBadge level={entry.status} />
            <span className="history-table__date mono">{entry.timestamp}</span>
          </div>
        ))}
      </div>
      <p className="history-table__note">Os registros ficam salvos apenas neste navegador, nesta sessão.</p>
    </Card>
  );
}
