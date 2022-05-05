import { useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import SocketContext from '../../context/SocketContext'

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

const WavesContainer = styled.div`
  .header {
    position:relative;
    text-align:center;
    background: linear-gradient(60deg, rgba(84,58,183,1) 0%, rgba(0,172,193,1) 100%);
    color:white;
  }

  .inner-header {
    height:65vh;
    width:100%;
    margin: 0;
    padding: 0;
  }

  .flex { /*Flexbox for containers*/
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .waves {
    position:relative;
    width: 100%;
    height:15vh;
    margin-bottom:-7px; /*Fix for safari gap*/
    min-height:100px;
    max-height:150px;
  }

  /* Animation */

  .parallax > use {
    animation: move-forever 25s cubic-bezier(.55,.5,.45,.5)     infinite;
  }
  .parallax > use:nth-child(1) {
    animation-delay: -2s;
    animation-duration: 7s;
  }
  .parallax > use:nth-child(2) {
    animation-delay: -3s;
    animation-duration: 10s;
  }
  .parallax > use:nth-child(3) {
    animation-delay: -4s;
    animation-duration: 13s;
  }
  .parallax > use:nth-child(4) {
    animation-delay: -5s;
    animation-duration: 20s;
  }
  @keyframes move-forever {
    0% {
      transform: translate3d(-90px,0,0);
    }
    25% {

    }
    100% { 
      transform: translate3d(85px,0,0);
    }
  }
  /*Shrinking for mobile*/
  @media (max-width: 768px) {
    .waves {
      height:40px;
      min-height:40px;
    }
    h1 {
      font-size:24px;
    }
  }
`

// ===================================

const SOCKET_EVENTS = {
  SESSION: 'session',
  USERS: 'users',
  USER_CONNECTED: 'user_connected',
  DISCONNECT: 'disconnect',
  USER_DISCONNECTED: 'user_disconnected',
  CONNECT: 'connect',
  CONNECT_ERROR: 'connect_error',
  CHALLENGE: 'challenge'
}

const LoginForm = () => {
  const [userName, setUserName] = useState('')
  const socketConn = useContext(SocketContext)

  const handleLogIn = () => {
    if (userName.trim().length > 0) {
      console.log("Logging In")
      socketConn.auth = { username: userName }
      socketConn.connect()
    }
  }

  return (
    <LoginFormContainer>
      <FormTitle>Choose a Username</FormTitle>
      <FormTextInput value={userName} onChange={(e) => setUserName(e.target.value)} />
      <FormSubmitButton onClick={handleLogIn}>LOG IN</FormSubmitButton>
    </LoginFormContainer>
  )
}

const LoginPage = () => {
  return (
    <LoginPageWrapper>
      <LoginModal>
        <LoginForm />
      </LoginModal>
    </LoginPageWrapper>
  )
}

const WavesLogin = () => {

  return (
    <LoginPageWrapper>
      <WavesContainer>
        <div className="header">
          <div className="inner-header flex"></div>

          <div>
            <svg className="waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
              <defs>
                <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
              </defs>
              <g className="parallax">
                <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7" />
                <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
                <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
                <use xlinkHref="#gentle-wave" x="48" y="7" fill="#fff" />
              </g>
            </svg>
          </div>

        </div>
      </WavesContainer>
    </LoginPageWrapper>
  )
}



export default LoginPage