import {InitialStateData} from './../../src/interfaces/State'
import LifeSimulator, {rules} from './../../src/simulation/LifeSimulator'
import LifeConfig from '../../src/interfaces/LifeConfig';

const testCase: InitialStateData = [
  [0, 0, 0, 0],
  [0, 1, 1, 0],
  [0, 1, 1, 0],
  [0, 0, 0, 0],
];

describe('LifeSimulator', () => {
  describe('applyRules()', () => {
    context('Conway\'s Game of Life', () => {
      let sim: LifeSimulator;
      const config: LifeConfig = {
        rule: rules.conway,
        maxTurns: 1,
        neighborhoodSize: 3,
      };

      beforeEach(() => {
        sim = new LifeSimulator(config, testCase)
      })

      specify('Any live cell with fewer than two live neighbors dies, as if by under population.')
      specify('Any live cell with two or three live neighbors lives on to the next generation.')
      specify('Any live cell with more than three live neighbors dies, as if by overpopulation.')
      specify('Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.')
    });
  });
});