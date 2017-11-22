import { expect } from 'chai'
import { beforeNextFrame, heavyCalculation } from './utils'
import { Queue, priorities } from '@nx-js/queue-util'

describe('Queue processing', () => {
  it('should throw on invalid priority argument', () => {
    expect(() => new Queue()).to.throw(Error)
    expect(() => new Queue(null)).to.throw(Error)
    expect(() => new Queue(priorities.CRITICAL)).to.not.throw()
    expect(() => new Queue(priorities.HIGH)).to.not.throw()
    expect(() => new Queue(priorities.LOW)).to.not.throw()
  })
})
