import { useMemo } from 'react';
import { Card, Stat } from '../ui/Card';
import { useSimulation } from '../../context/SimulationContext';
import { useMetrics } from '../../hooks/useMetrics';
import {
  computeEfficiency,
  environmentalImpactLabel,
  estimateConsumption,
  estimateEmissions,
  totalGrossWeight,
} from '../../utils/calculations';
import './SustainabilitySection.css';

export function SustainabilitySection() {
  const { state } = useSimulation();
  const metrics = useMetrics();

  const balancedScenario = useMemo(() => {
    const hypothetical = state.cargoItems.map((item) => ({
      ...item,
      position: 'centro' as const,
      lateralOffset: 0,
    }));
    const efficiency = computeEfficiency(hypothetical);
    const consumption = estimateConsumption(hypothetical, efficiency);
    const emissions = estimateEmissions(consumption);
    return { efficiency, consumption, emissions, weight: totalGrossWeight(hypothetical) };
  }, [state.cargoItems]);

  const currentScenario = {
    efficiency: metrics.efficiencyPct,
    consumption: metrics.consumption,
    emissions: metrics.emissions,
    weight: metrics.totalWeightKg,
  };

  const maxConsumption = Math.max(balancedScenario.consumption, currentScenario.consumption, 1);

  return (
    <div className="sustainability">
      <Card eyebrow="Estimativa experimental" title="Do peso simulado ao impacto estimado">
        <div className="sustainability__flow">
          <div className="sustainability__flow-item">
            <p className="sustainability__flow-label">Carga atual</p>
            <p className="mono sustainability__flow-value">{metrics.totalWeightKg.toLocaleString('pt-BR')} kg</p>
          </div>
          <span className="sustainability__arrow">↓</span>
          <div className="sustainability__flow-item">
            <p className="sustainability__flow-label">Eficiência estimada</p>
            <p className="mono sustainability__flow-value">{metrics.efficiencyPct}%</p>
          </div>
          <span className="sustainability__arrow">↓</span>
          <div className="sustainability__flow-item">
            <p className="sustainability__flow-label">Consumo estimado</p>
            <p className="mono sustainability__flow-value">{metrics.consumption.toFixed(1)} L/100km</p>
          </div>
          <span className="sustainability__arrow">↓</span>
          <div className="sustainability__flow-item">
            <p className="sustainability__flow-label">Emissão estimada de CO₂</p>
            <p className="mono sustainability__flow-value">{metrics.emissions.toFixed(1)} kg/100km</p>
          </div>
        </div>

        <p className="sustainability__disclaimer">
          <strong>Importante:</strong> consumo e emissão são <strong>estimativas experimentais</strong> geradas por um
          modelo simplificado desta simulação — não correspondem a medições reais de um caminhão em operação.
        </p>
      </Card>

      <Card eyebrow="Comparativo" title="Carga equilibrada × carga desbalanceada">
        <div className="compare-chart">
          <div className="compare-chart__col">
            <div className="compare-chart__bar-wrap">
              <div
                className="compare-chart__bar compare-chart__bar--balanced"
                style={{ height: `${(balancedScenario.consumption / maxConsumption) * 100}%` }}
              />
            </div>
            <p className="compare-chart__title">Equilibrada (hipotética)</p>
            <p className="mono compare-chart__value">{balancedScenario.consumption.toFixed(1)} L/100km</p>
            <p className="compare-chart__meta">Eficiência {balancedScenario.efficiency}% · {environmentalImpactLabel(balancedScenario.emissions)}</p>
          </div>
          <div className="compare-chart__col">
            <div className="compare-chart__bar-wrap">
              <div
                className={`compare-chart__bar ${metrics.unbalanced || metrics.overloaded ? 'compare-chart__bar--warn' : 'compare-chart__bar--balanced'}`}
                style={{ height: `${(currentScenario.consumption / maxConsumption) * 100}%` }}
              />
            </div>
            <p className="compare-chart__title">Cenário atual</p>
            <p className="mono compare-chart__value">{currentScenario.consumption.toFixed(1)} L/100km</p>
            <p className="compare-chart__meta">
              Eficiência {currentScenario.efficiency}% · {environmentalImpactLabel(currentScenario.emissions)}
            </p>
          </div>
        </div>
        <p className="compare-chart__footnote">
          O comparativo redistribui a mesma carga atual de forma central e equilibrada para ilustrar, de forma
          experimental, como o balanceamento influencia a eficiência estimada.
        </p>
      </Card>

      <div className="sustainability__stats">
        <Card>
          <Stat label="Diferença de consumo" value={`${Math.abs(currentScenario.consumption - balancedScenario.consumption).toFixed(1)}`} unit=" L/100km" tone="amber" />
        </Card>
        <Card>
          <Stat label="Diferença de eficiência" value={`${Math.abs(currentScenario.efficiency - balancedScenario.efficiency)}`} unit=" pts" tone="cyan" />
        </Card>
      </div>
    </div>
  );
}
