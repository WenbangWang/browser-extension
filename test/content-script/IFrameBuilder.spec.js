import IFrameBuilder from '../../src/content-script/IFrameBuilder'

describe('IFrameBuilder', () => {
  const id = 'id'
  const src = 'src'
  const styles = {
    key1: 'value1',
    key2: 'value2'
  }

  const document = {
    createElement: () => {}
  }
  const iframe = {
    setAttribute: () => {},
    style: {
      setProperty: () => {}
    }
  }

  let iFrameBuilder

  beforeEach(() => {
    sinon.stub(document, 'createElement').returns(iframe)

    sinon.stub(iframe, 'setAttribute')
    sinon.stub(iframe.style, 'setProperty')
  })

  beforeEach(() => {
    iFrameBuilder = new IFrameBuilder(document)
  })

  afterEach(() => {
    document.createElement.restore()
    iframe.setAttribute.restore()
    iframe.style.setProperty.restore()
  })

  describe('setId', () => {
    it('should set id', () => {
      iFrameBuilder.setId(id)

      expect(iFrameBuilder._id).to.equal(id)
    })

    it('should return same instance', () => {
      expect(iFrameBuilder.setId(id)).to.equal(iFrameBuilder)
    })
  })

  describe('setSrc', () => {
    it('should set src', () => {
      iFrameBuilder.setSrc(src)

      expect(iFrameBuilder._src).to.equal(src)
    })

    it('should return same instance', () => {
      expect(iFrameBuilder.setSrc(src)).to.equal(iFrameBuilder)
    })
  })

  describe('setStyles', () => {
    it('should set styles', () => {
      iFrameBuilder.setStyles(styles)

      expect(iFrameBuilder._styles).to.equal(styles)
    })

    it('should return same instance', () => {
      expect(iFrameBuilder.setStyles(styles)).to.equal(iFrameBuilder)
    })
  })

  describe('build', () => {
    it('should create an iframe element', () => {
      iFrameBuilder.build()

      document.createElement.should.have.been.calledWithExactly('iframe')
    })

    it('should set id if it exists', () => {
      iFrameBuilder.setId(id).build()

      iframe.setAttribute.should.have.been.calledWithExactly('id', id)
    })

    it('should not set id if it does not exists', () => {
      iFrameBuilder.build()

      iframe.setAttribute.should.not.have.been.calledWithExactly('id', id)
    })

    it('should set src if it exists', () => {
      iFrameBuilder.setSrc(src).build()

      iframe.setAttribute.should.have.been.calledWithExactly('src', src)
    })

    it('should not set src if it does not exists', () => {
      iFrameBuilder.build()

      iframe.setAttribute.should.not.have.been.calledWithExactly('src', src)
    })

    it('should set styles if it exists', () => {
      iFrameBuilder.setStyles(styles).build()

      Object.keys(styles).forEach(key => iframe.style.setProperty.should.have.been.calledWithExactly(key, styles[key], 'important'))
    })

    it('should not set styles if it does not exists', () => {
      iFrameBuilder.build()

      Object.keys(styles).forEach(key => iframe.style.setProperty.should.not.have.been.calledWithExactly(key, styles[key], 'important'))
    })

    it('should return built iframe', () => {
      expect(iFrameBuilder.build()).to.equal(iframe)
    })
  })
})
