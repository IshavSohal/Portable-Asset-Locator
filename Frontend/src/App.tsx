import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
    GcdsHeader,
    GcdsTopNav,
    GcdsNavLink,
} from '@cdssnc/gcds-components-react';

function App() {
    return (
        <div className='App'>
            <GcdsHeader langHref='#' skipToHref='#'>
                <GcdsTopNav
                    slot='menu'
                    label='Top navigation'
                    alignment='right'
                >
                    <GcdsNavLink href='#home' slot='home'>
                        Portable Asset Locator
                    </GcdsNavLink>
                    <GcdsNavLink href='#'>Why GC Notify</GcdsNavLink>
                    <GcdsNavLink href='#'>Contact us</GcdsNavLink>
                </GcdsTopNav>
            </GcdsHeader>

            <header className='App-header'>
                <img src={logo} className='App-logo' alt='logo' />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className='App-link'
                    href='https://reactjs.org'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
