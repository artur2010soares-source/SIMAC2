export type CargoPosition = 'dianteira' | 'centro' | 'traseira';

export interface CargoItem {
  id: string;
  name: string;
  weightKg: number;
  position: CargoPosition;
  // lateral offset in meters, -1 (esquerda) .. 1 (direita), used for balance visuals
  lateralOffset: number;
}

export type AlertLevel = 'normal' | 'atencao' | 'critico';

export interface CabinReadings {
  temperatureC: number;
  humidityPct: number;
  coPpm: number;
}

export interface AxleLoad {
  frontKg: number;
  rearKg: number;
}

export type ViewPreset = 'orbit' | 'frontal' | 'lateral' | 'superior';

export type AppScreen =
  | 'visao-geral'
  | 'cabine'
  | 'sustentabilidade'
  | 'historico'
  | 'sobre';

export interface HistoryEntry {
  id: string;
  code: string;
  label: string;
  status: AlertLevel;
  timestamp: string;
  totalWeightKg: number;
  efficiencyPct: number;
}

export interface SensorMeta {
  id: string;
  label: string;
  description: string;
  position: [number, number, number];
  kind: 'carga' | 'cabine';
}

export type DemoStep =
  | 'idle'
  | 'sistema-normal'
  | 'adicionar-carga'
  | 'desbalanceamento'
  | 'deteccao'
  | 'temperatura'
  | 'co'
  | 'alerta'
  | 'resultado';
