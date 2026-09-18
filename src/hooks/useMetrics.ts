import { useMemo } from 'react';
import { useSimulation } from '../context/SimulationContext';
import {
  alertLabel,
  balanceDeviation,
  cabinAlertLevel,
  cargoAlertLevel,
  combinedAlertLevel,
  computeAxleLoad,
  computeEfficiency,
  environmentalImpactLabel,
  estimateConsumption,
  estimateEmissions,
  isOverloaded,
  isUnbalanced,
  lateralImbalance,
  MAX_CARGO_ONLY_KG,
  totalCargoWeight,
  totalGrossWeight,
} from '../utils/calculations';

export function useMetrics() {
  const { state } = useSimulation();
  const { cargoItems, cabin } = state;

  return useMemo(() => {
    const axle = computeAxleLoad(cargoItems);
    const totalWeightKg = totalGrossWeight(cargoItems);
    const cargoOnlyKg = totalCargoWeight(cargoItems);
    const cargoOnlyPct = Math.min(100, Math.round((cargoOnlyKg / MAX_CARGO_ONLY_KG) * 100));
    const deviation = balanceDeviation(axle);
    const lateral = lateralImbalance(cargoItems);
    const overloaded = isOverloaded(cargoItems);
    const unbalanced = isUnbalanced(cargoItems);
    const efficiencyPct = computeEfficiency(cargoItems);
    const consumption = estimateConsumption(cargoItems, efficiencyPct);
    const emissions = estimateEmissions(consumption);
    const impactLabel = environmentalImpactLabel(emissions);

    const cargoLevel = cargoAlertLevel(cargoItems);
    const cabinLevel = cabinAlertLevel(cabin);
    const overallLevel = combinedAlertLevel(cargoLevel, cabinLevel);

    const frontPct = Math.min(100, Math.round((axle.frontKg / (totalWeightKg || 1)) * 100 * 2.2));
    const rearPct = Math.min(100, Math.round((axle.rearKg / (totalWeightKg || 1)) * 100 * 2.2));

    return {
      axle,
      totalWeightKg,
      cargoOnlyKg,
      cargoOnlyPct,
      deviation,
      lateral,
      overloaded,
      unbalanced,
      efficiencyPct,
      consumption,
      emissions,
      impactLabel,
      cargoLevel,
      cabinLevel,
      overallLevel,
      overallLabel: alertLabel(overallLevel),
      frontPct,
      rearPct,
    };
  }, [cargoItems, cabin]);
}
