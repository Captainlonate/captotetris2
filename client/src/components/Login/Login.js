import { useState, useCallback } from 'react'
import styled from 'styled-components'

import { useSocketContext } from '../../context/SocketContext'
import { useAppContext } from '../../context/AppContext'
import { APP_INIT_STATUS, ACTION_TYPE } from '../../context/AppContext/reducer'
import { API } from '../../network/Api'
import * as localStore from '../../localStorage/localStorage'

// ===================================

const LoginPageWrapper = styled.div`
  background-color: #125860;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-image: linear-gradient(rgb(123 212 255), rgb(0 88 255));
`

const LoginFormContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`

const FormTitle = styled.h1`
  text-align: center;
  margin-top: 0;
  color: #0171e8;
  font-size: 40px;
`

const FormTextInput = styled.input.attrs({
  type: 'text',
})`
  border-radius: 5px;
  border: none;
  padding: 0.3em 0.75em;
  font-size: 30px;
  box-shadow: 0px 3px 5px 0px #9a9a9a;
  margin-bottom: 10px;
`

const FormPasswordInput = styled.input.attrs({
  type: 'password',
})`
  border-radius: 5px;
  border: none;
  padding: 0.3em 0.75em;
  font-size: 30px;
  box-shadow: 0px 3px 5px 0px #9a9a9a;
`

const FormErrorMessage = styled.div`
  color: red;
  padding: 10px 0;
  font-style: italic;
  text-align: center;
  font-weight: 600;
`

const FormSubmitButton = styled.button`
  background-color: rgb(2 112 232);
  color: white;
  border-radius: 5px;
  border: none;
  padding: 0.75em 1em;
  display: block;
  width: 100%;
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
  margin-top: 1em;
  font-size: 24px;
  box-shadow: 1px 3px 10px 1px #9a9a9a;

  &:hover {
    background-color: rgb(50, 147, 254);
    box-shadow: 1px 2px 5px 0px #218cff;
  }
  &:active {
    background-color: rgb(104, 174, 252);
  }

  &:disabled {
    background-color: #333333;
    &:hover {
      background-color: #333333;
      box-shadow: 1px 3px 10px 1px #9a9a9a;
    }
    cursor: not-allowed;
  }
`

const LoginModal = styled.div`
  border-radius: 5px;
  box-shadow: 2px 2px 10px #111111;
  background-color: #f9ffd3;
  padding: 3em;
`

// ===================================

const LoginPage = () => {
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
      setErrorMessage(loginResponse.errorMessage)
      setLoading(false)
      return
    }
    const meResponse = await API.Me(loginResponse.data)
    if (meResponse.isError) {
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
    <LoginPageWrapper>
      <LoginModal>
        <LoginFormContainer>
          <FormTitle>Sign Up/In</FormTitle>
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
      </LoginModal>
    </LoginPageWrapper>
  )
}

export default LoginPage
