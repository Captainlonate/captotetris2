import styled from 'styled-components'

import { DFlexCenter } from '../../../components/Common'

// =================Styled Components====================

export const PlayerListContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  flex: 1;
  border-right: 1px solid black;
`
PlayerListContainer.displayName = 'PlayerListContainer'

export const PlayerListSectionHeader = styled.div`
  ${DFlexCenter}
  font-size: 22px;
  padding: 12px 4px;
`
PlayerListSectionHeader.displayName = 'PlayerListSectionHeader'
