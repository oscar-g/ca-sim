
import Config from './Config';
import Location from './Location';
import Cell from './Cell';
import State from './State';

interface Simulator {
  config: Config;
  state: State;

  /**
   * Run the simulation until complete.
   */
  run(): Promise<this>;

  /**
   * Run the simulation for a single turn.
   */
  turn(): Promise<void>;

  /**
   * Check if the simulation is complete.
   */
  isSimComplete(): boolean;

  /**
   * Apply the automata rules at the specified location and return the resulting cell.
   * @param loc
   */
  applyRules(loc: Location): Promise<Cell>;

  // hooks
  beforeTurn(): this;
  afterTurn(): this;
  afterComplete(): this;
}

export default Simulator;
