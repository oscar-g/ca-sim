import { expect } from 'chai';
import sinon from 'sinon';

import AbstractSimulator from '../../../src/simulation/AbstractSimulator';
import Location from '../../../src/interfaces/Location';
import Config from '../../../src/interfaces/Config';
import { CellState, StateData } from '../../../src/interfaces/State';

/**
 * bare-bones no-op simulator
 */
class TestAbstractSimulator extends AbstractSimulator {
  applyRules(_loc: Location): Promise<CellState> {
    return Promise.resolve(1)
  }
}

const simConf: Config = { maxTurns: 10, neighborhoodSize: 3, dataWidth: 2 };
// tslint:disable-next-line: mocha-no-side-effect-code
const testData: StateData = Uint8Array.from([0, 1, 0, 1])

describe('AbstractSimulator', () => {
  before(() => {

  })
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
      sim.on('beforeTurn', () => {
        expect(sim.state.turn).eq(0, 'Unexepected value for initial state.turn')
      });

      sim.turn().then(() => {
        expect(fake.calledOnce).eq(true, 'Expected `turn` to be called only once');

        done();
      }).catch(done);
    });
    it('emits an event after applying a simulation rule on a single cell', (done) => {
      const fake = sinon.fake();

      sim.on('applyRules', fake);

      sim.turn()
        .then(() => {
          expect(fake.getCalls().length).eq(4, 'Expected `applyRules` event to be fired 4 times');
          done();
        }).catch(done);
    });
    it('emits an event after applying all rules and setting the new state', (done) => {
      const fake = sinon.fake();
      sim.on('afterTurn', fake);

      sim.turn()
        .then(() => {
          expect(fake.calledOnce).eq(true, 'Expected `afterTurn` event to be fired only once');

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
            /**
             * @todo test other properties of state to ensure no-op
             */

            expect(sim.state.turn).eq(10);

            done();
          })
          .catch(done);
      });
    });
  });
});
