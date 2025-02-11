import styled, { css } from 'styled-components'
import { buttonColors } from '../styles/colors'
import sizes from '../styles/sizes'
import type { CommonType } from '../types/StyledType'

const { dark } = buttonColors
const { tiny, small, normal, medium, big, extra } = sizes

const commonStyle = css`
  background: ${dark[0]};
  border: 1px solid ${dark[0]};
  color: ${dark[1]};
  width: 100%;
  height: 35px;
  border-radius: 2px;
  & + & {
    margin-left: 3px;
  }
`

function changeColor(color: string) {
  const selected = color && buttonColors[color]
  let _css = ''
  if (selected) {
    _css = `
      background: ${selected[0]};
      color: ${selected[1]};
    `
    if (!['light', 'white'].includes(color)) {
      _css += `
        border-color: ${selected[0]};
      `
    }
  }

  return css`
    ${_css}
  `
}

export const TinyButton = styled.button<CommonType>`
  ${commonStyle}
  height: 18px;
  font-size: ${tiny};
  ${({ width }) =>
    width &&
    css`
      width: ${width}px;
    `}

  ${({ color }) => changeColor(color)}
`

export const SmallButton = styled.button<CommonType>`
  ${commonStyle}
  height: 25px;
  font-size: ${small};
  ${({ width }) =>
    width &&
    css`
      width: ${width}px;
    `}

  ${({ color }) => changeColor(color)}
`

export const Button = styled.button<CommonType>`
  ${commonStyle}
  font-size: ${normal};
  ${({ width }) =>
    width &&
    css`
      width: ${width}px;
    `}
  ${({ color }) => changeColor(color)}
`

export const MediumButton = styled.button<CommonType>`
  ${commonStyle}
  height: 45px;
  font-size: ${medium};
  ${({ width }) =>
    width &&
    css`
      width: ${width}px;
    `}

  ${({ color }) => changeColor(color)}
`

export const BigButton = styled.button<CommonType>`
  ${commonStyle}
  height: 55px;
  font-size: ${big};
  ${({ width }) =>
    width &&
    css`
      width: ${width}px;
    `}

  ${({ color }) => changeColor(color)}
`

export const ExtraButton = styled.button<CommonType>`
  ${commonStyle}
  height: 65px;
  font-size: ${extra};
  ${({ width }) =>
    width &&
    css`
      width: ${width}px;
    `}

  ${({ color }) => changeColor(color)}
`

export const ButtonGroup = styled.div<CommonType>`
  display: flex;
  width: 100%;

  button {
    width: 0;
    flex-grow: 1;

    & + & {
      margin-left: 3px;
    }
  }

  ${({ width }) =>
    width &&
    css`
      width: ${width};
    `}
`
