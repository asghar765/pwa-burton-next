import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import MembersSection from '../components/MembersSection.tsx'

describe('MembersSection', () => {
  it('renders without crashing', () => {
    render(<MembersSection />)
    // Add more specific tests here
  })
})
