
import Config from './../interfaces/Config';
import State from './State';
import Location from './../interfaces/Location';
import Cell from '../interfaces/Cell';
import Simulator from './../interfaces/Simulator';
import { InitialStateData } from '../interfaces/State';

export default abstract class AbstractSimulator implements Simulator {
  state: State;

  constructor(public config: Config, initialData: InitialStateData) {
    this.state = new State(initialData);
  }

  run(): Promise<this> {
    if (this.isSimComplete()) {
      return Promise.resolve(this);
    }

    return this.turn()
      .then(() => this.run());
  }

  // apply the sim rules at each location
  // set the new state
  turn() {
    const p: Promise<Cell>[] = [];

    /** @todo dynamic size */
    for (let y = 0; y < this.state.getDataSize('y'); y++) {
      for (let x = 0; x < this.state.getDataSize('x'); x++) {
        p.push(this.applyRules({ x, y }));
      }
    }

    return Promise.all(p).then((newStateCells) => {
      /** @todo keep track of old locations */
      this.state.setNextTurnCells(newStateCells);

      return;
    });
  }

  isSimComplete() {
    return this.state.turn >= this.config.maxTurns;
  }

  beforeTurn(): this {
    return this;
  }

  afterTurn(): this {
    return this;
  }

  afterComplete(): this {
    return this;
  }

  abstract applyRules(loc: Location): Promise<Cell>;
}
