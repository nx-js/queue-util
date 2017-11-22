import { queues, priorities, validatePriority } from './priorities'
import { queueTaskProcessing } from './processing'

const QUEUE = Symbol('task queue')

export class Queue {
  constructor (priority) {
    this.priority = validatePriority(priority)
    this[QUEUE] = new Set()
    queues[this.priority].push(this[QUEUE])
  }

  has (task) {
    return this[QUEUE].has(task)
  }

  add (task) {
    if (typeof task !== 'function') {
      throw new TypeError(
        `${task} can not be added to the queue. Only functions can be added.`
      )
    }
    const queue = this[QUEUE]
    queue.add(task)
    queueTaskProcessing(this.priority)
  }

  delete (task) {
    this[QUEUE].delete(task)
  }

  start () {
    const queue = this[QUEUE]
    const priorityQueues = queues[this.priority]
    if (priorityQueues.indexOf(queue) === -1) {
      priorityQueues.push(queue)
    }
  }

  stop () {
    const queue = this[QUEUE]
    const priorityQueues = queues[this.priority]
    const index = priorityQueues.indexOf(queue)
    if (index !== -1) {
      priorityQueues.splice(index, 1)
    }
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
