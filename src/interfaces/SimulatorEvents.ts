import NanoEvents from 'nanoevents';
import { Location } from './Location';

export interface SimulatorEvents {
  beforeTurn: void;
  afterTurn: void;
  applyRules: Location;
}

export type EventService = NanoEvents<SimulatorEvents>;
