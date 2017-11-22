let nextTickQueued = false
let nextFrameQueued = false
let nextIdlePeriodQueued = false

const promise = Promise.resolve()
const requestFrame =
  typeof requestAnimationFrame === 'function'
    ? requestAnimationFrame
    : setTimeout
const requestIdlePeriod =
  typeof requestIdleCallback === 'function'
    ? requestIdleCallback
    : requestFrame

export function nextTick (task) {
  if (!nextTickQueued) {
    promise.then(() => {
      // set this before executing the task so the task can set it back to true if needed
      nextTickQueued = false
      task()
    })
    nextTickQueued = true
  }
}

export function nextAnimationFrame (task) {
  if (!nextFrameQueued) {
    requestFrame(() => {
      // set this before executing the task so the task can set it back to true if needed
      nextFrameQueued = false
      task()
    })
    nextFrameQueued = true
  }
}

export function nextIdlePeriod (task) {
  if (!nextIdlePeriodQueued) {
    requestIdlePeriod(() => {
      // set this before executing the task so the task can set it back to true if needed
      nextIdlePeriodQueued = false
      task()
    })
    nextIdlePeriodQueued = true
  }
}
