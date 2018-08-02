import Location from './Location';

interface Cell extends Location {
  state: 0|1,
  type?: string,
}

export default Cell;
