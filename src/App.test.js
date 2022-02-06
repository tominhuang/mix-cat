import { render, screen } from '@testing-library/react'
import App from './App'

test('renders popular breeds text', () => {
    render(<App />)
    const linkElement = screen.getByText(/popular breeds/i)
    expect(linkElement).toBeInTheDocument()
})
