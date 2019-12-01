import { expect } from 'chai';

import State from '../../../src/simulation/State';
import Location from '@src/interfaces/Location';

const getState = () => new State(new Uint8Array([0, 1, 1, 0]), 2)

describe('State', () => {
  describe('getIndex()', () => {
    it('implements toriodal data array', () => {
      const testData: [Location[], number][] = [
        [[ // NW corner
          { x: 2, y: 2 },
          { x: -2, y: -2 },
        ], 0],
        [[ // SW corner
          { x: 3, y: 3 },
          { x: -3, y: -3 },
          { x: 3, y: -3 },
        ], 3],
        [[ // vertical
          { x: 1, y: 2 },
          { x: 1, y: -2 },
          { x: -1, y: -2 },
          { x: -1, y: 2 },
        ], 1]]


      testData.forEach(([locs, expectedIndex]) => {
        locs.forEach(loc => {
          const state = getState();

          state.getIndex(loc);

          expect(state.getIndex(loc)).eq(expectedIndex, `Unexpected index for location (x=${loc.x}, y=${loc.y})`);
        });
      });
    })
  })
  describe('setData()', () => {
    it('updates live cells', () => {
      const state = getState()

      // turn off
      state.setData({
        x: 1,
        y: 0,
      }, 0)


      expect(state.getData({ x: 1, y: 0 })).eq(0, 'Value at (x=1, y=0) was not updated')
    });

    it('updates dead cells', () => {
      const state = getState()

      // turn on
      state.setData({
        x: 0,
        y: 0,
      }, 1);

      expect(state.getData({ x: 0, y: 0 })).eq(1, 'Value at (x=0, y=0) was not updated')
    });

    it('implements toriodal data array', () => {
      // turn on (NW corner)
      [
        { x: 2, y: 2 },
        { x: -2, y: -2 },
      ].forEach(loc => {
        const state = getState();

        state.setData(loc, 1);

        const testVal = state.getData({ x: 0, y: 0 });
        expect(testVal).eq(1, `Unexpected value at (x=${0}, y=${0}) from update at (x=${loc.x}, y=${loc.y})`);
      });

      // turn on (SE corner)
      [
        { x: 3, y: 3 },
        { x: -3, y: -3 },
      ].forEach(loc => {
        const state = getState();

        state.setData(loc, 1);

        const testVal = state.getData({ x: 1, y: 1 });
        expect(testVal).eq(1, `Unexpected value at (x=${1}, y=${1}) from update at (x=${loc.x}, y=${loc.y})`);
      });

      // turn off (NE corner)
      [
        { x: 3, y: 2 },
        { x: -3, y: -2 },
      ].forEach(loc => {
        const state = getState();

        state.setData(loc, 0);

        const testVal = state.getData({ x: 1, y: 0 });
        expect(testVal).eq(0, `Unexpected value at (x=${1}, y=${0}) from update at (x=${loc.x}, y=${loc.y})`);
      });

      // turn off (SW corner)
      [
        { x: 2, y: 3 },
        { x: -2, y: -3 },
      ].forEach(loc => {
        const state = getState();

        state.setData(loc, 0);

        const testVal = state.getData({ x: 0, y: 1 });
        expect(testVal).eq(0, `Unexpected value at (x=${0}, y=${1}) from update at (x=${loc.x}, y=${loc.y})`);
      });
    });
  });

  describe('delData()', () => {
    it('removes data', () => {
      const state = getState()

      state.delData({ x: 1, y: 0 });

      expect(state.getData({ x: 1, y: 0 })).eq(0, 'Expected dead cell at (x=1, y=0)');
    });

    it('implements toriodal data array', () => {
      const state = getState()

      state.delData({ x: 3, y: 0 });
      expect(state.getData({ x: 1, y: 0 })).eq(0, 'Expected dead cell at (x=1, y=0)')

      state.delData({ x: 0, y: 3 });
      expect(state.getData({ x: 0, y: 1 })).eq(0, 'Expected dead cell at (x=0, y=1)')
    });
  });

  describe('getData()', () => {
    it('returns the correct data', () => {
      const state = getState()

      const expectEmpty = [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
      ];

      const expectFull = [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
      ];

      expectEmpty.forEach((loc) => {
        expect(state.getData(loc)).eq(0, `Expected dead cell at x=${loc.x},y=${loc.y}`)
      });

      expectFull.forEach((loc) => {
        expect(state.getData(loc)).eq(1, `Expected live cell at x=${loc.x},y=${loc.y}`)
      });
    });

    it('implements toriodal data array', () => {
      const state = getState()

      const expectEmpty = [
        { x: 2, y: 0 },
        { x: 0, y: 2 },
        { x: 4, y: 4 },
      ];

      const expectFull = [
        { x: 3, y: 0 },
        { x: 1, y: 2 },
        { x: 7, y: 4 },
        // negative cases
        { x: -3, y: 0 },
        { x: -1, y: -2 },
        { x: -7, y: -4 },
      ];

      expectEmpty.forEach((loc) => {
        expect(state.getData(loc)).eq(0, `Expected empty cell at x=${loc.x},y=${loc.y}`)
      });

      expectFull.forEach((loc) => {
        expect(state.getData(loc)).eq(1, `Expected live cell at x=${loc.x},y=${loc.y}`);
      });
    });
  });
});
