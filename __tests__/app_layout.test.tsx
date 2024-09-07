import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import layout from '../app/layout.tsx'

describe('layout', () => {
  it('renders without crashing', () => {
    render(<layout />)
    // Add more specific tests here
  })
})
