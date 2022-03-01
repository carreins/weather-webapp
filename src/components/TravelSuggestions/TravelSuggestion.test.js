import { render, screen } from '@testing-library/react';
import TravelSuggestion from "./TravelSuggestion";

describe('TravelSuggestion component', () => {
  test('Component renders correctly', () => {
    render(<TravelSuggestion city={"Test city"} population={30000} />);
    const headerElement = screen.queryByText('Test city', {selector: 'h3'});
    const spanElement = screen.queryByText('30000 Innbyggere', {selector: 'span'})
    expect(headerElement).toBeInTheDocument();
    expect(spanElement).toBeInTheDocument();
  });
})