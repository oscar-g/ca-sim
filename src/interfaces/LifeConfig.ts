import Config from './Config';
import LifeRule from './LifeRule';

interface LifeConfig extends Config {
  rule: LifeRule;
}

export default LifeConfig;
