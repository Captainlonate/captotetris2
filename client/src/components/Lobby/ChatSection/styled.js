import styled from 'styled-components'

export const ChatMessages = styled.div`
  flex: 1;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 20px 20px 20px 0;
`

export const ChatMessageItem = styled.div`
  flex: 1;
  display: flex;
  padding: 10px;
  align-items: center;
`

export const ChatUserName = styled.div`
  font-weight: bold;
  flex: 0 0 auto;
`

export const ChatMessageBubble = styled.div`
  flex: 1;
  border-radius: 10px;
  padding: 5px 10px;
  margin-left: 10px;
  background-color: #fff8e7;
  font-size: 0.9em;
`

export const ChatInputBox = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  padding: 10px;
`

export const ChatInput = styled.input`
  font-size: 18px;
  padding: 6px;
  border-radius: 5px;
  border: 0;
  flex: 1;
  display: block;
`