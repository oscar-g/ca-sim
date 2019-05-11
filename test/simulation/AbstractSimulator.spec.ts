import { expect } from 'chai';
import AbstractSimulator from '../../src/simulation/AbstractSimulator';
import Cell from '../../src/interfaces/Cell';
import Location from '../../src/interfaces/Location';
import Config from '../../src/interfaces/Config';
import { InitialStateData } from '../../src/interfaces/State';

/**
 * bare-bones no-op simulator
 */
class TestAbstractSimulator extends AbstractSimulator {
  applyRules(loc: Location) {
    return Promise.resolve({
      ...loc,
      state: 1,
    } as Cell);
  }
}

const simConf: Config = { maxTurns: 10, neighborhoodSize: 3 };
const testData: InitialStateData = [[0, 1], [0, 1]];

describe('AbstractSimulator', () => {
  describe('instance', () => {
    let sim = undefined;

    beforeEach(() => {
      sim = new TestAbstractSimulator(simConf, testData);
    });
    afterEach(() => {
      sim = undefined;
    });

    it('provides an event emmiter', () => {
      expect(sim).haveOwnProperty('on');
      expect(sim.on).be('Function', 'Must be a function');
    });
  });

  describe('turn()', () => {
    it('applies the simulation rule, at every cell');
    it('sets the new state');
    it('increases the turn by one');
  });

  describe('run()', () => {
    describe('first call', () => {
      it('runs until the maximum number of turns', done => {
        const sim = new TestAbstractSimulator(simConf, testData);

        expect(sim.state.turn).eq(0);

        sim.run().then(() => {
          expect(sim.state.turn).eq(10);
          done();
        }).catch(done);
      });
    });

    describe('subsquent calls to run()', () => {
      it('does nothing (no-op)', (done) => {
        const sim = new TestAbstractSimulator(simConf, testData);

        sim.run()
          .then(() => {
            expect(sim.state.turn).eq(10);

            return sim.run();
          })
          .then(() => {
            /** @todo test other properties of state to ensure no-op */
            expect(sim.state.turn).eq(10);

            done();
          })
          .catch(done);
      });
    });
  });
});
