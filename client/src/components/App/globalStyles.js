import { createGlobalStyle } from 'styled-components'

import TradeWindsFont from '../../assets/fonts/TradeWinds-Regular.ttf'

// ==============================================

export const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'TradeWinds';
    src: local('TradeWinds'), url(${TradeWindsFont});
  }

  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`
