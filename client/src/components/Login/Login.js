import { useState } from 'react'
import styled from 'styled-components'

import { useSocketContext } from '../../context/SocketContext'
import { useAppContext } from '../../context/AppContext'
import { APP_INIT_STATUS } from '../../context/AppContext/reducer'

// ===================================

const LoginPageWrapper = styled.div`
  background-color: #125860;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-image: linear-gradient(rgb(123 212 255),rgb(0 88 255));
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
  type: "text",
})`
  border-radius: 5px;
  border: none;
  padding: .3em .75em;
  font-size: 30px;
  box-shadow: 0px 3px 5px 0px #9a9a9a;
`

const FormSubmitButton = styled.button`
  background-color: rgb(2 112 232);
  color: white;
  border-radius: 5px;
  border: none;
  padding: .75em 1em;
  display: block;
  width: 100%;
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
  margin-top: 1em;
  font-size: 24px;
  box-shadow: 1px 3px 10px 1px #9a9a9a;
  &:hover {
    background-color: rgb(50 147 254);
    box-shadow: 1px 2px 5px 0px #218cff;
  }
  &:active {
    background-color: rgb(104 174 252);
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
  const [userName, setUserName] = useState('')
  const [, setAppState] = useAppContext()
  const socketConn = useSocketContext()

  const handleLogIn = () => {
    if (userName.trim().length > 0) {
      socketConn.auth = { username: userName }
      setAppState({ type: 'SET_APP_INIT_STATUS', payload: APP_INIT_STATUS.ATTEMPTING_LOG_IN })
      socketConn.connect()
    }
  }

  return (
    <LoginPageWrapper>
      <LoginModal>
        <LoginFormContainer>
          <FormTitle>Choose a Username</FormTitle>
          <FormTextInput value={userName} onChange={(e) => setUserName(e.target.value)} />
          <FormSubmitButton onClick={handleLogIn}>LOG IN</FormSubmitButton>
        </LoginFormContainer>
      </LoginModal>
    </LoginPageWrapper>
  )
}

export default LoginPage