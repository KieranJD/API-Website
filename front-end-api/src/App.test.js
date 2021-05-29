/**
 * A module to set-up react testing.
 * @module app-test
 * @author Kieran Dhir
 */

import { render, screen, fireEvent } from '@testing-library/react';
 
import App from './App';
import Home from './components/home';
 
describe('App', () => {
  test('renders unauthenticated navbar', () => {
    render(<App />);

    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByText(/Home/)).toBeInTheDocument();
    expect(screen.getByText(/Register/)).toBeInTheDocument();
    expect(screen.getByText(/Login/)).toBeInTheDocument();
    expect(screen.queryByText(/Favourites/)).toBeNull();
    expect(screen.queryByText(/Upload/)).toBeNull();
    expect(screen.queryByText(/Logout/)).toBeNull();
  });

  test('renders footer', () => {
    render(<App />);
 
    expect(screen.getByText(/Canine Shelter Footer/)).toBeInTheDocument();

  });

});


describe('Home', () => {
  test('renders title and subtitle', () => {
    render(<Home />);

    expect(screen.getByText('Canine Shelter')).toBeInTheDocument();
    expect(screen.getByText('Welcome to the Canine Shelter!')).toBeInTheDocument();
  });
  
  test('allows search', () => {
    render(<Home />);
 
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'JavaScript' },
    });
 
  });

});
