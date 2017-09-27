export default wrapper

function wrapper (appStateRepository) {
  return {
    getOrDefaultLocale ({data}, sender, sendResponse) {
      return appStateRepository.getOrDefaultLocale(data.locale)
        .then(sendResponse)
    },
    getOrDefaultStoreState ({data}, sender, sendResponse) {
      return appStateRepository.getOrDefaultStoreState(data.storeState)
        .then(sendResponse)
    },
    setLocale ({data}) {
      appStateRepository.setLocale(data.locale)
    },
    setStoreState ({data}) {
      appStateRepository.setStoreState(data.storeState)
    }
  }
}
