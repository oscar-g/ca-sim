import NanoEvents from 'nanoevents';

import State from './State';
import Location from './Location';

export default interface SimulatorEvents {
  beforeTurn: State;
  afterTurn: State;
  applyRule: {
    loc: Location,
    before: State,
    after: State,
  };
}

export type EventService = NanoEvents<SimulatorEvents>;
