import './StageHeader.css';

export function StageHeader() {
  return (
    <div className="stage-header">
      <span className="stage-header__icon">🚚</span>
      <div>
        <h2 className="stage-header__title">Simulação Interativa</h2>
        <p className="stage-header__subtitle">
          Adicione a carga, veja os sensores em ação e acompanhe as informações em tempo real.
        </p>
      </div>
    </div>
  );
}
