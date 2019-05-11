import NanoEvents from 'nanoevents';

import State from './State';
import Location from './Location';

export default interface SimulatorEvents {
  beforeTurn: State;
  afterTurn: State;
  applyRule: Location;
}

export type EventService = NanoEvents<SimulatorEvents>;
