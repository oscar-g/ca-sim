
import Config from './../interfaces/Config';
import State from './State';
import Location from './../interfaces/Location';
import Cell from '../interfaces/Cell';
import ISimulator from './../interfaces/Simulator'
import { InitialStateData } from '../interfaces/State';

export default abstract class AbstractSimulator implements ISimulator {
  state: State;

  constructor(public config: Config, initialData: InitialStateData) {
    this.state = new State(initialData);
  }

  run() {
    while (!this.isSimComplete()) {
      this.beforeTurn();
      this.turn();
      this.afterTurn();
    }

    this.afterComplete();

    return this;
  }

  // apply the sim rules at each location
  // set the new state
  turn(): this {
    const newStateCells: Cell[] = [];

    // @todo dynamic size
    for (let y = 0; y < this.state.initialData.length; y++) {
      for (let x = 0; x < this.state.initialData.length; x++) {
        newStateCells.push(this.applyRules({ x, y }));
      }
    }

    // @todo keep track of old locations
    this.state.setNextTurnCells(newStateCells);

    return this;
  }

  isSimComplete() {
    return this.state.turn >= this.config.maxTurns
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

  abstract applyRules(loc: Location): Cell;
}
