// navigator.userAgent isn't perfect and some devices allegedly
// produce "incorrect" values. But it's better than nothing
const checkIsMobile = () => (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
)

export default checkIsMobile
