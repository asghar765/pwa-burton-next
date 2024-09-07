import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import FinanceSection from '../components/FinanceSection.tsx'

describe('FinanceSection', () => {
  it('renders without crashing', () => {
    render(<FinanceSection />)
    // Add more specific tests here
  })
})
