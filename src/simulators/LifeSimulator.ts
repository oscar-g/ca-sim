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

  applyRules(loc: Location): Option<Cell> {
    const livingNeighbors = this.state.getLivingNeighbors(loc, 3);
    let live = false;

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

    return live ? some<Cell>({ ...loc, state: 1 }) : none;
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
