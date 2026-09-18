import type { AlertLevel } from '../../types';
import { alertLabel } from '../../utils/calculations';
import './StatusBadge.css';

const ICON: Record<AlertLevel, string> = {
  normal: '🟢',
  atencao: '🟡',
  critico: '🔴',
};

export function StatusBadge({ level }: { level: AlertLevel }) {
  return (
    <span className={`status-badge status-badge--${level}`}>
      <span aria-hidden>{ICON[level]}</span>
      {alertLabel(level)}
    </span>
  );
}
