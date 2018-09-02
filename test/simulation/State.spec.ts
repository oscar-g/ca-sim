import { expect } from 'chai';

import State from '../../src/simulation/State';

describe.only('State', () => {
  describe('getData()', () => {
    it('returns the correct data', () => {
      const state = new State([
        [0, 1],
        [1, 0],
      ]);

      const expectEmpty = [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
      ];

      const expectFull = [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
      ];

      expectEmpty.forEach((loc) => {
        expect(state.getData(loc).isEmpty, `Expected empty option at x=${loc.x},y=${loc.y}`).true;
      });

      expectFull.forEach((loc) => {
        const data = state.getData(loc);
        expect(data.isDefined, `Expected data at x=${loc.x},y=${loc.y}`).true;

        expect(data.map(_ => _.state).getOrElse(0)).eq(1);
      });
    });

    it('considers data array to be a toriod', () => {
      const state = new State([
        [0, 1],
        [1, 0],
      ]);

      const expectEmpty = [
        { x: 2, y: 0 },
        { x: 0, y: 2 },
        { x: 4, y: 4 },
      ];

      const expectFull = [
        { x: 3, y: 0 },
        { x: 1, y: 2 },
        { x: 7, y: 4 },
      ];

      expectEmpty.forEach((loc) => {
        expect(state.getData(loc).isEmpty, `Expected empty option at x=${loc.x},y=${loc.y}`).true;
      });

      expectFull.forEach((loc) => {
        const data = state.getData(loc);
        expect(data.isDefined, `Expected data at x=${loc.x},y=${loc.y}`).true;

        expect(data.map(_ => _.state).getOrElse(0)).eq(1);
      });
    });
  });
});
