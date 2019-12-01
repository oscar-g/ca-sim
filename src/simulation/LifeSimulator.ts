
import AbstractSimulator from './AbstractSimulator';
import Location from '../interfaces/Location';
import LifeConfig from '../interfaces/LifeConfig';
import LifeRule from '../interfaces/LifeRule';
import { StateData, CellState } from '../interfaces/State';
import State from './State';

class LifeSimulator extends AbstractSimulator {
  state!: State

  constructor(public config: LifeConfig, initialData: StateData) {
    super(config, initialData);
  }

  /**
   * Applies the current LifeRule.
   *
   * Counts the surviving neighbors and compares with LifeRule
   * @todo track cell state transition
   * @todo optimize rule calculation
   */
  applyRules(loc: Location) {
    const livingNeighbors = this.state
      .getMooreNeighborhood(loc, this.config.neighborhoodSize);

    // exclude the current cell from the "living neighbor" count
    livingNeighbors.set([0], this.state.getIndex(loc))

    let nextState: CellState = 0;

    for (let s = 0; s < this.config.rule.survive.length; s++) {
      if (livingNeighbors.length === this.config.rule.survive[s]) {
        nextState = 1
        break;
      }
    }

    for (let s = 0; s < this.config.rule.born.length; s++) {
      if (livingNeighbors.length === this.config.rule.born[s]) {
        nextState = 1
        break;
      }
    }


    return Promise.resolve(nextState);
  }
}

/**
 * @todo add other common rules
 */
const rules: { ['conway']: LifeRule } = {
  conway: {
    born: [3],
    survive: [3, 2],
  },
};

export default LifeSimulator;
export { rules };
