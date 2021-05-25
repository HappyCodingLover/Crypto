import { Settings, Token } from '../index'
import { deleteDuplicatedItem } from '../utils'
import {
  DEFAULT_GAS,
  DEFAULT_SLIPPAGE,
  dexGuruAPIUrl,
  SLIPPAGE_TAX_WHEN_FEES,
} from '../config/settings'
import { apiFetch } from '../dexguruFetch'

export const persistFavorites = (favorites: Token[]): void => {
  const updatedFavorites = favorites.map((favorite) => {
    return favorite?.id?.split('-')[1] === undefined ? favorite.id + '-eth' : favorite.id
  })
  const uniqueFavorites = deleteDuplicatedItem(updatedFavorites).filter((t) => !!t)
  localStorage.setItem('favorites', JSON.stringify(uniqueFavorites))
}

export const fetchFavorites = async (): Promise<Token[]> => {
  const favoriteIds: string[] = JSON.parse(localStorage.getItem('favorites') || '[]')
  return await getFavoritesFromApi(favoriteIds)
}

const getFavoritesFromApi = async (arrayOfFavoritesIds: string[]): Promise<Token[]> => {
  let favoritesTokens: Token[] = []
  await Promise.all(
    // TODO batch goes here
    arrayOfFavoritesIds.map(async (item: string) => {
      const response = await apiFetch(`${dexGuruAPIUrl}/tokens/${item}`, {
        mapErrorTo: { shouldMap: true, targetValue: favoritesTokens },
      })

      if (response) {
        favoritesTokens.push(response)
      }
    })
  )
  return favoritesTokens
}

export const setSettingsToLocalStorage = (settings: Partial<Settings>) => {
  localStorage.setItem('settings', JSON.stringify(settings))
}

export const getSettingsFromLocalStorage = () => {
  const storedSettings = localStorage.getItem('settings')

  if (!storedSettings) {
    const defaultSettings = {
      slippage: DEFAULT_SLIPPAGE,
      slippageWithFees: DEFAULT_SLIPPAGE + SLIPPAGE_TAX_WHEN_FEES,
      gasFee: DEFAULT_GAS,
      pushNotifications: true,
      priceChangesThreshold: '',
      liquidityChangesThreshold: '',
    }
    setSettingsToLocalStorage(defaultSettings)
    return defaultSettings
  }

  return JSON.parse(storedSettings)
}
