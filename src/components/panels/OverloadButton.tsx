import { Button } from '../ui/Button';
import { useSimulation } from '../../context/SimulationContext';
import type { CargoPosition } from '../../types';

const OVERLOAD_ITEM = {
  name: 'Carga excedente de teste',
  weightKg: 12500,
  position: 'traseira' as CargoPosition,
  lateralOffset: 0.9,
};

export function OverloadButton() {
  const { state, addCargo, setCargoItems, setOverload } = useSimulation();

  const toggleOverload = () => {
    if (state.overloadActive) {
      setCargoItems(state.cargoItems.filter((c) => c.name !== OVERLOAD_ITEM.name));
      setOverload(false);
    } else {
      addCargo(OVERLOAD_ITEM);
      setOverload(true);
    }
  };

  return (
    <Button variant={state.overloadActive ? 'ghost' : 'danger'} onClick={toggleOverload}>
      {state.overloadActive ? 'Remover sobrecarga de teste' : '⚠ Simular sobrecarga'}
    </Button>
  );
}
