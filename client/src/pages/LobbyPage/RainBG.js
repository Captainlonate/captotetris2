import { useEffect, useState, useRef } from 'react'
import styled, { keyframes } from 'styled-components'
import { Logger } from '../../utils/Logger'

// Fall to the right
const rainAnimation_One = keyframes`
  100% {
    transform: translate(100px, 2000px);
  }
`

// Fall to the left
const rainAnimation_Two = keyframes`
  100% {
    transform: translate(-100px, 2000px);
  }
`

const Wrapper = styled.div.attrs({
  className: 'rain_bg',
})`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`

const Droplet = styled.div`
  left: ${({ leftX }) => leftX ?? '0'};
  top: ${({ topY }) => topY ?? '0'};
  position: absolute;
  z-index: 5;
  width: 2px;

  &.dropletStyleOne {
    /* background-color: rgb(107, 107, 174); */
    /* background-color: rgba(255, 255, 255, 0.3); */
    background-color: rgb(89 146 177);
    height: 40px;
    animation: ${rainAnimation_One} 1.9s linear infinite;
  }

  &.dropletStyleTwo {
    /* background-color: rgb(92, 95, 126); */
    /* background-color: rgba(255, 255, 255, 0.3); */
    background-color: rgb(89 146 177);
    height: 30px;
    animation: ${rainAnimation_Two} 1.5s linear infinite;
  }
`

const createDroplets = (domElRef) => {
  if (!domElRef.current) {
    Logger.error('Could not create rain. DomEl Ref not set.')
    return
  }

  const rainDroplets = []
  const numberOfDroplets = 40
  const screenWidth = domElRef.current.offsetWidth
  const screenHeight = domElRef.current.offsetHeight

  let toggle = 1
  for (let count = 0; count < numberOfDroplets; count++) {
    // Start it at a random x value on the screen
    let dropletX = Math.floor(Math.random() * (screenWidth + 1))
    // Start it at a random height (y value)
    // They all fall to the same height, but start at different heights
    let dropletY = Math.floor(Math.random() * (screenHeight + 1500)) + -1500
    toggle = toggle === 1 ? 0 : 1

    rainDroplets.push(
      <Droplet
        // id={`rainDroplet_${count}`}
        key={`rainDroplet_${count}`}
        leftX={`${dropletX}px`}
        topY={`${dropletY}px`}
        className={toggle === 1 ? 'dropletStyleOne' : 'dropletStyleTwo'}
      />
    )
  }

  return rainDroplets
}

const RainBG = () => {
  const [droplets, setDroplets] = useState([])
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (droplets.length === 0) {
      const rainDroplets = createDroplets(wrapperRef)
      setDroplets(rainDroplets)
    }
  }, [droplets])

  return <Wrapper ref={wrapperRef}>{droplets}</Wrapper>
}

export default RainBG
