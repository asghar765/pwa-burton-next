import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ExpenseModal from '../components/ExpenseModal.tsx'

describe('ExpenseModal', () => {
  it('renders without crashing', () => {
    render(<ExpenseModal />)
    // Add more specific tests here
  })
})
