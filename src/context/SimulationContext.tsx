import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from 'react';
import type {
  AppScreen,
  CabinReadings,
  CargoItem,
  DemoStep,
  HistoryEntry,
  ViewPreset,
} from '../types';
import { initialCabinReadings, initialCargoItems, seedHistory } from '../data/initialState';

interface SimulationState {
  cargoItems: CargoItem[];
  cabin: CabinReadings;
  screen: AppScreen;
  viewPreset: ViewPreset;
  selectedSensorId: string | null;
  presentationMode: boolean;
  demoRunning: boolean;
  demoStep: DemoStep;
  history: HistoryEntry[];
  overloadActive: boolean;
  lastAddedCargoId: string | null;
}

type Action =
  | { type: 'ADD_CARGO'; item: CargoItem }
  | { type: 'REMOVE_CARGO'; id: string }
  | { type: 'SET_CARGO_ITEMS'; items: CargoItem[] }
  | { type: 'ADJUST_QUICK_CARGO'; deltaKg: number }
  | { type: 'SET_CABIN'; patch: Partial<CabinReadings> }
  | { type: 'SET_SCREEN'; screen: AppScreen }
  | { type: 'SET_VIEW_PRESET'; preset: ViewPreset }
  | { type: 'SET_SELECTED_SENSOR'; id: string | null }
  | { type: 'TOGGLE_PRESENTATION' }
  | { type: 'SET_DEMO_RUNNING'; running: boolean }
  | { type: 'SET_DEMO_STEP'; step: DemoStep }
  | { type: 'ADD_HISTORY'; entry: HistoryEntry }
  | { type: 'SET_OVERLOAD'; active: boolean }
  | { type: 'RESET' };

const initialState: SimulationState = {
  cargoItems: initialCargoItems,
  cabin: initialCabinReadings,
  screen: 'visao-geral',
  viewPreset: 'orbit',
  selectedSensorId: null,
  presentationMode: false,
  demoRunning: false,
  demoStep: 'idle',
  history: seedHistory,
  overloadActive: false,
  lastAddedCargoId: null,
};

const QUICK_CARGO_ID = 'quick-cargo';

function reducer(state: SimulationState, action: Action): SimulationState {
  switch (action.type) {
    case 'ADD_CARGO':
      return { ...state, cargoItems: [...state.cargoItems, action.item], lastAddedCargoId: action.item.id };
    case 'REMOVE_CARGO':
      return { ...state, cargoItems: state.cargoItems.filter((c) => c.id !== action.id) };
    case 'SET_CARGO_ITEMS':
      return { ...state, cargoItems: action.items };
    case 'ADJUST_QUICK_CARGO': {
      const existing = state.cargoItems.find((c) => c.id === QUICK_CARGO_ID);
      const nextWeight = Math.max(0, (existing?.weightKg ?? 0) + action.deltaKg);
      if (nextWeight <= 0) {
        return { ...state, cargoItems: state.cargoItems.filter((c) => c.id !== QUICK_CARGO_ID) };
      }
      if (existing) {
        return {
          ...state,
          cargoItems: state.cargoItems.map((c) => (c.id === QUICK_CARGO_ID ? { ...c, weightKg: nextWeight } : c)),
        };
      }
      return {
        ...state,
        cargoItems: [
          ...state.cargoItems,
          { id: QUICK_CARGO_ID, name: 'Carga adicionada', weightKg: nextWeight, position: 'centro', lateralOffset: 0 },
        ],
      };
    }
    case 'SET_CABIN':
      return { ...state, cabin: { ...state.cabin, ...action.patch } };
    case 'SET_SCREEN':
      return { ...state, screen: action.screen };
    case 'SET_VIEW_PRESET':
      return { ...state, viewPreset: action.preset };
    case 'SET_SELECTED_SENSOR':
      return { ...state, selectedSensorId: action.id };
    case 'TOGGLE_PRESENTATION':
      return { ...state, presentationMode: !state.presentationMode };
    case 'SET_DEMO_RUNNING':
      return { ...state, demoRunning: action.running };
    case 'SET_DEMO_STEP':
      return { ...state, demoStep: action.step };
    case 'ADD_HISTORY':
      return { ...state, history: [action.entry, ...state.history] };
    case 'SET_OVERLOAD':
      return { ...state, overloadActive: action.active };
    case 'RESET':
      return { ...initialState, history: state.history };
    default:
      return state;
  }
}

