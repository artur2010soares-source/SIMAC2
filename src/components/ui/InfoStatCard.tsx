import type { ReactNode } from 'react';
import './InfoStatCard.css';

type Tone = 'green' | 'amber' | 'red' | 'cyan';

interface InfoStatCardProps {
  icon: ReactNode;
  iconTone?: Tone;
  label: string;
  value: ReactNode;
  unit?: string;
  topRightLabel?: string;
  topRightValue?: string;
  progressPct?: number;
  progressTone?: Tone;
  statusLabel: string;
  statusTone: Tone;
  sideNote?: { icon: ReactNode; text: string };
}

const TONE_ICON: Record<Tone, string> = {
  green: '✓',
  amber: '!',
  red: '✕',
  cyan: '✓',
};

export function InfoStatCard({
  icon,
  iconTone = 'cyan',
  label,
  value,
  unit,
  topRightLabel,
  topRightValue,
  progressPct,
  progressTone,
  statusLabel,
  statusTone,
  sideNote,
}: InfoStatCardProps) {
  return (
    <div className="info-stat-card">
      <div className="info-stat-card__main">
        <div className={`info-stat-card__icon info-stat-card__icon--${iconTone}`}>{icon}</div>
        <div className="info-stat-card__body">
          <div className="info-stat-card__top-row">
            <p className="info-stat-card__label">{label}</p>
            {topRightLabel && (
              <div className="info-stat-card__top-right">
                <span>{topRightLabel}</span>
                <strong className="mono">{topRightValue}</strong>
              </div>
            )}
          </div>
          <p className="info-stat-card__value mono">
            {value}
            {unit && <span className="info-stat-card__unit">{unit}</span>}
          </p>

          {typeof progressPct === 'number' && (
            <div className="info-stat-card__progress">
              <div
                className={`info-stat-card__progress-fill info-stat-card__progress-fill--${progressTone ?? 'green'}`}
                style={{ width: `${Math.min(100, Math.max(2, progressPct))}%` }}
              />
            </div>
          )}

          <span className={`info-stat-card__pill info-stat-card__pill--${statusTone}`}>
            <span className="info-stat-card__pill-icon">{TONE_ICON[statusTone]}</span>
            {statusLabel}
          </span>
        </div>

        {sideNote && (
          <div className="info-stat-card__side-note">
            <span className="info-stat-card__side-note-icon">{sideNote.icon}</span>
            <p>{sideNote.text}</p>
          </div>
        )}
      </div>
    </div>
  );
}
