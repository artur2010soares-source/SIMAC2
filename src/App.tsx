import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { StageHeader } from './components/layout/StageHeader';
import { ProjectIntro } from './components/layout/ProjectIntro';
import { SiteFooter } from './components/layout/SiteFooter';
import { Truck3D } from './components/truck/Truck3D';
import { AlertBanner } from './components/panels/AlertBanner';
import { Dashboard } from './components/panels/Dashboard';
import { QuickWeightPanel } from './components/panels/QuickWeightPanel';
import { OverloadButton } from './components/panels/OverloadButton';
import { StatusGeralCard } from './components/panels/StatusGeralCard';
import { CabinMonitoringPanel } from './components/panels/CabinMonitoringPanel';
import { SustainabilitySection } from './components/panels/SustainabilitySection';
import { SystemFlow } from './components/panels/SystemFlow';
import { HistoryTable } from './components/panels/HistoryTable';
import { AboutProject } from './components/panels/AboutProject';
import { DemoMode } from './components/panels/DemoMode';
import { InfoStatCard } from './components/ui/InfoStatCard';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { useMetrics } from './hooks/useMetrics';
import { useIsNarrow } from './hooks/useIsNarrow';
import { MAX_CARGO_ONLY_KG } from './utils/calculations';
import './App.css';

function OverviewScreen() {
  const metrics = useMetrics();
  const { state } = useSimulation();
  const isNarrow = useIsNarrow(560);

  const coTone = metrics.cabinLevel === 'critico' ? 'red' : metrics.cabinLevel === 'atencao' ? 'amber' : 'green';
  const coNote =
    metrics.cabinLevel === 'critico'
      ? 'Ventile a cabine e verifique a fonte de CO.'
      : metrics.cabinLevel === 'atencao'
        ? 'Nível se aproximando do limite recomendado.'
        : 'Boa qualidade do ar na cabine.';

  const tempTone = state.cabin.temperatureC >= 40 ? 'red' : state.cabin.temperatureC >= 34 ? 'amber' : 'green';
  const tempNote =
    state.cabin.temperatureC >= 40
      ? 'Temperatura fora da faixa segura.'
      : state.cabin.temperatureC >= 34
        ? 'Temperatura elevada, fique atento.'
        : 'Ambiente adequado.';

  return (
    <div className="screen screen--split">
      <div className="screen__full">
        <ProjectIntro />
      </div>
      <div className="screen__stage-column">
        <StageHeader />
        <div className="screen__stage">
          <Truck3D showCallouts={!isNarrow} />
        </div>
        <QuickWeightPanel />
        <OverloadButton />
      </div>

      <div className="screen__side">
        <InfoStatCard
          icon="⚖"
          iconTone="cyan"
          label="Peso da carga"
          value={metrics.cargoOnlyKg.toLocaleString('pt-BR')}
          unit=" kg"
          topRightLabel="Limite máximo"
          topRightValue={`${MAX_CARGO_ONLY_KG.toLocaleString('pt-BR')} kg`}
          progressPct={metrics.cargoOnlyPct}
          progressTone={metrics.overloaded ? 'red' : metrics.cargoOnlyPct > 80 ? 'amber' : 'green'}
          statusLabel={metrics.overloaded ? 'Carga acima do limite' : 'Carga dentro do limite'}
          statusTone={metrics.overloaded ? 'red' : 'green'}
        />
        <InfoStatCard
          icon="🍃"
          iconTone={coTone}
          label="CO (monóxido de carbono)"
          value={state.cabin.coPpm}
          unit=" ppm"
          statusLabel={metrics.cabinLevel === 'normal' ? 'Normal' : metrics.cabinLevel === 'atencao' ? 'Atenção' : 'Crítico'}
          statusTone={coTone}
          sideNote={{ icon: '🍃', text: coNote }}
        />
        <InfoStatCard
          icon="🌡"
          iconTone={tempTone}
          label="Temperatura da cabine"
          value={state.cabin.temperatureC.toFixed(0)}
          unit=" °C"
          statusLabel={tempTone === 'green' ? 'Normal' : tempTone === 'amber' ? 'Atenção' : 'Crítico'}
          statusTone={tempTone}
          sideNote={{ icon: '🌡', text: tempNote }}
        />
        <StatusGeralCard />
      </div>

      <div className="screen__full">
        <SystemFlow />
      </div>
    </div>
  );
}

function CabinScreen() {
  return (
    <div className="screen screen--split">
      <div className="screen__stage">
        <Truck3D compact />
      </div>
      <div className="screen__side">
        <CabinMonitoringPanel />
      </div>
    </div>
  );
}

function SustainabilityScreen() {
  return (
    <div className="screen screen--single">
      <SustainabilitySection />
    </div>
  );
}

function HistoryScreen() {
  return (
    <div className="screen screen--single">
      <HistoryTable />
    </div>
  );
}

function AboutScreen() {
  return (
    <div className="screen screen--single">
      <AboutProject />
    </div>
  );
}

function PresentationScreen() {
  return (
    <div className="screen screen--split screen--presentation">
      <div className="screen__stage screen__stage--tall">
        <Truck3D />
      </div>
      <div className="screen__side">
        <AlertBanner />
        <Dashboard />
        <SystemFlow />
      </div>
    </div>
  );
}

function ScreenRouter() {
  const { state } = useSimulation();

  if (state.presentationMode) return <PresentationScreen />;

  switch (state.screen) {
    case 'visao-geral':
      return <OverviewScreen />;
    case 'cabine':
      return <CabinScreen />;
    case 'sustentabilidade':
      return <SustainabilityScreen />;
    case 'historico':
      return <HistoryScreen />;
    case 'sobre':
      return <AboutScreen />;
    default:
      return <OverviewScreen />;
  }
}

function Shell() {
  const { state } = useSimulation();

  return (
    <div className="app-shell">
      <Header />
      {!state.presentationMode && <Navigation />}
      <main className="app-main">
        <ScreenRouter />
      </main>
      {!state.presentationMode && <SiteFooter />}
      <DemoMode />
    </div>
  );
}

export default function App() {
  return (
    <SimulationProvider>
      <Shell />
    </SimulationProvider>
  );
}
