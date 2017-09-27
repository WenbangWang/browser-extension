import ListenerMessageHandler from '../../src/lib/ListenerMessageHandler'

describe('ListenerMessageHandler', () => {
  const command = 'command'
  const message = {command}
  const sender = 'sender'
  const sendResponse = 'send response'

  let behavior
  let listenerMessageHandler

  beforeEach(() => {
    behavior = sinon.stub()

    listenerMessageHandler = new ListenerMessageHandler()
  })

  describe('add', () => {
    it('should throw an exception if the behavior is not a function', () => {
      expect(() => listenerMessageHandler.add(123, 456)).to.throw(Error)
    })

    it('should add behavior with command to map', () => {
      listenerMessageHandler.add(command, behavior)

      expect(listenerMessageHandler._commandBehaviorMap).to.have.property(command, behavior)
    })

    it('should add behavior context', () => {
      const context = () => {}

      listenerMessageHandler.add(command, behavior, context)

      expect(listenerMessageHandler._commandContextMap).to.have.property(command, context)
    })

    it('should be chainable', () => {
      const anotherCommand = `${command}1`

      listenerMessageHandler.add(command, behavior).add(anotherCommand, behavior)

      expect(listenerMessageHandler._commandBehaviorMap).to.have.property(command, behavior)
      expect(listenerMessageHandler._commandBehaviorMap).to.have.property(anotherCommand, behavior)
    })
  })

  describe('execute', () => {
    beforeEach(() => {
      listenerMessageHandler.add(command, behavior, listenerMessageHandler)
    })

    it('should return false if the command does not exist', () => {
      expect(listenerMessageHandler.execute('blahblahblah')).to.be.false // eslint-disable-line no-unused-expressions
    })

    it('should execute the command behavior with arguments', () => {
      listenerMessageHandler.execute(command, message, sender, sendResponse)

      behavior.should.have.been.calledWithExactly(message, sender, sendResponse)
    })

    it('should execute the command on context', () => {
      listenerMessageHandler.execute(command, message, sender, sendResponse)

      behavior.should.have.been.calledOn(listenerMessageHandler)
    })

    it('should return the value command behavior returned if it is a boolean', () => {
      behavior.returns(false)

      expect(listenerMessageHandler.execute(command, message, sender, sendResponse)).to.be.false // eslint-disable-line no-unused-expressions
    })

    it('should return true by default', () => {
      expect(listenerMessageHandler.execute(command, message, sender, sendResponse)).to.be.true // eslint-disable-line no-unused-expressions
    })
  })

  describe('run', () => {
    beforeEach(() => {
      listenerMessageHandler.add(command, behavior)
    })

    it('should return false if message is falsey', () => {
      expect(listenerMessageHandler.run()).to.be.false // eslint-disable-line no-unused-expressions
      expect(listenerMessageHandler.run(null)).to.be.false // eslint-disable-line no-unused-expressions
    })

    it('should return false if message does not have a property of command', () => {
      expect(listenerMessageHandler.run({})).to.be.false // eslint-disable-line no-unused-expressions
      expect(listenerMessageHandler.run({'not a command': command})).to.be.false // eslint-disable-line no-unused-expressions
    })

    it('should execute command', () => {
      sinon.stub(listenerMessageHandler, 'execute')

      listenerMessageHandler.run(message, sender, sendResponse)

      listenerMessageHandler.execute.should.have.been.calledWithExactly(command, message, sender, sendResponse)
    })

    it('should return whatever execute command returns', () => {
      const result = 123
      sinon.stub(listenerMessageHandler, 'execute').returns(result)

      expect(listenerMessageHandler.run(message, sender, sendResponse)).to.equal(result)
    })
  })

  describe('static methods', () => {
    let behavior

    beforeEach(() => {
      behavior = sinon.spy()
    })

    describe('wrapBehaviorIntoSync', () => {
      it('should invoke the wrapped behavior with the given arguments on the given context', () => {
        const arg1 = 1
        const arg2 = 2
        const wrappedBehavior = ListenerMessageHandler.wrapBehaviorIntoSync(behavior)

        wrappedBehavior.call(this, arg1, arg2)

        behavior.should.have.been.calledOn(this)
        behavior.should.have.been.calledWithExactly(arg1, arg2)
      })

      it('should return false from the wrapped behavior', () => {
        const wrappedBehavior = ListenerMessageHandler.wrapBehaviorIntoSync(behavior)

        expect(wrappedBehavior()).to.be.false // eslint-disable-line no-unused-expressions
      })
    })
  })
})
