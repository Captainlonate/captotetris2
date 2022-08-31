import styled from 'styled-components'

const BaseFGPlank = styled.img`
  position: absolute;
  z-index: 4;
`

const BaseBGPlank = styled.img`
  position: absolute;
  z-index: -3;
`

export const TopPlank = styled(BaseFGPlank)`
  top: -7%;
  left: -5%;
  width: 110%;
  height: 8%;
  transform: rotate3d(1, 1, 1, -3deg);
`

export const BottomPlank = styled(BaseFGPlank)`
  bottom: -7%;
  left: -5%;
  width: 110%;
  height: 8%;
  transform: rotate3d(1, 1, 1, -1deg);
`

export const LeftPlank = styled(BaseFGPlank)`
  bottom: -15%;
  left: -8%;
  width: 160%;
  height: 10%;
  transform: rotate3d(0, 0, 1, -92deg);
  transform-origin: top left;
`

export const RightPlank = styled(BaseFGPlank)`
  bottom: -14%;
  right: -12%;
  width: 160%;
  height: 10%;
  transform: rotate3d(0, 0, 1, 91deg);
  transform-origin: top right;
`

export const TopPlankBehind = styled(BaseBGPlank)`
  top: -6%;
  left: -9%;
  width: 115%;
  height: 12%;
  transform: rotate3d(1, 1, 1, -3deg);
`

export const BottomPlankBehind = styled(BaseBGPlank)`
  bottom: -7%;
  left: -14%;
  width: 125%;
  height: 12%;
  transform: rotate3d(0, 0, 1, 178deg);
`

export const LeftPlankBehind = styled(BaseBGPlank)`
  top: -6%;
  left: 8%;
  width: 160%;
  height: 13%;
  transform: rotate3d(0, 0, 1, 91deg);
  transform-origin: top left;
`

export const RightPlankBehind = styled(BaseBGPlank)`
  bottom: -17%;
  right: -10%;
  width: 160%;
  height: 12%;
  transform: rotate3d(0, 0, 1, 88deg);
  transform-origin: top right;
`
