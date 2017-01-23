'use strict'

class IFrameBuilder {
  constructor (document) {
    this._document = document
  }

  setSrc (src) {
    this._src = src
    return this
  }

  setId (id) {
    this._id = id
    return this
  }

  setStyles (styles) {
    this._styles = styles
    return this
  }

  build () {
    const iframe = this._document.createElement('iframe')

    this._id && iframe.setAttribute('id', this._id)
    this._src && iframe.setAttribute('src', this._src)

    this._styles && Object.keys(this._styles).forEach(key => iframe.style.setProperty(key, this._styles[key], 'important'))

    return iframe
  }
}

module.exports = IFrameBuilder
