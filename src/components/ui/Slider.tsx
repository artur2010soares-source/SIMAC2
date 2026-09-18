import './Slider.css';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  tone?: 'cyan' | 'green' | 'amber' | 'red';
}

export function Slider({ label, value, min, max, step = 1, unit = '', onChange, tone = 'cyan' }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="slider-field">
      <div className="slider-field__top">
        <span className="slider-field__label">{label}</span>
        <span className={`slider-field__value mono slider-field__value--${tone}`}>
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        className={`slider-field__input slider-field__input--${tone}`}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ ['--pct' as string]: `${pct}%` }}
        aria-label={label}
      />
    </div>
  );
}
