import IState, { StateData, CellState } from '../interfaces/State';
import Location from '../interfaces/Location';

/**
 * @todo support growing data size
 * @todo remove assumptions on data size
 * */
class State implements IState {
  turn: number = 0;
  data: StateData

  constructor(public initialData: StateData, public dataWidth: number) {
    if (dataWidth ** 2 !== initialData.length) {
      throw new Error('`initialData.length` must be the square of `dataWidth`')
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
    return Math.abs((this.dataWidth * (y % this.dataWidth)) + (x % this.dataWidth))
  }

  setData(loc: Location, state: CellState) {
    this.data.set([state], this.getIndex(loc))

    return this;
  }

  delData(loc: Location) {
    this.data.set([0], this.getIndex(loc))

    return this;
  }

  getData(loc: Location) {
    return this.data[this.getIndex(loc)] === 0 ? 0 : 1
  }

  /**
   * @param loc Location representing the neighboorhood center
   * @param size Neighborhood size
   * 
   * @todo rework "size" into more-accurate concept "Chebyshev distance" or "range"
   */
  getMooreNeighborhood(loc: Location, size: number = 3) {
    const [yBounds, xBounds] = getNeighborhoodBounds(loc, size);
    const nbh: CellState[] = []


    // get data for all cells within the range
    for (let y = yBounds[0]; y <= yBounds[1]; y++) {
      for (let x = xBounds[0]; x <= xBounds[1]; x++) {
        nbh.push(this.getData({ x, y }))
      }
    }

    return new Uint8Array(nbh)
  }

  setTurn(to: number) {
    this.turn = to;

    return this.turn;
  }

  // /**
  //  * Return list of living cells in neighborhood centered at loc.
  //  */
  // getLivingNeighbors(loc: Location, size: number = 3): Cell[] {
  //   return this.getNeighborhood(loc, size).find((_: Cell) => _.state === 1);
  // }

  static generateRandomIndividual(chrSize: number): StateData {
    const genome: (0 | 1)[][] = [];

    for (let chrNum = 0; chrNum < chrSize; chrNum++) {
      const code: (0 | 1)[] = [];

      for (let baseNum = 0; baseNum < chrSize; baseNum++) {
        code[baseNum] = Math.round(Math.random()) as (0 | 1);
      }

      genome.push(code);
    }

    // @todo track unique genomes (ie md5(genome) suffix)
    return genome;
  }

  static generatePopulation(popSize: number, chrSize: number): StateData[] {
    const p: StateData[] = [];

    for (let i = popSize; i > 0; i--) {
      p.push(State.generateRandomIndividual(chrSize));
    }

    return p;
  }
}

export default State;


/**
 * Calculate min/max x/y boundary of a s-sized square, centered at loc
 * 
 * @param s Neighboorhood edge size. Should be odd an number. Even numbers will be incremented.
 * @returns 2d tuple representing corners of neighboorhood `[[minY, maxY], [minX, maxX]]`
 */
function getNeighborhoodBounds(loc: Location, s: number = 3): [[number, number], [number, number]] {
  let size = s;
  if (size % 2 === 0) { size++; }
  if (size < 3) { size = 3; }

  const half = (size - 1) / 2;

  return [
    [loc.y - half, loc.y + half],
    [loc.x - half, loc.x + half],
  ];
}
