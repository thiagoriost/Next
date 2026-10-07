import { isAction, type Middleware } from 'redux'

export const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
    const result = next(action)
    console.log('localStorageMiddleware', {
      getState: store.getState(),
      store,
      action
    })

    if (isAction(action) && action.type === 'pokemons/toggleFavorite') {
      const { pokemonsReducer } = store.getState()
      localStorage.setItem('favorite-pokemons', JSON.stringify(pokemonsReducer))
    }

    return result
  }