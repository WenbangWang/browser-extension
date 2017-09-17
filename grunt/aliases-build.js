'use strict'

module.exports = () => {
  return {
    build: [
      'clean:manifest',
      'clean:build',
      'env:prod',
      'webpack:extension-prod',
      'webpack:script-prod',
      'manifest:prod',
      'compress'
    ]
  }
}
