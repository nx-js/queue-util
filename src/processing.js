import { nextTick, nextIdlePeriod } from './timers'
import { queues, priorities } from './priorities'

const TARGET_FPS = 60
const TARGET_INTERVAL = 1000 / TARGET_FPS
let lastRun

export function queueTaskProcessing (priority) {
  if (priority === priorities.CRITICAL) {
    nextTick(runQueuedCriticalTasks)
  } else {
    nextIdlePeriod(runQueuedIdleTasks)
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

function runQueuedIdleTasks () {
  lastRun = lastRun || Date.now()

  let timeRemaining = processIdleQueues(priorities.HIGH)

  if (timeRemaining) {
    timeRemaining = processIdleQueues(priorities.LOW)
  }

  // if there is free time remaining there are no more tasks to run
  if (timeRemaining) {
    lastRun = undefined
  } else {
    nextIdlePeriod(runQueuedIdleTasks)
    lastRun = Date.now()
  }
}

function processIdleQueues (priority) {
  const idleQueues = queues[priority]
  let timeRemaining = true

  for (let i = 0; timeRemaining && i < idleQueues.length; i++) {
    const queue = idleQueues.shift()
    timeRemaining = timeRemaining && processIdleQueue(queue)
    idleQueues.push(queue)
  }
  return timeRemaining
}

function processIdleQueue (queue) {
  const iterator = queue[Symbol.iterator]()
  let task = iterator.next()
  while (Date.now() - lastRun < TARGET_INTERVAL) {
    if (task.done) {
      return true
    }
    // run the task
    runTask(task.value)
    queue.delete(task.value)
    task = iterator.next()
  }
}

function runTask (task) {
  task()
}
