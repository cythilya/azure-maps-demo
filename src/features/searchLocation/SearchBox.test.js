import { render, screen } from '@testing-library/react';
import SearhBox from './SearhBox';

describe('SearchBox component test', () => {
  test('renders without crashing', () => {
    render(<SearhBox />);
    const textElement = screen.findByText(/Search.../i);
    expect(textElement).toBeTruthy();
  });
});
