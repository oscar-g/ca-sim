// tslint:disable: max-line-length
import { expect } from 'chai';
import LifeSimulator, { rules } from '../../../src/simulation/LifeSimulator';
import LifeConfig from '../../../src/interfaces/LifeConfig';
import Location from '../../../src/interfaces/Location';
import State from '@src/interfaces/State';

const expectValueAtLocations = (state: State, locs: Location[], value: any) => {
  locs.forEach((loc) => {
    expect(state.getData(loc)).eq(value, `Expected value "${value}" at ${JSON.stringify(loc)}`)
  })
}

describe('LifeSimulator', () => {
  describe('applyRules()', () => {
    // tslint:disable-next-line: max-func-body-length
    context('Conway\'s Game of Life', () => {
      const config: LifeConfig = {
        rule: rules.conway,
        maxTurns: 1,
        neighborhoodSize: 3,
        dataWidth: 4,
      };

      specify('Any live cell with fewer than two live neighbors dies, as if by under population.', () => {
        const sim = new LifeSimulator(config, new Uint8Array([
          0, 1, 0, 0,
          0, 0, 0, 0,
          0, 0, 1, 1,
          0, 0, 0, 0,
        ]));
        const expectDeadLocations: Location[] = [
          { x: 1, y: 0 },
          { x: 2, y: 2 },
        ];

        return sim.run().then(() => {
          return expectValueAtLocations(sim.state, expectDeadLocations, 0);
        })
      });

      specify('Any live cell with two or three live neighbors lives on to the next generation.', () => {
        const sim = new LifeSimulator(config, new Uint8Array([
          0, 0, 0, 0,
          0, 1, 1, 0,
          1, 0, 1, 1,
          0, 0, 0, 0,
        ]));

        const expectLivingLocations: Location[] = [
          { x: 1, y: 1 },
          { x: 2, y: 1 },
          { x: 0, y: 2 },
        ];

        return sim.run().then(() => {
          return expectValueAtLocations(sim.state, expectLivingLocations, 1)
        });
      });
      specify('Any live cell with more than three live neighbors dies, as if by overpopulation.', () => {
        const sim = new LifeSimulator(config, new Uint8Array([
          0, 0, 0, 0,
          0, 1, 1, 0,
          1, 1, 1, 1,
          0, 0, 1, 0,
        ]));
        const expectDeadLocations: Location[] = [
          { x: 2, y: 1 },
          { x: 2, y: 2 },
          { x: 0, y: 2 },
        ];

        return sim.run().then(() => {
          return expectValueAtLocations(sim.state, expectDeadLocations, 0)
        });

      });
      specify('Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.', () => {
        const sim = new LifeSimulator(config, new Uint8Array([
          0, 0, 0, 1,
          0, 1, 1, 1,
          0, 0, 1, 0,
          0, 0, 0, 0,
        ]));

        const expectLivingLocations: Location[] = [
          { x: 1, y: 2 },
          { x: 3, y: 2 },
          { x: 0, y: 1 },
        ];

        const expectDeadLocations: Location[] = [
          { x: 0, y: 3 },
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 2, y: 0 },
        ];

        return sim.run().then(() => {
          expectValueAtLocations(sim.state, expectLivingLocations, 1);
          expectValueAtLocations(sim.state, expectDeadLocations, 0);
        });
      });
    });
  });
});
