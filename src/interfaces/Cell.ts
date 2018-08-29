import Location from './Location';

interface Cell extends Location {
  // @todo support numeric state?
  state: 0|1;
}

export default Cell;
