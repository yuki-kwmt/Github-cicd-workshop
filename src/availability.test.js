import { describe, expect, it } from 'vitest'
import { formatAvailability } from './availability.js'

describe('formatAvailability', () => {
  it('空席数を表示する', () => {
    expect(formatAvailability(20, 12)).toBe('残り 8 席')
  })

  it('定員に達している場合は満席と表示する', () => {
    expect(formatAvailability(10, 10)).toBe('満席')
  })

  it('参加者数が定員を超えても負の空席数を表示しない', () => {
    expect(formatAvailability(10, 12)).toBe('満席')
  })
})
