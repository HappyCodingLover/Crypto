import { AnyAction } from 'redux'
import { Token } from '../index'
import { persistFavorites } from '../services/preferencesService'

export const ADD_FAVORITE_TOKEN = 'ADD_FAVORITE_TOKEN'
export const REMOVE_FAVORITE_TOKEN = 'ADD_OR_REMOVE_FAVORITE_TOKEN'
export const SET_FAVORITES = 'SET_FAVORITES'

const add = (tokens: Token[], token: Token): Token[] => {
  const index = tokens.findIndex((t: Token) => t.id === token.id)

  if (index < 0) {
    tokens.push(token)
  }

  return tokens
}

const remove = (tokens: Token[], token: Token): Token[] => {
  const index = tokens.findIndex((t: Token) => t.id === token.id)

  if (index >= 0) {
    tokens.splice(index, 1)
  }

  return tokens
}

const favorites = (state: Token[] = [], action: AnyAction) => {
  let favoritesList

  switch (action.type) {
    case ADD_FAVORITE_TOKEN:
      favoritesList = add(state, action.token)
      persistFavorites(favoritesList)
      return favoritesList
    case REMOVE_FAVORITE_TOKEN:
      favoritesList = remove(state, action.token)
      persistFavorites(favoritesList)
      return favoritesList
    case SET_FAVORITES:
      return action.tokens
    default:
      return state
  }
}

export type FavoritesState = Token[]

export default favorites
