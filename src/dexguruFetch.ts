import { dexGuruAPIUrl } from './config/settings'

interface Options {
  expectJson?: boolean
  expectText?: boolean
  mapErrorTo?: { shouldMap: boolean; targetValue?: any } // not ideal but can't pass undefined otherwise
  onError?: (response: any) => void
  init?: any
}

const defaultOptions = {
  expectJson: true,
  expectText: false,
  mapErrorTo: { shouldMap: false, targetValue: undefined },
  onError: (_response: any) => {},
  init: undefined,
}

/**
 * Universal fetcher for the whole app. ATM logic is quite simple:
 *
 * - Centralized error handling in the way the webapp commonly used => Return a value on case of error
 * - Offer an onError callback for custom error handling
 * - Centralize https://api.dex.guru/v1 calls (good place to introduce auth)
 *
 * Future features:
 *  - JWT handling (ideally using some auth service)
 *  - Centralized caching (if needed)
 *  - Proxying redux/localStorage updates
 *
 * Although this fetcher is expected to have more features...
 * please keep it simple by delegating to other services and potential callbacks
 *
 * @param url the URL to fetch
 * @param options @see {@link Options}
 */
export const apiFetch = async (url: string, options: Options = defaultOptions) => {
  const mergedOptions = { ...defaultOptions, ...options }

  if (url.startsWith(dexGuruAPIUrl)) {
    // TODO add jwt auth here
  }

  try {
    const response = await fetch(url, mergedOptions.init)

    if (!response.ok) {
      // console.error('http request failed', { status: response.status, url })

      if (mergedOptions.onError) {
        mergedOptions.onError(response)
        return null
      }

      if (mergedOptions.mapErrorTo?.shouldMap) {
        return mergedOptions.mapErrorTo?.targetValue
      }
    }

    if (response.status === 204) {
      return
    }

    if (mergedOptions.expectText) {
      return response.text()
    } else if (mergedOptions.expectJson) {
      return response.json()
    } else {
      return response
    }
  } catch (err) {
    console.error('dexguruFetch has failed', { err, url })
  }
}