interface SimulationContextValue {
  state: SimulationState;
  addCargo: (item: Omit<CargoItem, 'id'>) => void;
  removeCargo: (id: string) => void;
  setCargoItems: (items: CargoItem[]) => void;
  adjustQuickCargo: (deltaKg: number) => void;
  setCabin: (patch: Partial<CabinReadings>) => void;
  setScreen: (screen: AppScreen) => void;
  setViewPreset: (preset: ViewPreset) => void;
  setSelectedSensor: (id: string | null) => void;
  togglePresentation: () => void;
  setDemoRunning: (running: boolean) => void;
  setDemoStep: (step: DemoStep) => void;
  addHistory: (entry: HistoryEntry) => void;
  setOverload: (active: boolean) => void;
  reset: () => void;
}

const SimulationContext = createContext<SimulationContextValue | null>(null);

let idCounter = 100;
function nextId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addCargo = useCallback((item: Omit<CargoItem, 'id'>) => {
    dispatch({ type: 'ADD_CARGO', item: { ...item, id: nextId('cargo') } });
  }, []);

  const adjustQuickCargo = useCallback((deltaKg: number) => dispatch({ type: 'ADJUST_QUICK_CARGO', deltaKg }), []);

  const removeCargo = useCallback((id: string) => dispatch({ type: 'REMOVE_CARGO', id }), []);
  const setCargoItems = useCallback((items: CargoItem[]) => dispatch({ type: 'SET_CARGO_ITEMS', items }), []);
  const setCabin = useCallback((patch: Partial<CabinReadings>) => dispatch({ type: 'SET_CABIN', patch }), []);
  const setScreen = useCallback((screen: AppScreen) => dispatch({ type: 'SET_SCREEN', screen }), []);
  const setViewPreset = useCallback((preset: ViewPreset) => dispatch({ type: 'SET_VIEW_PRESET', preset }), []);
  const setSelectedSensor = useCallback((id: string | null) => dispatch({ type: 'SET_SELECTED_SENSOR', id }), []);
  const togglePresentation = useCallback(() => dispatch({ type: 'TOGGLE_PRESENTATION' }), []);
  const setDemoRunning = useCallback((running: boolean) => dispatch({ type: 'SET_DEMO_RUNNING', running }), []);
  const setDemoStep = useCallback((step: DemoStep) => dispatch({ type: 'SET_DEMO_STEP', step }), []);
  const addHistory = useCallback((entry: HistoryEntry) => dispatch({ type: 'ADD_HISTORY', entry }), []);
  const setOverload = useCallback((active: boolean) => dispatch({ type: 'SET_OVERLOAD', active }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  const value = useMemo<SimulationContextValue>(
    () => ({
      state,
      addCargo,
      removeCargo,
      setCargoItems,
      adjustQuickCargo,
      setCabin,
      setScreen,
      setViewPreset,
      setSelectedSensor,
      togglePresentation,
      setDemoRunning,
      setDemoStep,
      addHistory,
      setOverload,
      reset,
    }),
    [state, addCargo, removeCargo, setCargoItems, adjustQuickCargo, setCabin, setScreen, setViewPreset, setSelectedSensor, togglePresentation, setDemoRunning, setDemoStep, addHistory, setOverload, reset],
  );

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
}

export function useSimulation() {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error('useSimulation deve ser usado dentro de SimulationProvider');
  return ctx;
}

export { nextId, QUICK_CARGO_ID };
