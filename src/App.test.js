import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App setup', () => {
  test('Menu icon exists', () => {
    //Arrange
    render(<App />);

    //Act

    //Assert
    const iconElement = screen.getByTestId('menuicon');
    expect(iconElement).toBeInTheDocument();
  });
  
  test('Menu is opened when menu icon is clicked', () => {
    //Arrange
    render(<App />);
  
    //Act
    const iconElement = screen.queryByTestId('menuicon');
    fireEvent.click(iconElement);
  
    //Assert
    const linksElement1 = screen.getByTestId('menulinks');
    expect(linksElement1).toBeVisible();
  });
})
