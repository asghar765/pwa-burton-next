import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ThemeProviderWrapper from '../components/ThemeProviderWrapper.tsx'

describe('ThemeProviderWrapper', () => {
  it('renders without crashing', () => {
    render(<ThemeProviderWrapper />)
    // Add more specific tests here
  })
})
