'use strict'

const body = document.getElementsByTagName('body')[0]

const iframe = document.createElement('iframe')

iframe.src = chrome.extension.getURL('index.html')

body.appendChild(iframe)
