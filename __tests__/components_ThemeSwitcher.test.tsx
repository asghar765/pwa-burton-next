import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ThemeSwitcher from '../components/ThemeSwitcher.tsx'

describe('ThemeSwitcher', () => {
  it('renders without crashing', () => {
    render(<ThemeSwitcher />)
    // Add more specific tests here
  })
})
