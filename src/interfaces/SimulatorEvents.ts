import NanoEvents from 'nanoevents';

import Location from './Location';

export default interface SimulatorEvents {
  beforeTurn: void;
  afterTurn: void;
  applyRules: Location;
}

export type EventService = NanoEvents<SimulatorEvents>;
