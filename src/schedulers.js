let tickTask
let rafTask
let ricTask

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

export function nextTick (task) {
  if (!tickTask) {
    tickTask = task
    currentTick.then(runTickTask)
  }
}

function runTickTask () {
  const task = tickTask
  tickTask = undefined
  task()
}

export function nextAnimationFrame (task) {
  if (!rafTask) {
    rafTask = task
    const raf = getRaf()
    raf(runRafTask)
  }
}

function runRafTask () {
  const task = rafTask
  rafTask = undefined
  task()
}

export function nextIdlePeriod (task) {
  if (!ricTask) {
    ricTask = task
    const ric = getRic()
    ric(runRicTask)
  }
}

function runRicTask () {
  if (!rafTask) {
    const task = ricTask
    ricTask = undefined
    task()
  } else {
    const ric = getRic()
    ric(runRicTask)
  }
}
