import {
  TopPlank,
  BottomPlank,
  LeftPlank,
  RightPlank,
  TopPlankBehind,
  BottomPlankBehind,
  LeftPlankBehind,
  RightPlankBehind,
} from './styled'
import foregroundPlankImage from '../../../assets/images/plank_frame.png'
import backgroundPlankImage from '../../../assets/images/plank_frame_darker.png'

// ==============================================

const Planks = () => (
  <>
    {/* Foreground Planks */}
    <TopPlank src={foregroundPlankImage} />
    <BottomPlank src={foregroundPlankImage} />
    <LeftPlank src={foregroundPlankImage} />
    <RightPlank src={foregroundPlankImage} />
    {/* Background Planks */}
    <TopPlankBehind src={backgroundPlankImage} />
    <BottomPlankBehind src={backgroundPlankImage} />
    <LeftPlankBehind src={backgroundPlankImage} />
    <RightPlankBehind src={backgroundPlankImage} />
  </>
)

export default Planks
