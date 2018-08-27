import { Option, none, some } from 'ts-option';

import AbstractSimulator from './AbstractSimulator';
import Location from '../interfaces/Location';
import Cell from '../interfaces/Cell';
import LifeConfig from '../interfaces/LifeConfig';
import LifeRule from '../interfaces/LifeRule';

class LifeSimulator extends AbstractSimulator {
  constructor(public config: LifeConfig, initialData: Uint8Array[]) {
    super(config, initialData);
  }

  /**
   * Applies the current LifeRule.
   * 
   * Counts the surviving neighbors and compares with LifeRule
   * @todo track cell state transition
   */
  applyRules(loc: Location): Cell {
    const livingNeighbors = this.state.getLivingNeighbors(loc, this.config.neighborhoodSize);
    let live = false;
    let newState: Cell["state"] = 0;

    for(var s = 0;s < this.config.rule.survive.length; s++) {
      if (livingNeighbors.length === this.config.rule.survive[s]) {
        live = true;
        break;
      }
    }

    for(var s = 0;s < this.config.rule.born.length; s++) {
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
    born: [2],
    survive: [3, 2],
  },
};

export default LifeSimulator;
export { rules };
