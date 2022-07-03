import { axiosConn } from "./axios"
import { makeApiCall } from "./makeApiCall"
import Logger from "../../Logger"

/*
  To keep api code organized, every api call will have a method
  on this class, but the actual implementation code can be
  in other files.
*/
export class GameAPI {
  constructor () {
    Logger.debug("Api::Created a new API object!")
  }

  async GetAllUsers () {
    Logger.debug("Api::Fetching all users...")
    return await makeApiCall(() => 
      axiosConn.get('/users', null, { withCredentials: true })
    )
  }

  async GetRecentChats () {
    Logger.debug('Api::Fetching recent chat messages')
    return await makeApiCall(() =>
      axiosConn.get('/chats', null, { withCredentials: true })
    )
  }
}
