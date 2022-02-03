import { render, screen } from '@testing-library/react';
import App from './App';

test('renders rotating image', () => {
  render(<App />);
  const linkElement = screen.getByText(/uploaded spinner/i);
  expect(linkElement).toBeInTheDocument();
});
