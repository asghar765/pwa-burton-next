import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import RegistrationsSection from '../components/RegistrationsSection.tsx'

describe('RegistrationsSection', () => {
  it('renders without crashing', () => {
    render(<RegistrationsSection />)
    // Add more specific tests here
  })
})
