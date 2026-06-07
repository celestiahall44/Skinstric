import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header image', () => {
  render(<App />);
  const headerImage = screen.getByAltText(/skintristic header/i);
  expect(headerImage).toBeInTheDocument();
});
