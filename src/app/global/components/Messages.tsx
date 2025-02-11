import React from 'react'
import styled, { css } from 'styled-components'
import colors from '../styles/colors'
import sizes from '../styles/sizes'
import type { CommonType } from '../types/StyledType'

const { info } = colors
const { small } = sizes

const Message = styled.div<CommonType>`
  box-shadow: 2px 2px 5px ${info};
  color: ${info};
  font-size: ${small};
  padding: 7px 10px;
  text-align: center;
  border-radius: 2px;

  & + & {
    margin-top: 3px;
  }

  ${({ color }) =>
    color &&
    css`
      box-shadow: 2px 2px 5px ${colors[color] ?? info};
      color: ${colors[color] ?? info};
    `}
`

const Messages = ({
  children,
  color,
}: {
  children: string | string[]
  color?: string
}) => {
  if (!children) return <></>

  let messages = Array.isArray(children) ? children : [children]

  messages = messages.filter((s) => s && ('' + s)?.trim())
  if (messages.length === 0) return <></>

  return messages.map((message, i) => (
    <Message key={message + '_' + i} color={color}>
      {message}
    </Message>
  ))
}

export default React.memo(Messages)
