import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import DatabaseSection from '../components/DatabaseSection.tsx'

describe('DatabaseSection', () => {
  it('renders without crashing', () => {
    render(<DatabaseSection />)
    // Add more specific tests here
  })
})
