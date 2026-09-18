import './SiteFooter.css';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__props">
        <div className="site-footer__prop">
          <span className="site-footer__prop-icon">🛡</span>
          <p>
            Mais segurança
            <br />
            no transporte
          </p>
        </div>
        <div className="site-footer__prop">
          <span className="site-footer__prop-icon">🍃</span>
          <p>
            Menos impacto
            <br />
            ambiental
          </p>
        </div>
        <div className="site-footer__prop">
          <span className="site-footer__prop-icon">⚙</span>
          <p>
            Tecnologia acessível
            <br />e aplicável à realidade de Teresina – PI
          </p>
        </div>
      </div>

      <div className="site-footer__brand">
        <span className="site-footer__brand-mark">SC²</span>
        <div>
          <p className="site-footer__brand-title">
            SIMAC<sup>2</sup>
          </p>
          <p className="site-footer__brand-tagline">Juntos por um transporte mais seguro e sustentável.</p>
        </div>
      </div>
    </footer>
  );
}
