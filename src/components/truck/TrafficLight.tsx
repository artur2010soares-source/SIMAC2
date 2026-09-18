import type { AlertLevel } from '../../types';
import './TrafficLight.css';

export function TrafficLight({ level }: { level: AlertLevel }) {
  const greenOn = level === 'normal';
  const amberOn = level === 'atencao';
  const redOn = level === 'critico';

  return (
    <div className="traffic-light" aria-hidden>
      <div className="traffic-light__box">
        <span className={`traffic-light__lamp traffic-light__lamp--green ${greenOn ? 'is-on' : ''}`} />
        <span className={`traffic-light__lamp traffic-light__lamp--amber ${amberOn ? 'is-on' : ''}`} />
        <span className={`traffic-light__lamp traffic-light__lamp--red ${redOn ? 'is-on' : ''}`} />
      </div>
      <div className="traffic-light__pole" />
    </div>
  );
}
