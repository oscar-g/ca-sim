export default interface SimulatorEvent {
  name: 'init'|'before-turn'|'after-turn'|'done';
  data?: Object;
}
