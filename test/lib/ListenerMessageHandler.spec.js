'use strict'

describe('ListenerMessageHandler', () => {
  const ListenerMessageHandler = require('../../src/lib/ListenerMessageHandler')

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
      expect(listenerMessageHandler.execute('blahblahblah')).to.be.false
    })

    it('should execute the command behavior with arguments', () => {
      listenerMessageHandler.execute(command, message, sender, sendResponse)

      behavior.should.have.been.calledWithExactly(message, sender, sendResponse)
    })

    it('should execute the command on context', () => {
      listenerMessageHandler.execute(command, message, sender, sendResponse)

      behavior.should.have.been.calledOn(listenerMessageHandler)
    })

    it('should return true if the command exists', () => {
      expect(listenerMessageHandler.execute(command, message, sender, sendResponse)).to.be.true
    })
  })

  describe('run', () => {
    beforeEach(() => {
      listenerMessageHandler.add(command, behavior)
    })

    it('should return false if message is falsey', () => {
      expect(listenerMessageHandler.run()).to.be.false
      expect(listenerMessageHandler.run(null)).to.be.false
    })

    it('should return false if message does not have a property of command', () => {
      expect(listenerMessageHandler.run({})).to.be.false
      expect(listenerMessageHandler.run({'not a command': command})).to.be.false
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
})
