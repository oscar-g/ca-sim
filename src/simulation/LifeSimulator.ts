
import AbstractSimulator from './AbstractSimulator';
import Location from '../interfaces/Location';
import Cell from '../interfaces/Cell';
import LifeConfig from '../interfaces/LifeConfig';
import LifeRule from '../interfaces/LifeRule';
import { InitialStateData } from '../interfaces/State';

class LifeSimulator extends AbstractSimulator {
  constructor(public config: LifeConfig, initialData: InitialStateData) {
    super(config, initialData);
  }

  /**
   * Applies the current LifeRule.
   *
   * Counts the surviving neighbors and compares with LifeRule
   * @todo track cell state transition
   */
  applyRules(loc: Location): Cell {
    const livingNeighbors = this.state
      .getLivingNeighbors(loc, this.config.neighborhoodSize)
      // remove the current cell from the neighbor count
      .filter(({ x, y }) => !(x === loc.x && y === loc.y));
    let live = false;
    let newState: Cell['state'] = 0;

    for (let s = 0; s < this.config.rule.survive.length; s++) {
      if (livingNeighbors.length === this.config.rule.survive[s]) {
        live = true;
        break;
      }
    }

    for (let s = 0; s < this.config.rule.born.length; s++) {
      if (livingNeighbors.length === this.config.rule.born[s]) {
        live = true;
        break;
      }
    }

    if (live) {
      newState = 1;
    }

    return {
      ...loc,
      state: newState,
    };
  }
}

// @todo add other common rules
const rules: { [k: string]: LifeRule } = {
  conway: {
    born: [3],
    survive: [3, 2],
  },
};

export default LifeSimulator;
export { rules };
