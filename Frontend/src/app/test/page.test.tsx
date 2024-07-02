import { render } from '@testing-library/react'
import Page from './page'
import { describe } from 'node:test'
import '@testing-library/jest-dom/jest-globals';
import '@testing-library/jest-dom';
import React from 'react';

describe('Page', () => {
    it('renders page with correct text and link', () => {
        const { getByText } = render(<Page />);
        
        // Test for the main text
        const mainText = getByText('Hello this is the test page');
        expect(mainText).toBeInTheDocument();

        // Test for the link
        const linkElement = getByText('Click here to go to the Dashboard page');
        expect(linkElement).toBeInTheDocument();
        expect(linkElement.getAttribute('href')).toBe('/dashboard');
    })
})