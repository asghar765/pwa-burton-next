import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import CollectorsSection from '../components/CollectorsSection.tsx'

describe('CollectorsSection', () => {
  it('renders without crashing', () => {
    render(<CollectorsSection />)
    // Add more specific tests here
  })
})
