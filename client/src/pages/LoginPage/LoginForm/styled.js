import styled, { keyframes } from 'styled-components'

// ===============Styled Components==============

const breakFallAnimation = keyframes`
  0%, 7% {
    transform: translateY(0) rotateZ(0);
  }
  15% {
    transform: translateY(0) rotateZ(5deg);
  }
  20% {
    transform: translateY(0) rotateZ(10deg);
  }
  25% {
    transform: translateY(2px) rotateZ(10deg);
  }
  50%, 54% {
    transform: translateY(8px) rotateZ(20deg);
  }
  58%, 100% {
    transform: translateY(45px) rotateZ(60deg);
  }
`

const scootOverAnimation = keyframes`
  0% {
    transform: translate(0px, 0px) rotateZ(0deg);
  }
  10%, 18% {
    transform: translate(-2px, 0px) rotateZ(0deg);
  }
  20% {
    transform: translate(-4px, -5px) rotateZ(-1deg);
  }
  25% {
    transform: translate(-7px, 2px) rotateZ(1deg);
  }
  30% {
    transform: translate(-10px, -4px) rotateZ(-2deg);
  }
  35% {
    transform: translate(-13px, 2px) rotateZ(2deg);
  }
  40% {
    transform: translate(-15px, -3px) rotateZ(-1deg);
  }
  45%, 80% {
    transform: translate(-19px, 2px) rotateZ(3deg);
  }
  81%, 100% {
    transform: translate(-19px, 4px) rotateZ(6deg);
  }
`

export const LoginFormContainer = styled.div.attrs({
  className: 'LoginPage__FormContainer',
})`
  padding: 3em;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  box-shadow: -16px 11px 59px 5px rgb(154 154 154 / 30%);
  display: flex;
  justify-content: center;
  flex-direction: column;

  font-size: 2.5vw;
  @media screen and (min-width: 500px) {
    font-size: 2.25vw;
  }
  @media screen and (min-width: 750px) {
    font-size: 2vw;
  }
  @media screen and (min-width: 1000px) {
    font-size: 20px;
  }
`
LoginFormContainer.displayName = 'LoginFormContainer'

export const SpecialLetters = styled.span`
  color: ${({ coloredText }) => (coloredText ? '#339696' : 'white')};
  text-shadow: 3px 3px
    ${({ coloredText }) => (coloredText ? '#ffffff' : '#3b5656')};

  &.fall {
    animation-name: ${breakFallAnimation};
    animation-duration: 8s;
    animation-iteration-count: 1;
    display: inline-block;
    animation-fill-mode: forwards;
  }

  &.scootOver {
    animation-name: ${scootOverAnimation};
    animation-duration: 3s;
    animation-delay: 5s;
    animation-iteration-count: 1;
    display: inline-block;
    animation-fill-mode: forwards;
  }
`

export const FormTitle = styled.h1.attrs({
  className: 'LoginPage__FormTitle',
})`
  font-family: 'TradeWinds';
  text-align: center;
  margin-top: 0;
  color: white;
  font-size: 2.5em;
  text-shadow: 3px 3px #3b5656;
  letter-spacing: 1px;
`

export const FormTextInput = styled.input.attrs({
  type: 'text',
})`
  font-family: 'TradeWinds';
  border-radius: 5px;
  border: none;
  padding: 0.3em 0.75em;
  font-size: 2em;
  box-shadow: 0px 3px 5px 0px #9a9a9a;
  color: rgb(60 62 68);
  text-align: center;

  & + & {
    margin-top: 0.8em;
  }
`

export const FormPasswordInput = styled(FormTextInput).attrs({
  type: 'password',
})``

export const FormErrorMessage = styled.div`
  color: red;
  padding: 0.75em 0;
  font-style: italic;
  text-align: center;
  font-weight: 600;
`

export const FormSubmitButton = styled.button`
  font-family: 'TradeWinds';
  color: white;
  border-radius: 5px;
  border: none;
  padding: 0.75em 1em;
  display: block;
  width: 100%;
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
  margin-top: 1.5em;
  font-size: 1.5em;
  background-color: rgb(51 150 150);

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
