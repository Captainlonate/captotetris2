import styled from 'styled-components'
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

export const LobbyPageWrapper = styled.div.attrs({
  className: 'LobbyPage',
})`
  position: absolute;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  background-color: lightblue;

  background: rgba(0, 0, 0, 0.3) url(${BGImage_simple_plants});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center bottom;
  background-blend-mode: darken;

  & * {
    box-sizing: border-box;
  }
`
// export const LobbyPageWrapper = styled.div`
//   position: absolute;
//   width: 100vw;
//   height: 100vh;
//   overflow: hidden;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   box-sizing: border-box;
//   background-color: lightblue;

//   & * {
//     box-sizing: border-box;
//   }
// `

export const CenteredContentBox = styled.div.attrs({
  className: 'LobbyPage__Content',
})`
  width: 75vw;
  height: 78vh;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  background-color: #ead6a7;
  box-shadow: 2px 2px 9px #111111;
  max-width: 900px;
  z-index: 10;
`

export const MainArea = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  flex: 1;
  padding: 12px;
`

export const TitleText = styled.h1`
  font-size: 42px;
  text-align: center;
  margin-top: 0;
  color: #489aca;
`

export const SinglePlayerButton = styled.button`
  padding: 12px;
  border: none;
  border-radius: 5px;
  width: 100%;
  background-color: #a556ff;
  color: white;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 1px;

  &:hover {
    background-color: #8b3ee2;
  }

  &:active {
    background-color: #6923b7;
  }
`
