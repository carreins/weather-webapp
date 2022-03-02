import { render, screen } from '@testing-library/react';
import TravelSuggestion from "./TravelSuggestion";

describe('TravelSuggestion component', () => {
  test('Component info renders correctly', () => {

    //Arrange
    render(<TravelSuggestion city={"Test city"} population={30000} description={"Test description"}/>);

    //Act

    //Assert
    const headerElement = screen.queryByText('Test city', {selector: 'h3'});
    const spanElement = screen.queryByText('30000 Innbyggere', {selector: 'span'})
    const descElement = screen.queryByText('Test description', {selector: 'p'})
    expect(headerElement).toBeInTheDocument();
    expect(spanElement).toBeInTheDocument();
    expect(descElement).toBeInTheDocument();
  })

  test('Component weather info renders correctly', () => {

    //Arrange
    const weather_data = {
      friday: {
        min_temperature: 2.3,
        max_temperature: 4.5,
        icon: 'clearsky_day'
      },
      saturday: {
        min_temperature: 0.3,
        max_temperature: 1.5,
        icon: 'clearsky_day'
      },
      sunday: {
        min_temperature: 3,
        max_temperature: 4,
        icon: 'lightrain'
      }
    }
    render(<TravelSuggestion weather={weather_data}/>)

    //Act

    //Assert
    //Spans display correct temperatures
    const fridayElement = screen.queryByText('2.3 - 4.5 °C', {selector: 'span'})
    expect(fridayElement).toBeInTheDocument();
    const saturdayElement = screen.queryByText('0.3 - 1.5 °C', {selector: 'span'})
    expect(saturdayElement).toBeInTheDocument();
    const sundayElement = screen.queryByText('3 - 4 °C', {selector: 'span'})
    expect(sundayElement).toBeInTheDocument();

    //Weather icons have correct source
    const fridayImg = screen.queryByAltText('friday', {selector: 'img'})
    expect(fridayImg).toHaveAttribute('src', 'Icons/clearsky_day.svg')
    const saturdayImg = screen.queryByAltText('saturday', {selector: 'img'})
    expect(saturdayImg).toHaveAttribute('src', 'Icons/clearsky_day.svg')
    const sundayImg = screen.queryByAltText('sunday', {selector: 'img'})
    expect(sundayImg).toHaveAttribute('src', 'Icons/lightrain.svg')
  })
})