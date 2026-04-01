import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './Home';

describe('Home', () => {
  it('renders the hero heading', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: /Smart Student/i })).toBeTruthy();
  });
});
