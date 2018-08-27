import { Option } from 'ts-option';
import * as QuadTree from 'quadtree-lib';

import SimI from './../interfaces/Simulator';
import Config from './../interfaces/Config';
import State from './State';
import Location from './../interfaces/Location';
import Cell from '../interfaces/Cell';

export default abstract class AbstractSimulator implements SimI {
  state: State

  constructor(public config: Config, initialData: Uint8Array[]) {
    this.state = new State(initialData); 
  }

  run() {
    while (!this.isSimComplete()) {
      this.beforeTurn();
      this.turn();
      this.afterTurn();
    }

    return this;
  }

  // apply the sim rules at each location
  // set the new state
  turn(): this {
    const newStateCells: Cell[] = [];

    // @todo dynamic size
    for(var y = 0; y < this.state.initialData.length; y++) {
      for(var x = 0; x < this.state.initialData.length; x++) {
        newStateCells.push(this.applyRules({x, y}));
      }
    }

    // @todo keep track of old locations
    this.state.setNextTurnCells(newStateCells);

    return this;
  }

  isSimComplete() {
    return !(this.state.turn <= this.config.maxTurns);
  }

  beforeTurn(): this {
    return this;
  }

  afterTurn(): this {
    return this;
  }

  abstract applyRules(loc: Location): Cell
}
