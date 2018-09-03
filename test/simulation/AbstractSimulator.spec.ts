import {expect} from 'chai'
import AbstractSimulator from '../../src/simulation/AbstractSimulator';
import Cell from '../../src/interfaces/Cell';
import Location from '../../src/interfaces/Location';
import Config from '../../src/interfaces/Config';
import { InitialStateData } from '../../src/interfaces/State';

class TestAbstractSimulator extends AbstractSimulator {
  applyRules(loc: Location): Cell {
    return {
      ...loc,
      state: 1,
    };
  }
}

const simConf: Config = { maxTurns: 10, neighborhoodSize: 3 };
const testData: InitialStateData = [[0, 1], [0, 1]];

describe.only('AbstractSimulator', () => {
  describe('turn()', () => {
    it('applies the simulation rule, at every cell');
    it('sets the new state');
    it('increases the turn by one', () => {
      const sim = new TestAbstractSimulator(simConf, testData);

      expect(sim.state.turn).eq(0);
      sim.turn();
      expect(sim.state.turn).eq(1);
      sim.turn();
      expect(sim.state.turn).eq(2);
    });
  });

  describe('run()', () => {
    it('runs until the maximum number of turns', () => {
      const sim = new TestAbstractSimulator(simConf, testData);

      expect(sim.state.turn).eq(0);
      sim.run();
      expect(sim.state.turn).eq(10);
    });
  });
});
