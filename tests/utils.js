const HEAVY_INTERVAL = 10
const originalRAF = window.requestAnimationFrame
const originalRIC = window.requestIdleCallback

export function spy (fn) {
  const spyFn = () => {
    fn()
    spyFn.callCount++
  }
  spyFn.callCount = 0
  return spyFn
}

export function beforeNextFrame () {
  const nextFrame =
    typeof requestAnimationFrame === 'function'
      ? requestAnimationFrame
      : setTimeout
  return new Promise(nextFrame)
}

export function heavyCalculation () {
  const start = Date.now()
  const parent = document.createElement('div')
  while (Date.now() - start < HEAVY_INTERVAL) {
    const child = document.createElement('div')
    parent.appendChild(child)
    parent.removeChild(child)
  }
  return Date.now() - start
}

export function removeRAF () {
  window.requestAnimationFrame = undefined
}

export function restoreRAF () {
  window.requestAnimationFrame = originalRAF
}

export function removeRIC () {
  window.requestIdleCallback = undefined
}

export function restoreRIC () {
  window.requestIdleCallback = originalRIC
}
