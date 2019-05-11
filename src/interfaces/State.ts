import * as QuadTree from 'quadtree-lib';
import { Option } from 'ts-option';

import Cell from './Cell';
import Location from './Location';

/**
 * Simulator state machine
 *
 * Input data is 2-dimensional array of 0|1
 * Uses QuadTree to represent input data internally.
 */
export type InitialStateData = Cell['state'][][];

interface State {
  turn: number;
  data: QuadTree<Cell>;
  initialData: InitialStateData;

  exportData(): InitialStateData;

  setData(cell: Cell): this;
  delData(loc: Location): this;
  getData(loc: Location): Option<Cell>;
  getDataSize(dimension?: string): number;
  setNextTurnCells(data: Cell[]): this;

  getNeighborhood(loc: Location, size: number): QuadTree<Cell>;
  getLivingNeighbors(loc: Location, size: number): Cell[];
}

export default State;
