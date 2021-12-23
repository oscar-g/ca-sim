import LifeRule from '../interfaces/LifeRule';

// @todo add other common rules
export const lifeRules: { [k: string]: LifeRule } = {
  conway: {
    born: [3],
    survive: [3, 2],
  },
};
