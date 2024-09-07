import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import _app from '../pages/_app.tsx'

describe('_app', () => {
  it('renders without crashing', () => {
    render(<_app />)
    // Add more specific tests here
  })
})
