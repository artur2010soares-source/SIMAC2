import type { CargoItem, HistoryEntry, SensorMeta } from '../types';

export const initialCargoItems: CargoItem[] = [
  { id: 'c1', name: 'Paletes de embalagens', weightKg: 2200, position: 'centro', lateralOffset: 0.05 },
  { id: 'c2', name: 'Caixas de mercadorias', weightKg: 1450, position: 'traseira', lateralOffset: -0.1 },
  { id: 'c3', name: 'Equipamentos industriais', weightKg: 800, position: 'dianteira', lateralOffset: 0.0 },
];

export const initialCabinReadings = {
  temperatureC: 28.5,
  humidityPct: 54,
  coPpm: 12,
};

// Coordenadas em metros, calibradas a partir da geometria real do novo
// modelo (cabine ~z=-0.7 a 1, chassi nu — a carroceria é construída em
// código em TruckModel.tsx, de z=1.15 a 5.85).
export const sensorPoints: SensorMeta[] = [
  {
    id: 'load-cell-1',
    label: 'Célula de carga 01',
    description: 'Monitoramento de peso — eixo dianteiro esquerdo',
    position: [-0.85, 0.16, 1.3],
    kind: 'carga',
  },
  {
    id: 'load-cell-2',
    label: 'Célula de carga 02',
    description: 'Monitoramento de peso — eixo dianteiro direito',
    position: [0.85, 0.16, 1.3],
    kind: 'carga',
  },
  {
    id: 'load-cell-3',
    label: 'Célula de carga 03',
    description: 'Monitoramento de peso — eixo traseiro esquerdo',
    position: [-0.85, 0.16, 5.7],
    kind: 'carga',
  },
  {
    id: 'load-cell-4',
    label: 'Célula de carga 04',
    description: 'Monitoramento de peso — eixo traseiro direito',
    position: [0.85, 0.16, 5.7],
    kind: 'carga',
  },
  {
    id: 'sensor-temp-umid',
    label: 'Sensor de temperatura e umidade',
    description: 'Condições ambientais internas da cabine',
    position: [0.32, 2.35, -0.1],
    kind: 'cabine',
  },
  {
    id: 'sensor-co',
    label: 'Sensor de monóxido de carbono (CO)',
    description: 'Concentração de CO no ar da cabine',
    position: [-0.32, 2.35, -0.1],
    kind: 'cabine',
  },
];

export const seedHistory: HistoryEntry[] = [
  {
    id: 'h1',
    code: 'SIMULAÇÃO 001',
    label: 'Carga equilibrada',
    status: 'normal',
    timestamp: '12/08/2026 — 09:14',
    totalWeightKg: 11800,
    efficiencyPct: 93,
  },
  {
    id: 'h2',
    code: 'SIMULAÇÃO 002',
    label: 'Carga desbalanceada',
    status: 'atencao',
    timestamp: '12/08/2026 — 10:02',
    totalWeightKg: 13200,
    efficiencyPct: 71,
  },
  {
    id: 'h3',
    code: 'SIMULAÇÃO 003',
    label: 'Sobrecarga',
    status: 'critico',
    timestamp: '12/08/2026 — 10:41',
    totalWeightKg: 23500,
    efficiencyPct: 44,
  },
];
