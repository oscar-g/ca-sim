import * as QuadTree from 'quadtree-lib';
import { Option } from 'ts-option';

import Cell from './Cell';
import Location from './Location';

interface State {
  turn: number
  data: QuadTree<Cell>
  initialData: Uint8Array[]

  exportData(): Uint8Array[]
  nextTurn(locs: Location[]): this

  addCell(loc: Location): this
  getCell(loc: Location): Option<Cell>
  removeCell(loc: Location): this

  getNeighborhood(loc: Location, size: number): QuadTree<Cell>
  getLivingNeighbors(loc: Location, size: number): Cell[]
}

export default State;
