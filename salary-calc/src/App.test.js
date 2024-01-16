import { render, screen } from '@testing-library/react';
import App from './App';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

test('page is not empty', () => {
  const { container } = render(<App />);
  expect(container.firstChild).not.toBeNull();
})
