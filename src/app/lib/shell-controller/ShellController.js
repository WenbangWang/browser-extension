export default class ShellController {
  /**
   *
   * @param {RuntimeMessagingClient} runtimeMessagingClient
   * @param {ShellControlCommand} ShellControlCommand
   * @constructor
   */
  constructor (runtimeMessagingClient, ShellControlCommand) {
    this.runtimeMessagingClient = runtimeMessagingClient
    this.ShellControlCommand = ShellControlCommand
  }

  /**
   * To close the shell of the app.
   */
  close () {
    this.runtimeMessagingClient.postSync(this.ShellControlCommand.CLOSE)
  }
}
