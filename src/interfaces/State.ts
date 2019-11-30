import Location from './Location';

/**
 * Simulator state machine
 *
 * Input data is 2-dimensional array of 0|1
 * Uses QuadTree to represent input data internally.
 */
export type StateData = Uint8Array;
export type CellState = 0 | 1

interface State {
  turn: number;
  data: StateData;
  dataWidth: number;
  initialData: StateData;

  dataToString(data?: StateData): string;

  setData(loc: Location, state: CellState): this;
  delData(loc: Location): this;
  getData(loc: Location): CellState
  getDataSize(dimension?: string): number;

  getMooreNeighborhood(loc: Location, size: number): StateData;
}

export default State;
