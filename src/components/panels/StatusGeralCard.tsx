import { useMetrics } from '../../hooks/useMetrics';
import './StatusGeralCard.css';

const CONTENT: Record<string, { title: string; icon: string }> = {
  normal: { title: 'Tudo certo!', icon: '✓' },
  atencao: { title: 'Fique de olho', icon: '!' },
  critico: { title: 'Atenção necessária', icon: '✕' },
};

const DESCRIPTION: Record<string, string> = {
  normal: 'A carga está dentro do limite e os parâmetros ambientais estão adequados.',
  atencao: 'Algum parâmetro se aproximou do limite recomendado. Vale verificar antes de seguir viagem.',
  critico: 'Carga ou cabine fora da faixa segura simulada. Em um sistema real, o SIMAC² acionaria o alerta sonoro.',
};

export function StatusGeralCard() {
  const metrics = useMetrics();
  const level = metrics.overallLevel;
  const content = CONTENT[level];

  return (
    <div className="status-geral-card">
      <div className="status-geral-card__header">
        <span className="status-geral-card__shield">🛡</span>
        <p>Status geral</p>
      </div>
      <div className={`status-geral-card__banner status-geral-card__banner--${level}`}>
        <span className="status-geral-card__banner-icon">{content.icon}</span>
        <div>
          <p className="status-geral-card__banner-title">{content.title}</p>
          <p className="status-geral-card__banner-desc">{DESCRIPTION[level]}</p>
        </div>
      </div>
    </div>
  );
}
