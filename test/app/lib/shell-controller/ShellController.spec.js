import ShellController from '../../../../src/app/lib/shell-controller/ShellController'

describe('ShellController', () => {
  const runtimeMessagingClient = {
    postSync () {}
  }
  const ShellControlCommand = {
    CLOSE: 'close'
  }

  let shellController

  beforeEach(() => {
    shellController = new ShellController(runtimeMessagingClient, ShellControlCommand)
  })

  beforeEach(() => {
    sinon.stub(runtimeMessagingClient, 'postSync')
  })

  afterEach(() => {
    runtimeMessagingClient.postSync.restore()
  })

  describe('close', () => {
    it('should post close command synchronously', () => {
      shellController.close()

      runtimeMessagingClient.postSync.should.have.been.calledWithExactly(ShellControlCommand.CLOSE)
    })
  })
})
