import Location from './Location';

interface I extends Location {
  // @todo support numeric state?
  state: 0|1;
}

export default I;
