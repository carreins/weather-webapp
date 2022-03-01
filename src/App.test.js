import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('Menu icon exists', () => {
  render(<App />);
  const iconElement = screen.getByTestId('menuicon');
  expect(iconElement).toBeInTheDocument();
});

test('Menu is opened when menu icon is clicked', () => {
  render(<App />);

  const iconElement = screen.queryByTestId('menuicon');
  fireEvent.click(iconElement);

  const linksElement1 = screen.getByTestId('menulinks');
  expect(linksElement1).toBeVisible();
});
