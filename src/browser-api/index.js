/* global chrome */

/**
 * This module is intended to centralize browser extension APIs for different browsers (chrome, firefox, safari and opera).
 * It should only export APIs being used.
 *
 *
 * For now, it only exposes chrome APIs.
 */
const self = {}

// Content script only has access to these APIs.
self.storage = chrome.storage
self.runtime = chrome.runtime
self.extension = chrome.extension
self.i18n = chrome.i18n

// Only accessible to background script.
self.tabs = chrome.tabs
self.browserAction = chrome.browserAction

export default self
