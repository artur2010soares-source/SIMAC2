import type { AlertLevel, AxleLoad, CabinReadings, CargoItem } from '../types';

// ---- Constantes de referência (valores experimentais / didáticos) ----
export const TARE_WEIGHT_KG = 8000; // peso vazio do conjunto trator + carreta (referência)
export const MAX_GROSS_WEIGHT_KG = 22000; // limite legal de referência (PBTC simplificado)
export const MAX_CARGO_ONLY_KG = MAX_GROSS_WEIGHT_KG - TARE_WEIGHT_KG; // limite só da carga (sem o peso vazio)
export const IDEAL_FRONT_SHARE = 0.32; // ~32% do peso total no eixo dianteiro é considerado equilibrado

const POSITION_FRONT_BIAS: Record<CargoItem['position'], number> = {
  dianteira: 0.78,
  centro: 0.5,
  traseira: 0.22,
};

/** Distribui o peso de cada item de carga entre eixo dianteiro e traseiro. */
export function computeAxleLoad(cargoItems: CargoItem[]): AxleLoad {
  let front = TARE_WEIGHT_KG * 0.42;
  let rear = TARE_WEIGHT_KG * 0.58;

  for (const item of cargoItems) {
    const frontShare = POSITION_FRONT_BIAS[item.position];
    front += item.weightKg * frontShare;
    rear += item.weightKg * (1 - frontShare);
  }

  return { frontKg: Math.round(front), rearKg: Math.round(rear) };
}

export function totalCargoWeight(cargoItems: CargoItem[]): number {
  return cargoItems.reduce((sum, item) => sum + item.weightKg, 0);
}

export function totalGrossWeight(cargoItems: CargoItem[]): number {
  return TARE_WEIGHT_KG + totalCargoWeight(cargoItems);
}

/** Retorna o desvio percentual em relação à distribuição ideal (0 = perfeito). */
export function balanceDeviation(axle: AxleLoad): number {
  const total = axle.frontKg + axle.rearKg;
  if (total === 0) return 0;
  const frontShare = axle.frontKg / total;
  return Math.abs(frontShare - IDEAL_FRONT_SHARE);
}

export function isOverloaded(cargoItems: CargoItem[]): boolean {
  return totalGrossWeight(cargoItems) > MAX_GROSS_WEIGHT_KG;
}

export function isUnbalanced(cargoItems: CargoItem[]): boolean {
  const axle = computeAxleLoad(cargoItems);
  const longitudinalOff = balanceDeviation(axle) > 0.12;
  const lateralOff = Math.abs(lateralImbalance(cargoItems)) > 0.35;
  return longitudinalOff || lateralOff;
}

/** Também detecta desequilíbrio lateral (esquerda/direita) baseado no offset de cada item. */
export function lateralImbalance(cargoItems: CargoItem[]): number {
  const total = totalCargoWeight(cargoItems);
  if (total === 0) return 0;
  const weighted = cargoItems.reduce((sum, item) => sum + item.weightKg * item.lateralOffset, 0);
  return weighted / total; // -1..1
}

/** Eficiência estimada (0-100), penalizada por desbalanceamento e sobrecarga. */
export function computeEfficiency(cargoItems: CargoItem[]): number {
  const gross = totalGrossWeight(cargoItems);
  const axle = computeAxleLoad(cargoItems);
  const deviation = balanceDeviation(axle);
  const lateral = Math.abs(lateralImbalance(cargoItems));

  let efficiency = 96;
  efficiency -= deviation * 160; // penaliza desbalanceamento longitudinal
  efficiency -= lateral * 40; // penaliza desbalanceamento lateral

  if (gross > MAX_GROSS_WEIGHT_KG) {
    const excessPct = (gross - MAX_GROSS_WEIGHT_KG) / MAX_GROSS_WEIGHT_KG;
    efficiency -= 25 + excessPct * 100;
  }

  return Math.max(8, Math.min(97, Math.round(efficiency)));
}

/** Estimativa experimental de consumo (L/100km). Não representa dados reais de um veículo. */
export function estimateConsumption(cargoItems: CargoItem[], efficiencyPct: number): number {
  const gross = totalGrossWeight(cargoItems);
  const base = 24; // consumo base estimado do conjunto vazio, L/100km
  const loadFactor = (gross / 1000) * 0.62; // cada tonelada adiciona consumo estimado
  const inefficiencyPenalty = (100 - efficiencyPct) * 0.09;
  return Math.round((base + loadFactor + inefficiencyPenalty) * 10) / 10;
}

/** Estimativa experimental de emissão de CO2 (kg CO2 / 100km) a partir do consumo. */
export function estimateEmissions(consumptionL100km: number): number {
  const dieselEmissionFactorKgPerLiter = 2.68; // fator de referência para diesel rodoviário
  return Math.round(consumptionL100km * dieselEmissionFactorKgPerLiter * 10) / 10;
}

export function environmentalImpactLabel(emissionsKgPer100km: number): 'BAIXO' | 'MODERADO' | 'ALTO' {
  if (emissionsKgPer100km < 75) return 'BAIXO';
  if (emissionsKgPer100km < 100) return 'MODERADO';
  return 'ALTO';
}

// ---- Cabine ----
export function cabinAlertLevel(readings: CabinReadings): AlertLevel {
  const { temperatureC, humidityPct, coPpm } = readings;

  if (coPpm >= 35 || temperatureC >= 40 || humidityPct >= 85 || humidityPct <= 15) {
    return 'critico';
  }
  if (coPpm >= 15 || temperatureC >= 34 || humidityPct >= 70 || humidityPct <= 25) {
    return 'atencao';
  }
  return 'normal';
}

export function cargoAlertLevel(cargoItems: CargoItem[]): AlertLevel {
  const overloaded = isOverloaded(cargoItems);
  const unbalanced = isUnbalanced(cargoItems);
  const gross = totalGrossWeight(cargoItems);

  if (overloaded && gross > MAX_GROSS_WEIGHT_KG * 1.08) return 'critico';
  if (overloaded || (unbalanced && balanceDeviation(computeAxleLoad(cargoItems)) > 0.2)) return 'atencao';
  if (unbalanced) return 'atencao';
  return 'normal';
}

export function combinedAlertLevel(a: AlertLevel, b: AlertLevel): AlertLevel {
  const rank: Record<AlertLevel, number> = { normal: 0, atencao: 1, critico: 2 };
  return rank[a] >= rank[b] ? a : b;
}

export function alertLabel(level: AlertLevel): string {
  switch (level) {
    case 'normal':
      return 'CONDIÇÃO ADEQUADA';
    case 'atencao':
      return 'ATENÇÃO';
    case 'critico':
      return 'ALERTA CRÍTICO';
  }
}

export function formatKg(value: number): string {
  return `${value.toLocaleString('pt-BR')} kg`;
}
