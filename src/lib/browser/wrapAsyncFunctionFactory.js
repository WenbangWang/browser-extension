export default browser => {
  return wrapAsyncFunction

  function wrapAsyncFunction (func, context) {
    return function asyncFunctionWrapper () {
      const args = [].slice.call(arguments)

      return new Promise((resolve, reject) => {
        func.apply(context, args.concat(makeCallback(resolve, reject)))
      })
    }
  }

  function makeCallback (resolve, reject) {
    return function callbackPromise () {
      if (browser.runtime.lastError) {
        reject(browser.runtime.lastError)
      } else {
        resolve.apply(null, arguments)
      }
    }
  }
}
