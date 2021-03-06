import Evmt from './evmt'

let onSelect
let subscription1
let subscription2
let subscriptionValue1 = null
let subscriptionValue2 = null

const callbacks = {
  subscription1: (firstArg) => {
    subscriptionValue1 = firstArg
  },
  subscription2: (firstArg, secondArg) => {
    subscriptionValue2 = {[secondArg]: firstArg}
  }
}

const select = (...args) => {
  onSelect.emit(...args)
}

describe('Evmt', () => {
  beforeEach(() => {
    onSelect = new Evmt()
  })

  it('should be defined', () => {
    expect(Evmt).toBeDefined()
  })

  it('should be instance of Evmt', () => {
    expect(onSelect instanceof Evmt).toBe(true)
    expect(onSelect.subscriptions.length).toBe(0)
  })

  it('should have a subscription', () => {
    onSelect.subscribe(() => {})

    expect(onSelect.subscriptions.length).toBe(1)
  })

  describe('after subscribing some callbacks', () => {
    beforeEach(() => {
      spyOn(callbacks, 'subscription1').and.callThrough()
      spyOn(callbacks, 'subscription2').and.callThrough()

      onSelect = new Evmt()
      subscriptionValue1 = null
      subscriptionValue2 = null

      subscription1 = onSelect.subscribe(callbacks.subscription1)
      subscription2 = onSelect.subscribe(callbacks.subscription2)
    })

    it('should have subscriptions', () => {
      expect(onSelect.subscriptions.length).toBe(2)
    })

    it('should emit the subscribed callback', () => {
      const firstArg = 'hi'
      const secondArg = 'nail'

      select(firstArg, secondArg)

      expect(callbacks.subscription1).toHaveBeenCalled()
      expect(callbacks.subscription1).toHaveBeenCalledWith(firstArg, secondArg)
      expect(subscriptionValue1).toBe(firstArg)
      expect(callbacks.subscription2).toHaveBeenCalled()
      expect(callbacks.subscription2).toHaveBeenCalledWith(firstArg, secondArg)
      expect(JSON.stringify(subscriptionValue2)).toBe(JSON.stringify({[secondArg]: firstArg}))
    })

    it('should remove the subscriptions', () => {
      const firstArg = 127

      spyOn(onSelect, 'remove').and.callThrough()

      subscription2.remove()
      select(firstArg)
      subscription1.remove()
      select(firstArg)

      expect(onSelect.remove).toHaveBeenCalledTimes(2)
      expect(callbacks.subscription1).toHaveBeenCalledTimes(1)
      expect(callbacks.subscription1).toHaveBeenCalledWith(firstArg)
      expect(onSelect.subscriptions.length).toBe(0)
    })
  })
})
