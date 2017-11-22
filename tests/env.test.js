// remove requestAnimationFrame and requestIdleCallback before the queue schedulers load
import { expect } from 'chai'
import { Queue, priorities } from '@nx-js/queue-util'
import { removeRIC, restoreRIC, removeRAF, restoreRAF, beforeNextFrame, heavyCalculation } from './utils'

describe('environments', () => {
  describe('NodeJS', () => {
    before(() => {
      removeRIC()
      removeRAF()
    })

    after(() => {
      restoreRIC()
      restoreRAF()
    })

    it('should run all critical tasks before high prio tasks before low prio tasks', async () => {
      let criticalRuns = 0
      let highRuns = 0
      let lowRuns = 0

      const criticalQueue = new Queue(priorities.CRITICAL)
      const highQueue = new Queue(priorities.HIGH)
      const lowQueue = new Queue(priorities.LOW)

      for (let i = 0; i < 10; i++) {
        criticalQueue.add(() => {
          criticalRuns++
          heavyCalculation()
        })

        highQueue.add(() => {
          highRuns++
          heavyCalculation()
        })

        lowQueue.add(() => {
          lowRuns++
          heavyCalculation()
        })
      }

      await criticalQueue.processing()
      expect(criticalRuns).to.equal(10)
      expect(highRuns).to.equal(0)
      expect(lowRuns).to.equal(0)
      await highQueue.processing()
      expect(criticalRuns).to.equal(10)
      expect(highRuns).to.equal(10)
      expect(lowRuns).to.equal(0)
      await lowQueue.processing()
      expect(criticalRuns).to.equal(10)
      expect(highRuns).to.equal(10)
      expect(lowRuns).to.equal(10)
    })
  })

  describe('older browsers', () => {
    before(() => {
      removeRIC()
    })

    after(() => {
      restoreRIC()
    })

    it('should run all critical tasks before high prio tasks before low prio tasks', async () => {
      let criticalRuns = 0
      let highRuns = 0
      let lowRuns = 0

      const criticalQueue = new Queue(priorities.CRITICAL)
      const highQueue = new Queue(priorities.HIGH)
      const lowQueue = new Queue(priorities.LOW)

      for (let i = 0; i < 10; i++) {
        criticalQueue.add(() => {
          criticalRuns++
          heavyCalculation()
        })

        highQueue.add(() => {
          highRuns++
          heavyCalculation()
        })

        lowQueue.add(() => {
          lowRuns++
          heavyCalculation()
        })
      }

      await criticalQueue.processing()
      expect(criticalRuns).to.equal(10)
      expect(highRuns).to.equal(0)
      expect(lowRuns).to.equal(0)
      await highQueue.processing()
      expect(criticalRuns).to.equal(10)
      expect(highRuns).to.equal(10)
      expect(lowRuns).to.equal(0)
      await lowQueue.processing()
      expect(criticalRuns).to.equal(10)
      expect(highRuns).to.equal(10)
      expect(lowRuns).to.equal(10)
    })
  })
})
