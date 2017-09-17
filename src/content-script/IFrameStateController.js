export default class IFrameStateController {
  constructor (id, iframeBuilder, document, body) {
    this._id = id
    this._iframeBuilder = iframeBuilder
    this._document = document
    this._body = body
  }

  show () {
    if (this.exists()) {
      return
    }

    const iframe = this._iframeBuilder.build()
    this._body.appendChild(iframe)
  }

  close () {
    if (!this.exists()) {
      return
    }

    const iframe = this._document.getElementById(this._id)

    this._body.removeChild(iframe)
  }

  toggle () {
    if (this.exists()) {
      this.close()
    } else {
      this.show()
    }
  }

  exists () {
    const iframe = this._document.getElementById(this._id)

    return !!iframe
  }
}
