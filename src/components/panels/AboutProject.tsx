import { Card } from '../ui/Card';
import { TeamSponsorsSection } from './TeamSponsorsSection';
import './AboutProject.css';

export function AboutProject() {
  return (
    <div className="about">
      <Card eyebrow="Projeto" title="Sobre o SIMAC²">
        <p>
          O <strong>SIMAC²</strong> — Sistema Inteligente para Monitoramento Ambiental de Cabine e Carga — é um
          projeto que propõe monitorar, em tempo real, as condições da cabine (monóxido de carbono, temperatura e
          umidade) e da carga transportada (peso, distribuição, centro de gravidade e desbalanceamento) em veículos
          de transporte de carga.
        </p>
        <p>
          O protótipo físico atual é uma <strong>maquete visual</strong>, sem sensores em funcionamento. Este site é
          o <strong>gêmeo digital</strong> do projeto: uma simulação interativa que demonstra, de forma prática, como
          o sistema se comportaria em um caminhão real equipado com os sensores planejados.
        </p>
      </Card>

      <TeamSponsorsSection />

      <Card eyebrow="Arquitetura de hardware" title="Componentes previstos">
        <ul className="about__list">
          <li>Microcontrolador ESP32 / Arduino — leitura dos sensores e lógica de alerta</li>
          <li>Células de carga + módulo HX711 — medição de peso em 4 pontos da carroceria</li>
          <li>Sensor de temperatura e umidade — condições ambientais da cabine</li>
          <li>Sensor de monóxido de carbono (CO) — qualidade do ar na cabine</li>
          <li>Display — exibição local das leituras</li>
          <li>LEDs — sinalização visual de status</li>
          <li>Buzzer — alerta sonoro em condições críticas</li>
        </ul>
      </Card>

      <Card eyebrow="Transparência" title="O que é real e o que é simulado">
        <ul className="about__list">
          <li>✅ A arquitetura de hardware e a lógica de análise descrevem o projeto real proposto.</li>
          <li>✅ O modelo 3D representa visualmente a estrutura de um caminhão/carreta e os pontos de sensores.</li>
          <li>⚠️ Os valores de peso, temperatura, umidade e CO exibidos são <strong>gerados no navegador</strong>, sem hardware conectado.</li>
          <li>⚠️ Consumo e impacto ambiental são <strong>estimativas experimentais</strong> de um modelo simplificado.</li>
          <li>⚠️ O protótipo físico existente é uma maquete estática, sem sensores instalados.</li>
        </ul>
      </Card>

      <Card eyebrow="Créditos" title="Modelos 3D utilizados">
        <ul className="about__list">
          <li>
            Caminhão — <em>Delivery Volkswagen 9.150</em>, por lael.eugenio (Sketchfab), licença{' '}
            <strong>CC BY 4.0</strong> — requer atribuição ao autor.
          </li>
          <li>
            Caixa de madeira — por TuszPro (Sketchfab), licença <strong>CC BY-NC-SA 4.0</strong> — requer
            atribuição, é de uso <strong>não comercial</strong> e exige compartilhamento pela mesma licença.
          </li>
        </ul>
        <p className="about__note">
          O modelo original do caminhão é só cabine + chassi (sem carroceria). A plataforma de carga visível na
          simulação é construída neste projeto e a casca do baú é exibida semi-transparente para que a carga e os
          sensores continuem visíveis. Ambos os modelos foram otimizados (redução de polígonos e compressão) para
          uso neste site. Se este projeto vier a ter uso comercial, substitua a caixa de madeira por um modelo com
          licença compatível.
        </p>
      </Card>
    </div>
  );
}
