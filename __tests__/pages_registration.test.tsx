import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import registration from '../pages/registration.tsx'

describe('registration', () => {
  it('renders without crashing', () => {
    render(<registration />)
    // Add more specific tests here
  })
})
