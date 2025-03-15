import './matchMediaMock';
import { render, screen } from '@testing-library/react';
import App from './App';

describe("App", () => {
  test('renders learn react link', async () => {
    render(<App/>);
    const linkElement = screen.getByText(/create react app/i);
    expect(linkElement).toBeInTheDocument();
  });
})