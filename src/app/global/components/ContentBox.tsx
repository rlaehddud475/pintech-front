'use client'
import { styled } from 'styled-components'
import colors from '../styles/colors'
import type { CommonType } from '../types/StyledType'
const { dark } = colors

export const MainContentBox = styled.section<CommonType>`
  max-width: ${({ max }) => max || 750}px;
  min-width: ${({ min }) => min || 650}px;
  margin: 50px auto;
  border-radius: 30px;
  padding: 50px;
  box-shadow: 2px 2px 10px ${dark};
`
