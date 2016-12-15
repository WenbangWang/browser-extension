'use strict'

const styles = {
  'display': 'block',
  'position': 'fixed',
  'height': '100%',
  'width': '100%',
  'top': '0',
  'left': '0',
  'bottom': '0',
  'right': '0',
  'margin': '0',
  'clip': 'auto',
  'z-index': '9223372036854775807'
}
const body = document.getElementsByTagName('body')[0]

const iframe = document.createElement('iframe')

iframe.src = chrome.extension.getURL('index.html')

Object.keys(styles).forEach(key => iframe.style.setProperty(key, styles[key], 'important'))

body.appendChild(iframe)
