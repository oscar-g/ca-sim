import * as QuadTree from 'quadtree-lib';
import { Option } from 'ts-option';

import Cell from './Cell';
import Location from './Location';

type StateData = QuadTree<Cell>;

interface State {
  turn: number;
  data: StateData;
  initialData: Uint8Array[];

  exportData(): Uint8Array[];

  setData(cell: Cell): this;
  delData(loc: Location): this;
  getData(loc: Location): Option<Cell>;
  setNextTurnCells(data: Cell[]): this;

  getNeighborhood(loc: Location, size: number): QuadTree<Cell>;
  getLivingNeighbors(loc: Location, size: number): Cell[];
}

export default State;
