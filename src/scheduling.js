import { nextTick, nextAnimationFrame, nextIdlePeriod } from './timers'
import { queues, priorities } from './queues'

const TARGET_FPS = 60
const TARGET_INTERVAL = 1000 / TARGET_FPS

export function queueTaskProcessing (priority) {
  if (priority === priorities.CRITICAL) {
    nextTick(runQueuedCriticalTasks)
  } else if (priority === priorities.HIGH) {
    nextAnimationFrame(runQueuedHighTasks)
  } else if (priority === priorities.LOW) {
    nextIdlePeriod(runQueuedLowTasks)
  }
}

function runQueuedCriticalTasks () {
  // critical tasks must all execute before the next frame
  const criticalQueues = queues[priorities.CRITICAL]
  criticalQueues.forEach(processCriticalQueue)
}

function processCriticalQueue (queue) {
  queue.forEach(runTask)
  queue.clear()
}

function runQueuedHighTasks () {
  const startTime = performance.now()
  const isEmpty = processIdleQueues(priorities.HIGH, startTime)
  // there are more tasks to run in the next cycle
  if (!isEmpty) {
    nextAnimationFrame(runQueuedHighTasks)
  }
}

function runQueuedLowTasks () {
  const startTime = performance.now()
  const isEmpty = processIdleQueues(priorities.LOW, startTime)
  // there are more tasks to run in the next cycle
  if (!isEmpty) {
    nextIdlePeriod(runQueuedLowTasks)
  }
}

function processIdleQueues (priority, startTime) {
  const idleQueues = queues[priority]
  let isEmpty = true

  // if a queue is not empty after processing, it means we have no more time
  // the loop whould stop in this case
  for (let i = 0; isEmpty && i < idleQueues.length; i++) {
    const queue = idleQueues.shift()
    isEmpty = isEmpty && processIdleQueue(queue, startTime)
    idleQueues.push(queue)
  }
  return isEmpty
}

function processIdleQueue (queue, startTime) {
  const iterator = queue[Symbol.iterator]()
  let task = iterator.next()
  while (performance.now() - startTime < TARGET_INTERVAL) {
    if (task.done) {
      return true
    }
    runTask(task.value)
    queue.delete(task.value)
    task = iterator.next()
  }
}

export function runTask (task) {
  task()
}
