export const priorities = {
  SYNC: 0,
  CRITICAL: 1,
  HIGH: 2,
  LOW: 3
}

export const queues = {
  [priorities.SYNC]: [],
  [priorities.CRITICAL]: [],
  [priorities.HIGH]: [],
  [priorities.LOW]: []
}
