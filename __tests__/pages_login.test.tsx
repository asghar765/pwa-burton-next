import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import login from '../pages/login.tsx'

describe('login', () => {
  it('renders without crashing', () => {
    render(<login />)
    // Add more specific tests here
  })
})
