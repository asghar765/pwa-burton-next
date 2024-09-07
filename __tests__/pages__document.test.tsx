import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import _document from '../pages/_document.tsx'

describe('_document', () => {
  it('renders without crashing', () => {
    render(<_document />)
    // Add more specific tests here
  })
})
