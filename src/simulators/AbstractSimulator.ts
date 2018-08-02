import { Option } from 'ts-option';
import * as QuadTree from 'quadtree-lib';

import SimI from './../interfaces/Simulator';
import Config from './../interfaces/Config';
import State from './../State';
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

  turn(): this {
    const newCellLocations: Location[] = [];

    // each row, each column
    for(var y = 0; y < this.state.initialData.length; y++) {
      for(var x = 0; x < this.state.initialData.length; x++) {
        this.applyRules({x, y}).map(_ => {
          newCellLocations.push(_);
        });
      }
    }

    // @todo keep track of old locations
    this.state.nextTurn(newCellLocations);

    return this;
  }

  isSimComplete() {
    return !(this.state.turn <= this.config.maxTurns);
  }

  beforeTurn(): this {
    // console.log("BEFORE");
    return this;
  }

  afterTurn(): this {
    // console.log("AFTER");
    return this;
  }

    /**
   * Apply a simulation at the cell location.
   */
  abstract applyRules(loc: Location): Option<Cell>
}
