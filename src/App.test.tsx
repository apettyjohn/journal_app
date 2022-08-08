import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('app renders', () => {
    const view = render(<App />);
    expect(view).toBeTruthy();
});