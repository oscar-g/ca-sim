import { Config } from './Config';
import { LifeRule } from './LifeRule';

export interface LifeConfig extends Config {
  rule: LifeRule;
}
