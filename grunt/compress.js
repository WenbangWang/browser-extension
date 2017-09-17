'use strict'

module.exports = () => {
  return {
    options: {
      archive: './<%= build.path %>/extension.zip',
      mode: 'zip'
    },
    default: {
      files: [
        {
          src: '<%= manifest.path %>/**'
        }
      ]
    }
  }
}
