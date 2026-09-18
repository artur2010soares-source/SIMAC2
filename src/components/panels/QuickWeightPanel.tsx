import { useSimulation } from '../../context/SimulationContext';
import './QuickWeightPanel.css';

const ADD_PRESETS = [500, 1000, 1500, 2000, 2500, 3000];
const REMOVE_PRESETS = [500, 1000, 1500];

export function QuickWeightPanel() {
  const { adjustQuickCargo } = useSimulation();

  return (
    <div className="quick-weight-panel">
      <div className="quick-weight-card">
        <div className="quick-weight-card__header">
          <span className="quick-weight-card__icon">➕</span>
          <div>
            <p className="quick-weight-card__title">Adicionar carga</p>
            <p className="quick-weight-card__subtitle">Selecione o peso que deseja adicionar ao caminhão:</p>
          </div>
        </div>
        <div className="quick-weight-card__grid">
          {ADD_PRESETS.map((kg) => (
            <button key={kg} className="quick-weight-btn" onClick={() => adjustQuickCargo(kg)}>
              {kg.toLocaleString('pt-BR')} kg
            </button>
          ))}
        </div>
        <p className="quick-weight-card__hint">
          <span aria-hidden>👆</span> Clique em um peso para adicionar à carga.
        </p>
      </div>

      <div className="quick-weight-card">
        <div className="quick-weight-card__header">
          <span className="quick-weight-card__icon quick-weight-card__icon--remove">🗑</span>
          <div>
            <p className="quick-weight-card__title">Remover carga</p>
            <p className="quick-weight-card__subtitle">Retire parte da carga para ver a atualização.</p>
          </div>
        </div>
        <div className="quick-weight-card__grid quick-weight-card__grid--remove">
          {REMOVE_PRESETS.map((kg) => (
            <button
              key={kg}
              className="quick-weight-btn quick-weight-btn--remove"
              onClick={() => adjustQuickCargo(-kg)}
            >
              − {kg.toLocaleString('pt-BR')} kg
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
