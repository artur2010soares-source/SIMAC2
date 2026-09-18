import { Card } from '../ui/Card';
import './SystemFlow.css';

const STAGES = ['SENSORES', 'ESP32', 'PROCESSAMENTO', 'ANÁLISE', 'ALERTA', 'REGISTRO'];

export function SystemFlow() {
  return (
    <Card eyebrow="Arquitetura" title="Fluxo de dados do sistema">
      <div className="system-flow">
        {STAGES.map((stage, i) => (
          <div className="system-flow__segment" key={stage}>
            <div className="system-flow__node">
              <span className="mono">{i + 1}</span>
              <p>{stage}</p>
            </div>
            {i < STAGES.length - 1 && (
              <div className="system-flow__line">
                <span className="system-flow__dot" style={{ animationDelay: `${i * 0.35}s` }} />
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="system-flow__caption">
        Leituras simuladas de sensores percorrem o mesmo fluxo lógico previsto para o ESP32 real: aquisição,
        processamento, análise de regras, geração de alertas e registro histórico.
      </p>
    </Card>
  );
}
