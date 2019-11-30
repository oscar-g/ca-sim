import path from 'path'
import { writeFileSync } from 'fs';


import LifeSimulator, { rules } from '@src/simulation/LifeSimulator'
import LifeConfig from '@src/interfaces/LifeConfig';
import State from '@src/simulation/State';

const filePath = path.join(__dirname, '..', 'benchmarks', `${new Date().toISOString()}.json`)

const simConfig: LifeConfig = {
  rule: rules.conway,
  maxTurns: 10,
  neighborhoodSize: 3,
}

const benchmarkConfig = {
  experimentSize: 100,
  dataSize: 50,
}

const reportResults: { event: string, tLoc: string, t: number, dt: number, data?: any }[] = []

const report = {
  config: benchmarkConfig,
  simulator: 'Life Simulator',
  simulatorConfig: simConfig,
  results: reportResults
}

/**
 * Record & timestamp an observation
 * @param event name of event
 * @param data
 */
const pushResult = (event: string, data?: any) => {
  const t = new Date()

  return reportResults.push({
    event,
    tLoc: t.toUTCString(),
    t: t.getTime(),
    dt: reportResults[0] ? t.getTime() - reportResults[0].t : 0,
    ...data,
  })
}

// begin report
pushResult('t0')

// generate initial data
const initialData = State.generatePopulation(benchmarkConfig.experimentSize, benchmarkConfig.dataSize)

pushResult('initial-data')

const sims = initialData.map(_ => new LifeSimulator(simConfig, _))


Promise.all(sims.map((sim, $s) => {
  return sim.run()
    .then(() => {
      pushResult('sample', {
        sampleNumber: $s,
        initialDensity: sim.state.initialData.reduce((x, row) => {
          row.forEach(cell => { x = x + cell })

          return x
        }, Number(0)),
        finalDensity: sim.state.exportData().reduce((x, row) => {
          row.forEach(cell => { x = x + cell })

          return x
        }, Number(0)),

        /**
         * @todo avg time, all turns
         * @todo time per turn std dev
         */
      })
    })
})).then(() => {
  /**
   * @todo sum, mean, stddev data size
   * @todo avg time
   */

  const sampleResults = reportResults
    .filter(_ => _.event === 'sample')

  const dtReport: number[] = sampleResults
    .map(_ => _.dt)
    .filter(_ => _ > 0) // only non-zero

  pushResult('t_end', {
    dtAvg: dtReport.reduce((x, y) => x + y, 0) / dtReport.length,
  })


  // output to file
  writeFileSync(filePath, JSON.stringify(report, null, 2));
})
