import React, { createContext, useReducer, useContext } from 'react'
import { appContextReducer, initialAppContextState } from './reducer'

export const AppContext = createContext({})

export const useAppContext = () => useContext(AppContext)

export const AppContextProvider = ({ children }) => {
  return (
    <AppContext.Provider value={useReducer(appContextReducer, initialAppContextState)}>
      {children}
    </AppContext.Provider>
  )
}

export const withAppContext = (WrappedComponent) => (props) => (
  <AppContextProvider>
    <WrappedComponent {...props} />
  </AppContextProvider>
)