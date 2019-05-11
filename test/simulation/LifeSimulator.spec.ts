// tslint:disable: max-line-length
import { expect } from 'chai';
import LifeSimulator, { rules } from './../../src/simulation/LifeSimulator';
import LifeConfig from '../../src/interfaces/LifeConfig';
import Location from '../../src/interfaces/Location';

describe('LifeSimulator', () => {
  describe('applyRules()', () => {
    context('Conway\'s Game of Life', () => {
      const config: LifeConfig = {
        rule: rules.conway,
        maxTurns: 1,
        neighborhoodSize: 3,
      };
      specify('Any live cell with fewer than two live neighbors dies, as if by under population.', (done) => {
        const sim = new LifeSimulator(config, [
          [0, 1, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 1, 1],
          [0, 0, 0, 0],
        ]);
        const expectDeadLocations: Location[] = [
          { x: 1, y: 0 },
          { x: 2, y: 2 },
        ];

        sim.run().then(() => {
          expectDeadLocations.forEach(({ x, y }) => {
            const data = sim.state.data.get({ x, y, state: 0 });
            expect(data.length).eq(0, `Expected dead cell at x=${x},y=${y}`);
          });

          done();
        });
      });
      specify('Any live cell with two or three live neighbors lives on to the next generation.', (done) => {
        const sim = new LifeSimulator(config, [
          [0, 0, 0, 0],
          [0, 1, 1, 0],
          [1, 0, 1, 1],
          [0, 0, 0, 0],
        ]);

        const expectLivingLocations: Location[] = [
          { x: 1, y: 1 },
          { x: 2, y: 1 },
          { x: 0, y: 2 },
        ];

        sim.run().then(() => {
          expectLivingLocations.forEach(({ x, y }) => {
            const data = sim.state.data.get({ x, y, state: 1 });
            expect(data.length).eq(1, `Expected live cell at x=${x},y=${y}`);
          });

          done();
        });
      });
      specify('Any live cell with more than three live neighbors dies, as if by overpopulation.', done => {
        const sim = new LifeSimulator(config, [
          [0, 0, 0, 0],
          [0, 1, 1, 0],
          [1, 1, 1, 1],
          [0, 0, 1, 0],
        ]);
        const expectDeadLocations: Location[] = [
          { x: 2, y: 1 },
          { x: 2, y: 2 },
          { x: 0, y: 2 },
        ];

        sim.run().then(() => {
          expectDeadLocations.forEach(({ x, y }) => {
            const data = sim.state.data.get({ x, y, state: 0 });
            expect(data.length).eq(0, `Expected dead cell at x=${x},y=${y}`);
          });

          done()
        });

      });
      specify('Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.', done => {
        const sim = new LifeSimulator(config, [
          [0, 0, 0, 1],
          [0, 1, 1, 1],
          [0, 0, 1, 0],
          [0, 0, 0, 0],
        ]);

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

        sim.run().then(() => {
          expectLivingLocations.forEach(({ x, y }) => {
            const data = sim.state.data.get({ x, y, state: 1 });
            expect(data.length).eq(1, `Expected live cell at x=${x},y=${y}`);
          });

          expectDeadLocations.forEach(({ x, y }) => {
            const data = sim.state.data.get({ x, y, state: 0 });
            expect(data.length).eq(0, `Expected dead cell at x=${x},y=${y}`);
          });

          done();
        });
      });
    });
  });
});
