import styled from 'styled-components'

const VideoFillsContainer = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  z-index: -20;
  object-fit: cover;
  width: 100%;
  height: 100%;
`

const BackgroundVideo = ({ videoUrl }) => (
  <VideoFillsContainer playsinline autoPlay muted loop>
    <source src={videoUrl} type='video/mp4' />
  </VideoFillsContainer>
)

export default BackgroundVideo
