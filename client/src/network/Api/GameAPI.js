import { axiosConn } from './axios'
import { makeApiCall } from './makeApiCall'
import Logger from '../../utils/Logger'

/*
  To keep api code organized, every api call will have a method
  on this class, but the actual implementation code can be
  in other files.
*/
export class GameAPI {
  constructor() {
    Logger.debug('Api::Created a new API object!')
  }

  async Login(username, password) {
    Logger.debug('Api::Trying to log in...')
    return await makeApiCall(() =>
      axiosConn.post(
        '/auth/login',
        {
          username,
          password,
        },
        { withCredentials: true }
      )
    )
  }

  async Me(jwtString) {
    Logger.debug('Api::Trying to get /me...')
    return await makeApiCall(() =>
      axiosConn.get(
        '/users/me',
        {
          headers: {
            Authorization: `Bearer ${jwtString}`,
          },
        },
        { withCredentials: true }
      )
    )
  }

  async GetAllUsers() {
    Logger.debug('Api::Fetching all users...')
    return await makeApiCall(() =>
      axiosConn.get('/users', null, { withCredentials: true })
    )
  }

  async GetRecentChats(jwtString) {
    Logger.debug('Api::Fetching recent chat messages')
    return await makeApiCall(() =>
      axiosConn.get(
        '/chats',
        {
          headers: {
            Authorization: `Bearer ${jwtString}`,
          },
        },
        { withCredentials: true }
      )
    )
  }

  async RenewJWT(jwtString) {
    Logger.debug('Api::Renewing JWT')
    return await makeApiCall(() =>
      axiosConn.post(
        '/auth/renewjwt',
        {
          headers: {
            Authorization: `Bearer ${jwtString}`,
          },
        },
        { withCredentials: true }
      )
    )
  }
}
