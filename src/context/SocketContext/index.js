import { createContext, useContext } from 'react'
import socket from '../../network/socketio'

export const SocketContext = createContext()

export const useSocketContext = () => useContext(SocketContext)

export const SocketContextProvider = ({ children }) => (
  <SocketContext.Provider value={socket}>
    {children}
  </SocketContext.Provider>
)

export const withSocketContext = (WrappedComponent) => (props) => (
  <SocketContextProvider>
    <WrappedComponent {...props} />
  </SocketContextProvider>
)