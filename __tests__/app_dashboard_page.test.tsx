import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import page from '../app/dashboard/page.tsx'

describe('page', () => {
  it('renders without crashing', () => {
    render(<page />)
    // Add more specific tests here
  })
})
