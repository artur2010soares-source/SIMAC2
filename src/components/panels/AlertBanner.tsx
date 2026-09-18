import { useState } from 'react';
import { useMetrics } from '../../hooks/useMetrics';
import './AlertBanner.css';

const EXPLAIN: Record<string, string> = {
  normal: 'Todos os parâmetros de cabine e carga estão dentro da faixa considerada segura pela simulação.',
  atencao: 'Um ou mais parâmetros ultrapassaram os limites recomendados. O sistema recomenda verificação.',
  critico: 'Condição crítica simulada: parâmetros fora da faixa seguem, o sistema acionaria o buzzer e os LEDs de alerta em um caminhão real.',
};

export function AlertBanner() {
  const metrics = useMetrics();
  const [buzzerTest, setBuzzerTest] = useState(false);

  const level = metrics.overallLevel;

  const testBuzzer = () => {
    setBuzzerTest(true);
    setTimeout(() => setBuzzerTest(false), 1600);
  };

  return (
    <div className={`alert-banner alert-banner--${level}`}>
      <div className="alert-banner__left">
        <span className={`alert-banner__led ${level !== 'normal' ? 'is-blinking' : ''}`} />
        <div>
          <p className="alert-banner__title">{metrics.overallLabel}</p>
          <p className="alert-banner__desc">{EXPLAIN[level]}</p>
        </div>
      </div>
      <button
        className={`alert-banner__buzzer ${buzzerTest ? 'is-active' : ''}`}
        onClick={testBuzzer}
        aria-label="Testar buzzer visual"
      >
        <span>🔔</span>
        {buzzerTest ? 'BUZZER ATIVO' : 'Testar buzzer'}
      </button>
    </div>
  );
}
