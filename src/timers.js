let tickTask // tick means the next microtask
let rafTask // raf means the next animation frame (requestAnimationFrame)
let ricTask // ric means the next idle perdiod (requestIdleCallback)

const currentTick = Promise.resolve()

function getRaf () {
  return typeof requestAnimationFrame === 'function'
    ? requestAnimationFrame
    : setTimeout
}

function getRic () {
  return typeof requestIdleCallback === 'function'
    ? requestIdleCallback
    : getRaf()
}

// schedule a tick task, if it is not yet scheduled
export function nextTick (task) {
  if (!tickTask) {
    tickTask = task
    currentTick.then(runTickTask)
  }
}

function runTickTask () {
  const task = tickTask
  // set the task to undefined BEFORE calling it
  // this allows it to re-schedule itself for a later time
  tickTask = undefined
  task()
}

// schedule a raf task, if it is not yet scheduled
export function nextAnimationFrame (task) {
  if (!rafTask) {
    rafTask = task
    const raf = getRaf()
    raf(runRafTask)
  }
}

function runRafTask () {
  const task = rafTask
  // set the task to undefined BEFORE calling it
  // this allows it to re-schedule itself for a later time
  rafTask = undefined
  task()
}

// schedule a ric task, if it is not yet scheduled
export function nextIdlePeriod (task) {
  if (!ricTask) {
    ricTask = task
    const ric = getRic()
    ric(runRicTask)
  }
}

function runRicTask () {
  // do not run ric task if there are pending raf tasks
  // let the raf tasks execute first and schedule the ric task for later
  if (!rafTask) {
    const task = ricTask
    // set the task to undefined BEFORE calling it
    // this allows it to re-schedule itself for a later time
    ricTask = undefined
    task()
  } else {
    const ric = getRic()
    ric(runRicTask)
  }
}
