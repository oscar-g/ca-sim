# ca-sim

A simulator for 2d cellular automata and game of life. Defines `AbstractSimulator` and implements `LifeSimulator` and allows for configuration of a custom "game of life" rule through the definition of "born" and "survive" states.

**Modules**

- `interfaces/LifeRule`- Rule configuration for "game of life" by specifying a`number[]`for each`born`and`survive`states. Each`number`represents the "live neighbor count" that will trigger the specified state.
- `simulation/AbstractSimluator` - Prototype that is used to define a concrete simulation and handle the state in a consistent manner. Provides ability to define side-effects for events such as `beforeTurn, afterTurn, afterComplete`.
- `simulation/LifeSimulator`- Implements "game of life" simulator with ability to set a custom rule.
- `simluation/State` - Data controller for the simluator.
- `simulation/rules`- example of`LifeRule`for Conway's "game of life".

**Roadmap**

- v2 will have camelCase coding style.
