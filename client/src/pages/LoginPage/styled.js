import styled, { keyframes } from 'styled-components'
import BGImage_treasure_map from '../../assets/images/treasure_map.png'
import BGImage_water_beautiful from '../../assets/images/water_beautiful.png'
import BGImage_bird from '../../assets/images/backgrounds/bird.png'
import BGImage_simple_plants from '../../assets/images/backgrounds/simple_plants.png'
import BGImage_fishbowl_4k from '../../assets/images/backgrounds/fishbowl_4k.png'
import BGImage_kitchen_4k from '../../assets/images/backgrounds/kitchen_4k.png'
import BGImage_stormy_sea from '../../assets/images/backgrounds/stormy_sea.png'
import BGImage_cartoon_sky from '../../assets/images/backgrounds/cartoon_sky.png'

import plankFrameImage from '../../assets/images/plank_frame.png'

// ===============Styled Components==============

const wiggleAnimation = keyframes`
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

export const LoginPageWrapper = styled.div`
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3) url(${BGImage_stormy_sea});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center bottom;
  background-blend-mode: darken;
`

export const LoginFormContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`

export const SpecialLetters = styled.span`
  color: ${({ coloredText }) => (coloredText ? '#339696' : 'white')};
  text-shadow: 3px 3px
    ${({ coloredText }) => (coloredText ? '#ffffff' : '#3b5656')};

  &.fall {
    animation-name: ${wiggleAnimation};
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

export const FormTitle = styled.h1`
  font-family: 'TradeWinds';
  text-align: center;
  margin-top: 0;
  color: white;
  font-size: 40px;
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
  font-size: 30px;
  box-shadow: 0px 3px 5px 0px #9a9a9a;
  margin-bottom: 15px;
  color: rgb(60 62 68);
  text-align: center;
`

export const FormPasswordInput = styled(FormTextInput).attrs({
  type: 'password',
})`
  margin-bottom: 0px;
`

export const FormErrorMessage = styled.div`
  color: red;
  padding: 10px 0;
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
  font-size: 24px;
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

export const LoginModal = styled.div`
  padding: 3em;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  box-shadow: -16px 11px 59px 5px rgb(154 154 154 / 30%);
`
