import { expect } from 'chai';
import sinon from 'sinon';

import AbstractSimulator from '../../../src/simulation/AbstractSimulator';
import Cell from '../../../src/interfaces/Cell';
import Location from '../../../src/interfaces/Location';
import Config from '../../../src/interfaces/Config';
import { InitialStateData } from '../../../src/interfaces/State';

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
    let sim: TestAbstractSimulator;

    beforeEach(() => {
      sim = new TestAbstractSimulator(simConf, testData);
    });

    it('provides an event emmiter', () => {
      expect(sim).haveOwnProperty('on');
      expect(typeof sim.on).eq('function');
    });
  });

  describe('turn()', () => {
    let sim: TestAbstractSimulator;

    beforeEach(() => {
      sim = new TestAbstractSimulator(simConf, testData);
    });

    it('emits an event before doing anything', (done) => {
      const fake = sinon.fake();
      sim.on('beforeTurn', fake);
      sim.on('beforeTurn', state => expect(state.turn).eq(0));

      sim.turn().then(() => {
        expect(fake.calledOnce).eq(true);

        done();
      }).catch(done);
    });
    it('emits an event after applying a simulation rule on a single cell', (done) => {
      const fake = sinon.fake();
      sim.on('applyRule', fake);

      sim.turn()
        .then(() => {
          expect(fake.getCalls().length).eq(4);
          done();
        }).catch(done);
    });
    it('emits an event after applying all rules and setting the new state', (done) => {
      const fake = sinon.fake();
      sim.on('afterTurn', fake);

      sim.turn()
        .then(() => {
          expect(fake.calledOnce).eq(true);
          expect(fake.calledWith(sim.state)).eq(true);

          done();
        }).catch(done);
    });
  });

  describe('run()', () => {
    describe('first call', () => {
      it('runs until the maximum number of turns', (done) => {
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
