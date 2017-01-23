'use strict'

describe('IFrameStateController', () => {
  const IFrameStateController = require('../../src/content-script/IFrameStateController')

  const id = 'id'
  const iframeBuilder = {
    build: () => {}
  }
  const document = {
    getElementById: () => {}
  }
  const body = {
    appendChild: () => {},
    removeChild: () => {}
  }
  const iframe = 'iframe'

  let iframeStateController

  beforeEach(() => {
    sinon.stub(document, 'getElementById')

    sinon.stub(body, 'appendChild')
    sinon.stub(body, 'removeChild')

    sinon.stub(iframeBuilder, 'build')
  })

  beforeEach(() => {
    iframeStateController = new IFrameStateController(id, iframeBuilder, document, body)
  })

  afterEach(() => {
    document.getElementById.restore()

    body.appendChild.restore()
    body.removeChild.restore()

    iframeBuilder.build.restore()
  })

  describe('exists', () => {
    it('should get element by the given id', () => {
      iframeStateController.exists()

      document.getElementById.should.have.been.calledWithExactly(id)
    })

    it('should return true if id exists in document', () => {
      document.getElementById.returns({})

      expect(iframeStateController.exists()).to.be.true
    })

    it('should return false if id does not exist in document', () => {
      document.getElementById.returns()

      expect(iframeStateController.exists()).to.be.false
    })
  })

  describe('show', () => {
    beforeEach(() => {
      sinon.stub(iframeStateController, 'exists')
    })

    it('should check the existence', () => {
      iframeStateController.show()

      iframeStateController.exists.should.have.been.called
    })

    describe('iframe does not exist', () => {
      beforeEach(() => {
        iframeStateController.exists.returns(false)
      })

      it('should build a new iframe', () => {
        iframeStateController.show()

        iframeBuilder.build.should.have.been.called
      })

      it('should append new created iframe to body', () => {
        iframeBuilder.build.returns(iframe)

        iframeStateController.show()

        body.appendChild.should.have.been.calledWithExactly(iframe)
      })
    })
  })

  describe('close', () => {
    beforeEach(() => {
      sinon.stub(iframeStateController, 'exists')
    })

    it('should check the existence', () => {
      iframeStateController.close()

      iframeStateController.exists.should.have.been.called
    })

    describe('iframe exists', () => {
      beforeEach(() => {
        iframeStateController.exists.returns(true)
      })

      it('should get element by the given id', () => {
        iframeStateController.close()

        document.getElementById.should.have.been.calledWithExactly(id)
      })

      it('should remove iframe from body', () => {
        document.getElementById.returns(iframe)

        iframeStateController.close()

        body.removeChild.should.have.been.calledWithExactly(iframe)
      })
    })
  })

  describe('toggle', () => {
    beforeEach(() => {
      sinon.stub(iframeStateController, 'exists')
      sinon.stub(iframeStateController, 'show')
      sinon.stub(iframeStateController, 'close')
    })

    it('should check the existence', () => {
      iframeStateController.toggle()

      iframeStateController.exists.should.have.been.called
    })

    it('should close it if iframe exists', () => {
      iframeStateController.exists.returns(true)

      iframeStateController.toggle()

      iframeStateController.close.should.have.been.called
    })

    it('should show it if iframe does not exist', () => {
      iframeStateController.exists.returns(false)

      iframeStateController.toggle()

      iframeStateController.show.should.have.been.called
    })
  })
})
