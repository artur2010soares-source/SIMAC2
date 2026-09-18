import './ProjectIntro.css';

export function ProjectIntro() {
  return (
    <section className="project-intro">
      <span className="project-intro__badge">Mostra Científica SESI/FIEPI · Eixo temático: Automação</span>
      <h1 className="project-intro__title">
        O que é o SIMAC<sup>2</sup>?
      </h1>
      <p className="project-intro__text">
        O transporte rodoviário de cargas expõe motoristas a longas jornadas dentro da cabine, onde ventilação
        inadequada, temperaturas extremas e acúmulo de gases tóxicos como o CO colocam a saúde e a segurança em
        risco. Ao mesmo tempo, o excesso e a má distribuição de peso na carroceria aumentam o consumo de
        combustível, desgastam o veículo e elevam a emissão de poluentes. O <strong>SIMAC²</strong> —{' '}
        <strong>Sistema Inteligente para Monitoramento Ambiental de Cabine e Carga</strong> — propõe resolver isso
        com sensores de baixo custo (ESP32, células de carga, sensores de CO, temperatura e umidade) que monitoram
        essas condições em tempo real e disparam alertas antes que virem um problema.
      </p>
      <p className="project-intro__text">
        Como o protótipo físico ainda é uma maquete sem sensores instalados, construímos este{' '}
        <strong>gêmeo digital</strong>: uma simulação 3D interativa que reproduz o funcionamento do sistema.
        Adicione carga, desequilibre o peso, altere a temperatura e o CO da cabine logo abaixo e veja o SIMAC²
        reagir como reagiria em um caminhão real.
      </p>
    </section>
  );
}
