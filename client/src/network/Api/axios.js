import axios from 'axios'

export const axiosConn = axios.create({
  baseURL: process.env.REACT_APP_URL_GAME,
})
