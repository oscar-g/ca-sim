import { Location } from './Location';

/**
 * Simulator state machine
 *
 * Input data is 2-dimensional array of 0|1
 * Uses QuadTree to represent input data internally.
 */
export type StateData = Uint8Array;
export type CellState = 0 | 1;

export interface IState {
  turn: number;
  data: StateData;
  dataWidth: number;
  initialData: StateData;

  dataToString(data?: StateData): string;

  setData(loc: Location, state: CellState): this;
  delData(loc: Location): this;
  getData(loc: Location): CellState;

  getMooreNeighborhood(loc: Location, size: number): StateData;

  setTurn(to: number): number;
  getRandomData(dataWidth: number): StateData;
  /**
   * Calculate min/max x/y boundary of a s-sized square, centered at loc
   *
   * @param s Neighboorhood edge size. Should be odd an number. Even numbers will be incremented.
   * @returns 2d tuple representing corners of neighboorhood `[[minY, maxY], [minX, maxX]]`
   */
  getNeighborhoodBounds(
    loc: Location,
    s?: number,
  ): [[number, number], [number, number]];
}
