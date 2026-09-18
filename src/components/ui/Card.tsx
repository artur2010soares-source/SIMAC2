import type { ReactNode } from 'react';
import './Card.css';

interface CardProps {
  title?: string;
  eyebrow?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  accent?: 'cyan' | 'green' | 'amber' | 'red' | 'none';
}

export function Card({ title, eyebrow, right, children, className, accent = 'none' }: CardProps) {
  return (
    <section className={`card card--${accent} ${className ?? ''}`}>
      {(title || right) && (
        <header className="card__header">
          <div>
            {eyebrow && <p className="card__eyebrow">{eyebrow}</p>}
            {title && <h3 className="card__title">{title}</h3>}
          </div>
          {right && <div className="card__right">{right}</div>}
        </header>
      )}
      <div className="card__body">{children}</div>
    </section>
  );
}

interface StatProps {
  label: string;
  value: ReactNode;
  unit?: string;
  tone?: 'cyan' | 'green' | 'amber' | 'red' | 'default';
}

export function Stat({ label, value, unit, tone = 'default' }: StatProps) {
  return (
    <div className="stat">
      <p className="stat__label">{label}</p>
      <p className={`stat__value stat__value--${tone} mono`}>
        {value}
        {unit && <span className="stat__unit">{unit}</span>}
      </p>
    </div>
  );
}
