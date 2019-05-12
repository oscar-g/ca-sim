import NanoEvents from 'nanoevents';

import Config from './../interfaces/Config';
import State from './State';
import Location from './../interfaces/Location';
import Cell from '../interfaces/Cell';
import Simulator from './../interfaces/Simulator';
import { InitialStateData } from '../interfaces/State';
import { EventService } from '../interfaces/SimulatorEvents';

export default abstract class AbstractSimulator implements Simulator {
  public state: State;

  private eventService: EventService;
  public on: EventService['on'];

  constructor(public config: Config, initialData: InitialStateData) {
    this.state = new State(initialData);

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

  // apply the sim rules at each location
  // set the new state
  turn() {
    const p: Promise<Cell>[] = [];

    this.eventService.emit('beforeTurn', this.state);

    /**
     * @todo dynamic size
     */
    for (let y = 0; y < this.state.getDataSize('y'); y++) {
      for (let x = 0; x < this.state.getDataSize('x'); x++) {
        p.push(this.applyRules({ x, y }));
        this.eventService.emit('applyRule', { x, y });
      }
    }

    return Promise.all(p).then((newStateCells) => {
      /**
       * @todo keep track of old locations
       */
      this.state.setNextTurnCells(newStateCells);
      this.eventService.emit('afterTurn', this.state);

      return;
    });
  }

  isSimComplete() {
    return this.state.turn >= this.config.maxTurns;
  }

  abstract applyRules(loc: Location): Promise<Cell>;
}
