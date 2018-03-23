import { queues, priorities } from './queues'
import { queueTaskProcessing, runTask } from './scheduling'

const QUEUE = Symbol('task queue')
const IS_STOPPED = Symbol('is stopped')
const IS_SLEEPING = Symbol('is sleeping')

export class Queue {
  constructor (priority = priorities.SYNC) {
    this[QUEUE] = new Set()
    this.priority = priority
    queues[this.priority].push(this[QUEUE])
  }

  has (task) {
    return this[QUEUE].has(task)
  }

  add (task) {
    if (this[IS_SLEEPING]) {
      return
    }
    if (this.priority === priorities.SYNC && !this[IS_STOPPED]) {
      task()
    } else {
      const queue = this[QUEUE]
      queue.add(task)
    }
    if (!this[IS_STOPPED]) {
      queueTaskProcessing(this.priority)
    }
  }

  delete (task) {
    this[QUEUE].delete(task)
  }

  start () {
    const queue = this[QUEUE]
    if (this.priority === priorities.SYNC) {
      this.process()
    } else {
      const priorityQueues = queues[this.priority]
      if (priorityQueues.indexOf(queue) === -1) {
        priorityQueues.push(queue)
      }
      queueTaskProcessing(this.priority)
    }
    this[IS_STOPPED] = false
    this[IS_SLEEPING] = false
  }

  stop () {
    const queue = this[QUEUE]
    const priorityQueues = queues[this.priority]
    const index = priorityQueues.indexOf(queue)
    if (index !== -1) {
      priorityQueues.splice(index, 1)
    }
    this[IS_STOPPED] = true
  }

  sleep () {
    this.stop()
    this[IS_SLEEPING] = true
  }

  clear () {
    this[QUEUE].clear()
  }

  get size () {
    return this[QUEUE].size
  }

  process () {
    const queue = this[QUEUE]
    queue.forEach(runTask)
    queue.clear()
  }

  processing () {
    const queue = this[QUEUE]
    return new Promise(resolve => {
      if (queue.size === 0) {
        resolve()
      } else {
        queue.add(resolve)
      }
    })
  }
}
