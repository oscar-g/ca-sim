import { expect } from 'chai';

import State from '../../src/simulation/State';

describe.only('State', () => {
  describe('setData()', () => {
    it('updates live cells', () => {
      const state = new State([
        [0, 1],
        [1, 0],
      ]);

      // turn off
      state.setData({
        x: 1,
        y: 0,
        state: 0,
      });

      const testOpt = state.getData({ x: 1, y: 0 });
      expect(testOpt.nonEmpty).true;
      expect(testOpt.get.state).eq(0);
    });

    it('sets data on dead cells', () => {
      const state = new State([
        [0, 1],
        [1, 0],
      ]);

      // turn on a cell
      state.setData({
        x: 0,
        y: 0,
        state: 1,
      });

      const testOpt = state.getData({ x: 0, y: 0 });
      expect(testOpt.nonEmpty).true;
      expect(testOpt.get.state).eq(1);
    });

    it('implements toriodal data array', () => {
      const state = new State([
        [0, 1],
        [1, 0],
      ]);

      // turn on
      state.setData({
        x: 2,
        y: 2,
        state: 1,
      });

      let testOpt = state.getData({ x: 0, y: 0 });
      expect(testOpt.nonEmpty).true;
      expect(testOpt.get.state).eq(1);

      // turn off
      state.setData({
        x: 2,
        y: 2,
        state: 0,
      });

      testOpt = state.getData({ x: 0, y: 0 });
      expect(testOpt.nonEmpty).true;
      expect(testOpt.get.state).eq(0);
    });
  });

  describe('delData()', () => {
    it('removes data', () => {
      const state = new State([
        [0, 1],
        [1, 0],
      ]);

      state.delData({ x: 1, y: 0 });
      expect(state.getData({ x: 1, y: 0 }).isEmpty).true;
    });

    it('implements toriodal data array', () => {
      const state = new State([
        [0, 1],
        [1, 0],
      ]);

      state.delData({ x: 3, y: 0 });
      expect(state.getData({ x: 1, y: 0 }).isEmpty).true;

      state.delData({ x: 0, y: 3 });
      expect(state.getData({ x: 0, y: 1 }).isEmpty).true;
    });
  });

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

    it('implements toriodal data array', () => {
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
