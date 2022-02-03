import { render, screen } from '@testing-library/react';
import App from './App';

test('renders rotating image', () => {
  render(<App />);
  const linkElement = screen.getByAltText(/uploaded spinner/i);
  console.log(linkElement)
  //expect(linkElement).toBeInTheDocument();
});
