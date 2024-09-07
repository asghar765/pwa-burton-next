import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import registration from '../app/actions/registration.ts'

describe('registration', () => {
  it('renders without crashing', () => {
    render(<registration />)
    // Add more specific tests here
  })
})
