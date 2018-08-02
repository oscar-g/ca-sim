import Config from './Config';
import LifeRule from './LifeRule'

export default interface LifeConfig extends Config {
  rule: LifeRule,
};
