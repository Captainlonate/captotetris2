import { useRef, useEffect } from 'react'
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

const BackgroundVideo = ({ videoUrl, playbackSpeed = 1 }) => {
  const videoRef = useRef(null)

  useEffect(() => {
    // There is no attribute to adjust playback speed of
    // video tags, so it must be done in javascript.
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed
    }
  }, [playbackSpeed])

  return (
    <VideoFillsContainer playsinline autoPlay muted loop ref={videoRef}>
      <source src={videoUrl} type='video/mp4' />
    </VideoFillsContainer>
  )
}

export default BackgroundVideo
