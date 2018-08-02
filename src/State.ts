import * as QuadTree from 'quadtree-lib';
import { Option, none, some } from 'ts-option';

import StateI from './interfaces/State';
import Cell from './interfaces/Cell';
import Location from './interfaces/Location';

class State implements StateI {
  turn: number = 0;
  data: QuadTree<Cell>;

  constructor(public initialData: Uint8Array[]) {
    this.data = new QuadTree({
      width: initialData.length,
      height: initialData.length,
      maxElements: 9,
    });
  
    initialData.forEach((chr, y) => {
      chr.forEach((state, x) => {
        // populate live cells only
        if (state > 0) {
          this.addCell({x, y});
        }
      });
    });
  }

  exportData(): Uint8Array[] {
    const data: Uint8Array[] = [];

    // encode the data
    // @todo what if the array grows?
    for(var y = 0; y < this.initialData.length; y++) {
      data[y] = new Uint8Array(this.initialData.length);

      for(var x = 0; x < this.initialData.length; x++) {
        data[y][x] = this.getCell({x, y}).map(_ => 1).getOrElse(0);
      }
    }

    return data;
  }

  nextTurn(locs: Location[]): this {
    this.turn++;
    this.data = new QuadTree({
      width: this.initialData.length,
      height: this.initialData.length,
      maxElements: 9,
    });
  
    locs.forEach(this.addCell);

    return this;
  }

  addCell(loc: Location): this {
    this.data.push({
      ...loc,
      state: 1,
    });

    return this;
  }

  getCell(loc: Location): Option<Cell> {
    const result = this.data.where(loc);

    return result.length === 0 ? none : some<Cell>(result[0]);
  }

  removeCell(loc: Location): this {
    this.getCell(loc).map(this.data.remove)

    return this;
  }

  getNeighborhood(loc: Location, size: number = 3) {
    const [yBounds, xBounds] = State.getNeighborhoodBounds(loc, size);
    size = yBounds[1] - yBounds[0];

    const nbh = new QuadTree<Cell>({
      width: size,
      height: size,
      maxElements: 4,
      x: loc.x,
      y: loc.y,
    });

    for(var y = yBounds[0]; y <= yBounds[1]; y++) {
      for(var x = xBounds[0]; x <= xBounds[1]; x++) {
        const cell = this.getCell({x, y}).getOrElse({x, y, state: 0});

        nbh.push(cell);
      }
    }

    return nbh;
  }

  getLivingNeighbors(loc: Location, size?: number): Cell[] {
    return this.getNeighborhood(loc, size).find(_ => _.state === 1);
  }

  static getNeighborhoodBounds(loc: Location, size: number = 3) {
    if (size % 2 === 0) { size++; }
    if (size < 3) {size = 3;}
    
    const half = (size - 1) / 2;

    return [
      [loc.y - half, loc.y + half],
      [loc.x - half, loc.x + half],
    ];
  }
}

export default State;
