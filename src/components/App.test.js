import { render, screen } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
//import App from './App';

//test('renders rotating image', () => {
//  render(<App />);
//  const linkElement = screen.getByText(/uploaded spinner/i);
//  expect(linkElement).toBeInTheDocument();
//});

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
  });