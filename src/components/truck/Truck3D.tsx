import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Grid, Loader, OrbitControls } from '@react-three/drei';
import { TruckModel } from './TruckModel';
import { CameraRig } from './CameraRig';
import { StageCallouts } from './StageCallouts';
import { TrafficLight } from './TrafficLight';
import { useSimulation } from '../../context/SimulationContext';
import { useMetrics } from '../../hooks/useMetrics';
import { sensorPoints } from '../../data/initialState';
import type { ViewPreset } from '../../types';
import { SensorDetailPanel } from '../panels/SensorDetailPanel';
import './Truck3D.css';

const VIEW_LABELS: { id: ViewPreset; label: string }[] = [
  { id: 'orbit', label: 'Livre' },
  { id: 'frontal', label: 'Frontal' },
  { id: 'lateral', label: 'Lateral' },
  { id: 'superior', label: 'Superior' },
];

export function Truck3D({ compact = false, showCallouts = false }: { compact?: boolean; showCallouts?: boolean }) {
  const { state, setViewPreset, setSelectedSensor } = useSimulation();
  const metrics = useMetrics();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);

  return (
    <div className={`truck3d ${compact ? 'truck3d--compact' : ''}`}>
      <div className="truck3d__hud truck3d__hud--top">
        <span className="truck3d__hud-badge mono">GÊMEO DIGITAL — RENDERIZAÇÃO EM TEMPO REAL</span>
      </div>
      {showCallouts && <TrafficLight level={metrics.overallLevel} />}

      <Canvas shadows camera={{ position: [6.8, 4.2, 8.2], fov: 42 }} dpr={[1, 1.8]}>
        <color attach="background" args={['#050a14']} />
        <fog attach="fog" args={['#050a14', 20, 42]} />
        <ambientLight intensity={0.6} />
        <hemisphereLight args={['#8fb8ff', '#0a0f18', 0.55]} />
        <directionalLight
          position={[7, 9, 5]}
          intensity={1.6}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-left={-7}
          shadow-camera-right={7}
          shadow-camera-top={7}
          shadow-camera-bottom={-7}
        />
        <pointLight position={[-5, 3, -2]} intensity={0.6} color="#2ad9ff" />
        <pointLight position={[5, 3, 6]} intensity={0.4} color="#34e5a8" />

        <Suspense fallback={null}>
          <TruckModel
            cargoItems={state.cargoItems}
            sensors={sensorPoints}
            selectedSensorId={state.selectedSensorId}
            onSelectSensor={setSelectedSensor}
            cargoAlert={metrics.cargoLevel}
            cabinAlert={metrics.cabinLevel}
            overloaded={metrics.overloaded}
            unbalanced={metrics.unbalanced}
          />
          <ContactShadows position={[0, 0.02, 2.6]} opacity={0.5} scale={14} blur={2} far={4} />
          {showCallouts && <StageCallouts totalWeightKg={metrics.totalWeightKg} />}
        </Suspense>

        <Grid
          position={[0, 0.01, 0]}
          args={[36, 36]}
          cellColor="#122238"
          sectionColor="#1c3a5c"
          fadeDistance={24}
          fadeStrength={1.5}
          infiniteGrid
        />

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enablePan={false}
          minDistance={2.5}
          maxDistance={18}
          maxPolarAngle={Math.PI / 2.05}
          onStart={() => setViewPreset('orbit')}
        />
        <CameraRig preset={state.viewPreset} controlsRef={controlsRef} />
      </Canvas>

      <div className="truck3d__hud truck3d__hud--views">
        {VIEW_LABELS.map((v) => (
          <button
            key={v.id}
            className={`truck3d__view-btn ${state.viewPreset === v.id ? 'is-active' : ''}`}
            onClick={() => setViewPreset(v.id)}
          >
            {v.label}
          </button>
        ))}
      </div>

      <p className="truck3d__disclaimer">
        Protótipo físico é uma maquete visual. Sensores e leituras exibidos aqui são <strong>simulados</strong>.
      </p>

      <SensorDetailPanel />
      <Loader
        containerStyles={{ background: 'rgba(5,10,20,0.85)' }}
        innerStyles={{ width: '200px' }}
        barStyles={{ background: '#2ad9ff' }}
        dataStyles={{ color: '#eaf2ff', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}
      />
    </div>
  );
}
