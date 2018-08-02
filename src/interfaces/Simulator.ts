import { Option } from 'ts-option';

import Config from "./Config";
import Location from "./Location";
import Cell from "./Cell";
import State from "./State";

interface Simulator {
  config: Config
  state: State

  /**
   * Run the simulation until complete.
   */
  run(): this

  /**
   * Run the simulation for a single turn.
   */
  turn(): this

  /**
   * Check if the simulation is complete.
   */
  isSimComplete(): boolean

  /**
   * Apply the automata rules at the specified location and return the resulting cell, if alive.
   * @param loc 
   */
  applyRules(loc: Location): Option<Cell>

  // hooks
  beforeTurn(): this
  afterTurn(): this
}

export default Simulator;
