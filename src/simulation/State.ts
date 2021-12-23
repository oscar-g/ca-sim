import randomBytes from 'randombytes';
import { Location } from '../interfaces/Location';
import { CellState, IState as IState, StateData } from '../interfaces/State';

/**
 * @todo support growing data size
 * @todo remove assumptions on data size
 * */
export class State implements IState {
  turn: number = 0;
  data: StateData;

  constructor(public initialData: StateData, public dataWidth: number) {
    if (dataWidth ** 2 !== initialData.length) {
      throw new Error('`initialData.length` must be the square of `dataWidth`');
    }

    this.data = initialData;
  }

  dataToString() {
    return this.data.toString();
  }

  /**
   * Calculate the index of a location, assuming a coordinate system with the orgin at the top-left
   */
  getIndex({ x, y }: Location): number {
    return (
      this.dataWidth * Math.abs(y % this.dataWidth) +
      Math.abs(x % this.dataWidth)
    );
  }

  setData(loc: Location, state: CellState) {
    this.data.set([state], this.getIndex(loc));

    return this;
  }

  delData(loc: Location) {
    this.data.set([0], this.getIndex(loc));

    return this;
  }

  getData(loc: Location) {
    return this.data[this.getIndex(loc)] === 0 ? 0 : 1;
  }

  /**
   * @param loc Location representing the neighboorhood center
   * @param size Neighborhood size
   *
   * @todo rework "size" into more-accurate concept "Chebyshev distance" or "range"
   */
  getMooreNeighborhood(loc: Location, size: number = 3) {
    const [yBounds, xBounds] = getNeighborhoodBounds(loc, size);
    const nbh: CellState[] = [];

    // get data for all cells within the range
    for (let y = yBounds[0]; y <= yBounds[1]; y++) {
      for (let x = xBounds[0]; x <= xBounds[1]; x++) {
        nbh.push(this.getData({ x, y }));
      }
    }

    return new Uint8Array(nbh);
  }

  setTurn(to: number) {
    this.turn = to;

    return this.turn;
  }

  static RANDOM_DATA(dataWidth: number): StateData {
    return Uint8Array.from(randomBytes(dataWidth ** 2));
  }
}

/**
 * Calculate min/max x/y boundary of a s-sized square, centered at loc
 *
 * @param s Neighboorhood edge size. Should be odd an number. Even numbers will be incremented.
 * @returns 2d tuple representing corners of neighboorhood `[[minY, maxY], [minX, maxX]]`
 */
function getNeighborhoodBounds(
  loc: Location,
  s: number = 3,
): [[number, number], [number, number]] {
  let size = s;
  if (size % 2 === 0) {
    size++;
  }
  if (size < 3) {
    size = 3;
  }

  const half = (size - 1) / 2;

  return [
    [loc.y - half, loc.y + half],
    [loc.x - half, loc.x + half],
  ];
}
