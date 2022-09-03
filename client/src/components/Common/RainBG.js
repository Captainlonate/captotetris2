import { useEffect, useState, useRef } from 'react'
import styled, { keyframes } from 'styled-components'

import { Logger } from '../../utils/Logger'
import { AbsoluteFill } from './CommonStyles'

// ================KeyFrames=====================

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

// Flash colors
const lightningAnimation = keyframes`
  49% {
    background-color: rgba(0, 0, 0, 1);
  }
  50% {
    background-color: rgba(101, 100, 100, 1);
  }
  51% {
    background-color: rgba(0, 0, 0, 1);
  }	 		
  52% {
    background-color: rgba(161, 161, 161, 1);
  }
  53% {
    background-color: rgba(0, 0, 0, 1);
  }
`

// ================Styled Components=============

const RainBGWrapper = styled.div.attrs({
  className: 'RainBG',
})`
  ${AbsoluteFill}
  z-index: 3;
`
RainBGWrapper.displayName = 'RainBGWrapper'

const Lightning = styled.div.attrs({
  className: 'RainBG__Lightning',
})`
  ${AbsoluteFill}
  background-color: rgba(0, 0, 0, 1);
  animation: ${lightningAnimation} 15s linear infinite;
  opacity: 0.4;
`
Lightning.displayName = 'Lightning'

/**
 * It's important to use this approach to setting the left
 * and top. styled-components would create a css class for each
 * variant (hundreds of them).
 *
 * This approach will only create one variant.
 * The base class, and the base class + the css classes
 * I've defined.
 *
 * Also remember that styled-components WILL generate classes
 * even if you have commented code. It finds commented code
 * and generates classes.
 *
 * Even if you comment this out, styled-components will still
 * find it, and create hundreds of classes.
 * left: ${({ leftX }) => leftX ?? '0'};
 * top: ${({ topY }) => topY ?? '0'};
 */
const Droplet = styled.div.attrs((props) => ({
  className: 'RainBG__Droplet',
  style: {
    left: props.leftX ?? 0,
    top: props.topY ?? 0,
  },
}))`
  position: absolute;
  /* z-index on top of the Lightning */
  z-index: 5;
  width: 2px;
  &.RainBG__Droplet--StyleOne {
    background-color: rgb(89 146 177);
    height: 40px;
    animation: ${rainAnimation_One} 1.9s linear infinite;
  }

  &.RainBG__Droplet--StyleTwo {
    background-color: rgb(89 146 177);
    height: 30px;
    animation: ${rainAnimation_Two} 1.5s linear infinite;
  }
`
Droplet.displayName = 'Droplet'

// =================Utilities====================

const createDroplets = (containerElRef) => {
  const containerEl = containerElRef?.current
  if (!containerEl) {
    Logger.error('Could not create rain. DomEl Ref not set.')
    return
  }

  const rainDroplets = []
  const numberOfDroplets = 30
  const screenWidth = containerEl.offsetWidth
  const screenHeight = containerEl.offsetHeight

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
        key={`rainDroplet_${count}`}
        leftX={`${dropletX}px`}
        topY={`${dropletY}px`}
        className={
          toggle === 1
            ? 'RainBG__Droplet--StyleOne'
            : 'RainBG__Droplet--StyleTwo'
        }
      />
    )
  }

  return rainDroplets
}

// ==============================================

const RainBG = () => {
  const [droplets, setDroplets] = useState([])
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (droplets.length === 0) {
      const rainDroplets = createDroplets(wrapperRef)
      setDroplets(rainDroplets)
    }
  }, [droplets])

  return (
    <RainBGWrapper ref={wrapperRef}>
      {droplets}
      <Lightning />
    </RainBGWrapper>
  )
}

export default RainBG
