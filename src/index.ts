import LifeSimulator, { rules as lifeSimulatorRules } from './simulation/LifeSimulator';
import AbstractSimulator from './simulation/AbstractSimulator';
import State from './simulation/State';
import { StateData } from './interfaces/State';

export {
  LifeSimulator,
  AbstractSimulator,
  State,
  StateData,
  StateData as InitialStateData,
  lifeSimulatorRules,
};
