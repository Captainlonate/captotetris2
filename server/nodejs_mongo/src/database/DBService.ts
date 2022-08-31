import mongoose from 'mongoose'
import { pick } from '../lib/utils'

import { UserModel, ChatModel } from './models'
import type { I_MDBUser, I_MDBChat } from './schema'

// ========================================================

type T_Result<T> = { data: T | null; error: string | null }

/**
 * You cannot provide a projection to ChatModel.create(),
 * Whenever the REST or websocket api exposes a chat message
 * object, the database object should first be 'normalized'
 * with this utility.
 */
export const chatMessageProjectionFields = [
  'author',
  'message',
  'createdAt',
  'id',
]
export const normalizeChatMessageForApi = pick(chatMessageProjectionFields)

// ========================================================

/**
 * DBService
 * Mongoose validation errors will crash the entire server application.
 * All Mongoose/database operations will be abstracted via this class.
 * This will ensure they always use try...catch, and make it easier
 * to switch to a different database later.
 */
class DBService {
  /**
   *
   * @param username
   * @returns
   */
  static async FindUserByUsername(username: string) {
    const result: T_Result<I_MDBUser> = { data: null, error: null }

    try {
      const alreadyExistingUser = await UserModel.findOne(
        { username },
        '-password'
      )
      result.data = alreadyExistingUser
    } catch (ex) {
      result.error =
        ex instanceof Error ? ex?.message : 'FindUserByUsername::MongoDB Error'
    }

    return result
  }

  /**
   *
   * @param username
   * @param password
   * @returns
   */
  static async CreateUser(username: string, password: string) {
    const result: T_Result<I_MDBUser> = { data: null, error: null }

    try {
      const newUserObj = await UserModel.create({
        username,
        password,
      })
      result.data = newUserObj
    } catch (ex) {
      result.error =
        ex instanceof Error ? ex?.message : 'CreateUser::MongoDB Error'
    }

    return result
  }

  /**
   *
   * @param username
   * @param password
   * @returns
   */
  static async FindAuthenticatedUser(username: string, password: string) {
    const result: T_Result<I_MDBUser> = { data: null, error: null }

    try {
      const user = await UserModel.findOne({ username, password }, '-password')
      result.data = user
    } catch (ex) {
      result.error =
        ex instanceof Error
          ? ex?.message
          : 'FindAuthenticatedUser::MongoDB Error'
    }

    return result
  }

  /**
   *
   * @param username
   * @param message
   * @returns
   */
  static async CreateChat(username: string, message: string) {
    const result: T_Result<I_MDBChat> = { data: null, error: null }

    try {
      const newChatObj = await ChatModel.create({
        author: username,
        message,
      })
      result.data = newChatObj
    } catch (ex) {
      result.error =
        ex instanceof Error ? ex?.message : 'CreateChat::MongoDB Error'
    }

    return result
  }

  /**
   *
   * @param limitPerPage
   * @param page
   * @param sort
   * @returns
   */
  static async GetRecentChats(
    limitPerPage: number = 30,
    page: number = 0,
    sort: string = 'desc'
  ) {
    const result: T_Result<I_MDBChat[]> = { data: null, error: null }

    try {
      const chatObjects = await ChatModel.find(
        {},
        null,
        // chatMessageProjectionFields.join(' '),
        {
          limit: limitPerPage,
          skip: page * limitPerPage,
          sort: { createdAt: sort },
        }
      )
      result.data = chatObjects
    } catch (ex) {
      result.error =
        ex instanceof Error ? ex?.message : 'CreateChat::MongoDB Error'
    }

    return result
  }

  /**
   *
   * @param id
   * @returns
   */
  static async GetUserById(id: string, projection: string = '-password') {
    const result: T_Result<I_MDBUser> = { data: null, error: null }

    try {
      const user = await UserModel.findOne({ id }, projection)
      result.data = user
    } catch (ex) {
      result.error =
        ex instanceof Error ? ex?.message : 'GetUserById::MongoDB Error'
    }

    return result
  }
}

export default DBService
