/* global chrome */

'use strict'

/**
 * This module is intended to unify browser extension APIs for different browsers (chrome, firefox, safari and opera).
 * It should only export APIs being used.
 *
 *
 * For now, it only exposes chrome APIs.
 */
const self = module.exports

self.storage = chrome.storage
