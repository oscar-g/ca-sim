import { Config } from './Config';
import { Location } from './Location';
import { CellState, IState } from './State';

export interface Simulator {
  config: Config;
  state: IState;

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
   * Apply the automata rules at the specified location and return the resulting cell state.
   * @param loc
   */
  applyRules(loc: Location): Promise<CellState>;
}
