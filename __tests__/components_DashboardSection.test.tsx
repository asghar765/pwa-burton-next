import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import DashboardSection from '../components/DashboardSection.tsx'

describe('DashboardSection', () => {
  it('renders without crashing', () => {
    render(<DashboardSection />)
    // Add more specific tests here
  })
})
