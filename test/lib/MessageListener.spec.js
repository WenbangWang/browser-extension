'use strict'

describe('MessageListener', () => {
  const MessageListener = require('../../src/lib/MessageListener')
  const ListenerMessageHandler = require('../../src/lib/ListenerMessageHandler')

  const message = 'message'
  const sender = 'sender'
  const sendResponse = 'send response'

  let messageListener

  beforeEach(() => {
    messageListener = new MessageListener()
  })

  describe('addMessageHandler', () => {
    it('should throw an error if the argument is not an instance of ListenerMessageHandler', () => {
      expect(() => messageListener.addMessageHandler(() => {})).to.throw(Error)
    })

    it('should add handler to an array', () => {
      class TestListenerMessageHandler extends ListenerMessageHandler {}
      const testListenerMessageHandler = new TestListenerMessageHandler()

      messageListener.addMessageHandler(testListenerMessageHandler)

      expect(testListenerMessageHandler).to.be.oneOf(messageListener._messageHandlers)
    })
  })

  describe('listen', () => {
    const handler1 = {
      run: () => {}
    }
    const handler2 = {
      run: () => {}
    }

    beforeEach(() => {
      sinon.stub(handler1, 'run')
      sinon.stub(handler2, 'run')
    })

    beforeEach(() => {
      messageListener._messageHandlers.push(handler1)
      messageListener._messageHandlers.push(handler2)
    })

    afterEach(() => {
      handler1.run.restore()
      handler2.run.restore()
    })

    describe('first run returns true', () => {
      beforeEach(() => {
        handler1.run.returns(true)
      })

      it('should run first handler', () => {
        messageListener.listen(message, sender, sendResponse)

        handler1.run.should.have.been.calledWithExactly(message, sender, sendResponse)
      })

      it('should run first handler on context', () => {
        messageListener.listen(message, sender, sendResponse)

        handler1.run.should.have.been.calledOn(handler1)
      })

      it('should return true', () => {
        expect(messageListener.listen(message, sender, sendResponse)).to.be.true
      })

      it('should not run second handler when it returns false', () => {
        handler2.run.returns(false)

        messageListener.listen(message, sender, sendResponse)

        handler2.run.should.not.have.been.called
      })

      it('should not run second handler when it returns true', () => {
        handler2.run.returns(true)

        messageListener.listen(message, sender, sendResponse)

        handler2.run.should.not.have.been.called
      })
    })

    describe('first run returns false and second run returns true', () => {
      beforeEach(() => {
        handler1.run.returns(false)
        handler2.run.returns(true)
      })

      it('should run first handler', () => {
        messageListener.listen(message, sender, sendResponse)

        handler1.run.should.have.been.calledWithExactly(message, sender, sendResponse)
      })

      it('should run first handler on context', () => {
        messageListener.listen(message, sender, sendResponse)

        handler1.run.should.have.been.calledOn(handler1)
      })

      it('should run second handler', () => {
        messageListener.listen(message, sender, sendResponse)

        handler2.run.should.have.been.calledWithExactly(message, sender, sendResponse)
      })

      it('should run first handler on context', () => {
        messageListener.listen(message, sender, sendResponse)

        handler2.run.should.have.been.calledOn(handler2)
      })

      it('should return true', () => {
        expect(messageListener.listen(message, sender, sendResponse)).to.be.true
      })
    })
  })
})
