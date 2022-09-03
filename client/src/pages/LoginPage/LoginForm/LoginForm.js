import { useState, useCallback } from 'react'
import { toast } from 'react-toastify'

import Logger from '../../../utils/Logger'
import { API } from '../../../network/Api'
import * as localStore from '../../../localStorage/localStorage'
import { useSocketContext } from '../../../context/SocketContext'
import {
  useAppContext,
  APP_INIT_STATUS,
  ACTION_TYPE,
} from '../../../context/AppContext'
import {
  LoginFormContainer,
  FormTitle,
  FormTextInput,
  FormPasswordInput,
  FormErrorMessage,
  FormSubmitButton,
  SpecialLetters,
} from './styled'

// ==============================================

const LoginForm = () => {
  const [userName, setUserName] = useState('mammaw')
  const [password, setPassword] = useState('fake_password')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [, setAppCtxState] = useAppContext()
  const socketConn = useSocketContext()

  const attemptLogin = useCallback(async () => {
    if (userName.trim().length < 3 || password.trim().length < 3) {
      return
    }
    setLoading(true)
    const loginResponse = await API.Login(userName, password)
    if (loginResponse.isError) {
      toast(`Login Failed: "${loginResponse.errorMessage}"`)
      setErrorMessage(loginResponse.errorMessage)
      setLoading(false)
      return
    }

    const meResponse = await API.Me(loginResponse.data)
    if (meResponse.isError) {
      toast(`Could not retrieve your profile: "${meResponse.errorMessage}"`)
      Logger.error(meResponse.errorMessage)
      setErrorMessage(meResponse.errorMessage)
      setLoading(false)
      return
    }

    // Store the JWT in local storage
    localStore.setJWT(loginResponse.data)
    setAppCtxState({
      type: ACTION_TYPE.STATUS_AUTHENTICATED_NO_SOCKET,
      payload: {
        user: {
          userName: meResponse.data.username,
          id: meResponse.data._id,
          jwt: loginResponse.data,
        },
        appState: APP_INIT_STATUS.AUTHENTICATED_ATTEMPTING_SOCKET,
      },
    })

    socketConn.auth = { jwt: loginResponse.data }
    socketConn.connect()
  }, [userName, password, setAppCtxState, socketConn])

  return (
    <LoginFormContainer>
      <FormTitle>
        <SpecialLetters coloredText>C</SpecialLetters>apto
        <SpecialLetters coloredText className="fall">
          T
        </SpecialLetters>
        <SpecialLetters className="scootOver">etris</SpecialLetters>
      </FormTitle>
      <FormTextInput
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Username"
      />
      <FormPasswordInput
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {errorMessage && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
      <FormSubmitButton onClick={() => attemptLogin()} disabled={loading}>
        LOG IN
      </FormSubmitButton>
    </LoginFormContainer>
  )
}

export default LoginForm
