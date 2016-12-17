'use strict'

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  // return true to indicate I want to send the response async
  // see https://developer.chrome.com/extensions/runtime#event-onMessage
  return true
})
