import * as QuadTree from 'quadtree-lib';
import { Option, none, some } from 'ts-option';

// tslint:disable-next-line:import-name
import IState, { InitialStateData } from '../interfaces/State';
import Cell from '../interfaces/Cell';
import Location from '../interfaces/Location';

/** @todo support growing data size */
class State implements IState {
  turn: number = 0;
  data: QuadTree<Cell>;

  constructor(public initialData: InitialStateData) {
    this.data = new QuadTree({
      width: initialData.length,
      height: initialData.length,
      maxElements: 9,
    });

    initialData.forEach((chr, y) => {
      chr.forEach((state, x) => {
        if (state === 1) {
          // populate live cells only
          this.setData({
            x, y,
            state: state as Cell['state'],
          });
        }
      });
    });
  }

  exportData() {
    const data: InitialStateData = [];

    for (let y = 0; y < this.initialData.length; y++) {
      data[y] = [];

      for (let x = 0; x < this.initialData.length; x++) {
        data[y][x] = this.getData({ x, y }).map(_ => _.state).getOrElse(0);
      }
    }

    return data;
  }

  setNextTurnCells(cells: Cell[]) {
    this.data.clear();

    cells.forEach((c) => {
      // populate live cells only
      if (c.state === 1) {
        this.setData(c);
      }
    });

    this.turn++;

    return this;
  }

  setData({x, y, ...cell}: Cell) {
    // delete old data, first
    this.delData({x, y})

    // add the cell
    this.data.push({
      x: x % this.initialData.length,
      y: y % this.initialData.length,
      ...cell,
    });

    return this;
  }

  delData({x, y}: Location) {
    // find all data at location
    this.data.where({
      x: x % this.initialData.length,
      y: y % this.initialData.length,
    }).forEach((l) => {
      this.data.remove(l);
    });

    return this;
  }

  getData({ x, y }: Location): Option<Cell> {
    const result = this.data.where({
      x: x % this.initialData.length,
      y: y % this.initialData.length,
    });

    // console.log("GOT DATA", result)
    return result.length === 0 ? none : some<Cell>(result[0]);
  }

  /**
   * Return elements of the neighborhood centered at loc
   */
  getNeighborhood(loc: Location, size: number = 3) {
    const [yBounds, xBounds] = State.getNeighborhoodBounds(loc, size);
    const newSize = yBounds[1] - yBounds[0];

    const nbh = new QuadTree<Cell>({
      width: newSize,
      height: newSize,
      maxElements: 4,
      x: loc.x,
      y: loc.y,
    });

    for (let y = yBounds[0]; y <= yBounds[1]; y++) {
      for (let x = xBounds[0]; x <= xBounds[1]; x++) {
        const cell = this.getData({ x, y }).getOrElse({ x, y, state: 0 });

        nbh.push(cell);
      }
    }

    return nbh;
  }

  /**
   * Return list of living cells in neighborhood centered at loc.
   */
  getLivingNeighbors(loc: Location, size: number = 3): Cell[] {
    return this.getNeighborhood(loc, size).find(_ => _.state === 1);
  }

  /**
   * Returns the min/max x/y boundary of a s-sized neighborhood, centered at loc
   */
  static getNeighborhoodBounds(loc: Location, s: number = 3): [[number, number], [number, number]] {
    let size = s;
    if (size % 2 === 0) { size++; }
    if (size < 3) { size = 3; }

    const half = (size - 1) / 2;

    return [
      [loc.y - half, loc.y + half],
      [loc.x - half, loc.x + half],
    ];
  }
}

export default State;
