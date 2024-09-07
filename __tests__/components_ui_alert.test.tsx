import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import alert from '../components/ui/alert.tsx'

describe('alert', () => {
  it('renders without crashing', () => {
    render(<alert />)
    // Add more specific tests here
  })
})
