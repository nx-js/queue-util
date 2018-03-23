import chai, { expect } from 'chai'
import dirtyChai from 'dirty-chai'
import { Queue, priorities } from '@nx-js/queue-util'
import { spy, beforeNextFrame } from './utils'

chai.use(dirtyChai)

describe('Queue', () => {
  it('should auto run the added tasks', async () => {
    const queue = new Queue(priorities.CRITICAL)
    const taskSpy1 = spy(() => {})
    const taskSpy2 = spy(() => {})
    queue.add(taskSpy1)
    queue.add(taskSpy2)
    await queue.processing()
    expect(queue.size).to.eql(0)
    expect(taskSpy1.callCount).to.eql(1)
    expect(taskSpy2.callCount).to.eql(1)
  })

  describe('has', () => {
    it('should return with a boolean indication if the task is in the queue', () => {
      const queue = new Queue(priorities.CRITICAL)
      const task = () => {}
      expect(queue.has(task)).to.be.false()
      queue.add(task)
      expect(queue.has(task)).to.be.true()
    })
  })

  describe('add', () => {
    it('should add the task to the queue', () => {
      const queue = new Queue(priorities.HIGH)
      const task = spy(() => {})
      expect(queue.has(task)).to.be.false()
      queue.add(task)
      expect(queue.has(task)).to.be.true()
      expect(task.callCount).to.eql(0)
    })

    it('should run the task if it has a SYNC priority', () => {
      const queue = new Queue(priorities.SYNC)
      const task = spy(() => {})
      queue.add(task)
      expect(task.callCount).to.eql(1)
      queue.add(task)
      expect(task.callCount).to.eql(2)
    })

    it('should ignore duplicate entries', () => {
      const queue = new Queue(priorities.HIGH)
      const task = () => {}
      expect(queue.has(task)).to.be.false()
      queue.add(task)
      queue.add(task)
      queue.add(task)
      expect(queue.size).to.eql(1)
      expect(queue.has(task)).to.be.true()
    })
  })

  describe('delete', () => {
    it('should delete the task from the queue', () => {
      const queue = new Queue(priorities.LOW)
      const task = () => {}
      queue.add(task)
      expect(queue.has(task)).to.be.true()
      queue.delete(task)
      expect(queue.has(task)).to.be.false()
    })

    it('should delete async tasks from the queue', () => {
      const queue = new Queue(priorities.SYNC)
      const task = () => {}
      queue.stop()
      queue.add(task)
      expect(queue.has(task)).to.be.true()
      queue.delete(task)
      expect(queue.has(task)).to.be.false()
    })
  })

  describe('size', () => {
    it('should return the size of the queue', () => {
      const queue = new Queue(priorities.CRITICAL)
      const task = () => {}
      expect(queue.size).to.eql(0)
      queue.add(task)
      expect(queue.size).to.eql(1)
      queue.delete(task)
      expect(queue.size).to.eql(0)
    })

    it('should throw on set operations', () => {
      const queue = new Queue(priorities.CRITICAL)
      expect(() => (queue.size = 12)).to.throw()
    })
  })

  describe('clear', () => {
    it('should clear the queue', () => {
      const queue = new Queue(priorities.CRITICAL)
      const task = () => {}
      queue.add(task)
      expect(queue.size).to.eql(1)
      queue.clear()
      expect(queue.size).to.eql(0)
      expect(queue.has(task)).to.be.false()
    })
  })

  describe('stop', async () => {
    it('should stop the automatic queue processing', async () => {
      const queue = new Queue(priorities.CRITICAL)
      const taskSpy = spy(() => {})
      queue.add(taskSpy)
      await queue.processing()
      expect(queue.size).to.eql(0)
      expect(taskSpy.callCount).to.eql(1)
      queue.add(taskSpy)
      queue.stop()
      await beforeNextFrame()
      expect(queue.size).to.eql(1)
      expect(taskSpy.callCount).to.eql(1)
    })

    it('should not start again until start is called', async () => {
      const queue = new Queue(priorities.CRITICAL)
      const taskSpy = spy(() => {})
      queue.add(taskSpy)
      await queue.processing()
      expect(queue.size).to.eql(0)
      expect(taskSpy.callCount).to.eql(1)
      queue.stop()
      queue.add(taskSpy)
      await beforeNextFrame()
      expect(queue.size).to.eql(1)
      expect(taskSpy.callCount).to.eql(1)
      queue.start()
      await beforeNextFrame()
      expect(queue.size).to.eql(0)
      expect(taskSpy.callCount).to.eql(2)
    })

    it('should have the same effect on multiple calls', async () => {
      const queue = new Queue(priorities.CRITICAL)
      const taskSpy = spy(() => {})
      queue.add(taskSpy)
      await queue.processing()
      expect(queue.size).to.eql(0)
      expect(taskSpy.callCount).to.eql(1)
      queue.add(taskSpy)
      queue.stop()
      queue.stop()
      queue.stop()
      await beforeNextFrame()
      expect(queue.size).to.eql(1)
      expect(taskSpy.callCount).to.eql(1)
    })

    it('should queue tasks instead of discarding them with SYNC priority', () => {
      const queue = new Queue(priorities.SYNC)
      const taskSpy = spy(() => {})
      expect(queue.size).to.eql(0)
      queue.stop()
      queue.add(taskSpy)
      queue.add(taskSpy)
      expect(queue.size).to.eql(1)
      expect(taskSpy.callCount).to.eql(0)
    })
  })

  describe('start', () => {
    it('should start the automatic queue processing after a stop', async () => {
      const queue = new Queue(priorities.CRITICAL)
      const taskSpy = spy(() => {})
      queue.add(taskSpy)
      queue.stop()
      await beforeNextFrame()
      expect(queue.size).to.eql(1)
      expect(taskSpy.callCount).to.eql(0)
      queue.start()
      await queue.processing()
      expect(queue.size).to.eql(0)
      expect(taskSpy.callCount).to.eql(1)
    })

    it('should start the automatic queue processing after a sleep', async () => {
      const queue = new Queue(priorities.CRITICAL)
      const taskSpy = spy(() => {})
      queue.add(taskSpy)
      queue.sleep()
      await beforeNextFrame()
      expect(queue.size).to.eql(1)
      expect(taskSpy.callCount).to.eql(0)
      queue.start()
      await queue.processing()
      expect(queue.size).to.eql(0)
      expect(taskSpy.callCount).to.eql(1)
    })

    it('should should have the same effect on multiple calls', async () => {
      const queue = new Queue(priorities.CRITICAL)
      const taskSpy = spy(() => {})
      queue.add(taskSpy)
      queue.stop()
      await beforeNextFrame()
      expect(queue.size).to.eql(1)
      expect(taskSpy.callCount).to.eql(0)
      queue.start()
      queue.start()
      queue.start()
      await queue.processing()
      expect(queue.size).to.eql(0)
      expect(taskSpy.callCount).to.eql(1)
    })

    it('should process tasks with SYNC priority', async () => {
      const queue = new Queue(priorities.SYNC)
      const taskSpy = spy(() => {})
      expect(queue.size).to.eql(0)
      queue.stop()
      queue.add(taskSpy)
      queue.add(taskSpy)
      await beforeNextFrame()
      expect(queue.size).to.eql(1)
      expect(taskSpy.callCount).to.eql(0)
      queue.start()
      expect(queue.size).to.eql(0)
      expect(taskSpy.callCount).to.eql(1)
    })
  })

  describe('sleep', () => {
    it('should stop the automatic queue processing', async () => {
      const queue = new Queue(priorities.CRITICAL)
      const taskSpy = spy(() => {})
      expect(queue.size).to.eql(0)
      queue.add(taskSpy)
      queue.sleep()
      await beforeNextFrame()
      expect(queue.size).to.eql(1)
      expect(taskSpy.callCount).to.eql(0)
    })

    it('should discard new tasks', async () => {
      const queue = new Queue(priorities.CRITICAL)
      const taskSpy = spy(() => {})
      queue.sleep()
      queue.add(taskSpy)
      expect(queue.size).to.eql(0)
      await beforeNextFrame()
      expect(taskSpy.callCount).to.eql(0)
    })
  })

  describe('process', () => {
    it('should process everything in the queue synchronously', () => {
      const queue = new Queue(priorities.HIGH)
      const taskSpy = spy(() => {})
      queue.add(taskSpy)
      queue.process()
      expect(queue.size).to.eql(0)
      expect(taskSpy.callCount).to.eql(1)
    })

    it('should process everything in stopped queues', () => {
      const queue = new Queue(priorities.LOW)
      const taskSpy = spy(() => {})
      queue.add(taskSpy)
      queue.stop()
      queue.process()
      expect(queue.size).to.eql(0)
      expect(taskSpy.callCount).to.eql(1)
    })
  })

  describe('processing', () => {
    it('should return a Promise, which resolves when all current tasks in the queue are processed', async () => {
      const queue = new Queue(priorities.CRITICAL)
      const taskSpy1 = spy(() => {})
      const taskSpy2 = spy(() => {})
      queue.add(taskSpy1)
      queue.add(taskSpy2)
      await queue.processing()
      expect(queue.size).to.eql(0)
      expect(taskSpy1.callCount).to.eql(1)
      expect(taskSpy2.callCount).to.eql(1)
    })

    it('should resolve immediately if the queue is empty', async () => {
      const queue = new Queue(priorities.LOW)
      // testing if this hangs
      await queue.processing()
    })
  })
})
