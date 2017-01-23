'use strict'

class ContentScriptDelegator {
  constructor (browser) {
    this._browser = browser
  }

  delegateToTab (tab, message, sendResponse) {
    this._browser.tabs.sendMessage(tab.id, message, sendResponse)
  }

  delegateToCurrentActiveTab (message, sender, sendResponse) {
    this._browser.tabs.query({
      active: true,
      currentWindow: true
    }, tabs => {
      this.delegateToTab(tabs[0], message, sendResponse)
    })
  }
}

module.exports = ContentScriptDelegator
