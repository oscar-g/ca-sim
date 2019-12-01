import NanoEvents from 'nanoevents';

import Config from './../interfaces/Config';
import IState, { CellState } from './../interfaces/State';
import State from './State';
import Location from './../interfaces/Location';
import Simulator from './../interfaces/Simulator';
import { StateData } from '../interfaces/State';
import { EventService } from '../interfaces/SimulatorEvents';

export default abstract class AbstractSimulator implements Simulator {
  public state: IState;

  private eventService: EventService;
  public on: EventService['on'];

  constructor(public config: Config, initialData: StateData) {
    this.state = new State(initialData, config.dataWidth);

    this.eventService = new NanoEvents();
    this.on = this.eventService.on.bind(this.eventService);
  }

  run(): Promise<this> {
    if (this.isSimComplete()) {
      return Promise.resolve(this);
    }

    return this.turn()
      .then(() => this.run());
  }

  // apply the sim rules at each location and set the new state
  turn() {
    const nextStateQueue: Promise<[Location, CellState]>[] = [];

    this.eventService.emit('beforeTurn', undefined);

    /**
     * @todo dynamic size
     */
    for (let y = 0; y < this.config.dataWidth; y++) {
      for (let x = 0; x < this.config.dataWidth; x++) {
        const loc: Location = { x, y }

        nextStateQueue.push(this.applyRules(loc).then(cellState => {
          this.eventService.emit('applyRules', loc);

          // tslint:disable-next-line: prefer-type-cast
          return [loc, cellState] as [Location, CellState]
        }));
      }
    }

    return Promise.all(nextStateQueue).then((updates) => {
      updates.forEach(([loc, state]) => {
        this.state.setData(loc, state);
      })

      /**
       * @todo keep track of old locations
       */

      this.eventService.emit('afterTurn', undefined);

      this.state.setTurn(this.state.turn + 1)

      return;
    });
  }

  isSimComplete() {
    return this.state.turn >= this.config.maxTurns;
  }

  abstract applyRules(loc: Location): Promise<CellState>;
}
