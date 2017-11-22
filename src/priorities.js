export const priorities = {
  CRITICAL: 0,
  HIGH: 1,
  LOW: 2
}
const validPriorities = new Set([0, 1, 2])

export const queues = {
  [priorities.CRITICAL]: [],
  [priorities.HIGH]: [],
  [priorities.LOW]: []
}

export function validatePriority (priority) {
  if (!validPriorities.has(priority)) {
    throw new Error(`Invalid queue priority: ${priority}.`)
  }
  return priority
}
