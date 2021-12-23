import LifeConfig from '../interfaces/LifeConfig';
import Location from '../interfaces/Location';
import { CellState, StateData } from '../interfaces/State';
import AbstractSimulator from './AbstractSimulator';
import { lifeRules as rules } from './rules';

/**
 * A totalistic cellular automation
 */
class LifeSimulator extends AbstractSimulator {
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
    const nbh: Uint8Array = this.state.getMooreNeighborhood(
      loc,
      this.config.neighborhoodSize,
    );

    // exclude the current cell from the "living neighbor" count
    nbh.set([0], Math.floor(nbh.length / 2));

    const livingNeighbors: number = nbh.reduce((a, b) => a + b, 0);

    var nextState: CellState = 0;

    if (this.config.rule.survive.includes(livingNeighbors)) {
      nextState = 1;
    }

    if (this.config.rule.born.includes(livingNeighbors)) {
      nextState = 1;
    }

    return Promise.resolve(nextState);
  }
}

export default LifeSimulator;
export { rules };
