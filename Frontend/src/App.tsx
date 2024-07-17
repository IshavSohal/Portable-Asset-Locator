import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import {
    GcdsHeader,
    GcdsTopNav,
    GcdsNavLink,
} from '@cdssnc/gcds-components-react';
import Dashboard from './pages/Dashboard';

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/dashboard' element={<Dashboard />} />
            </Routes>
        </Router>
    );
}

function Home() {
    return (
        <div className='App'>
            <GcdsHeader langHref='#' skipToHref='#'>
                <div slot="menu">
                <GcdsTopNav style={{fontSize:20}}
                    label='Top navigation'
                    alignment='right'
                >
                    <GcdsNavLink href='#home' slot='home'>
                        Portable Asset Locator
                    </GcdsNavLink>
                    <GcdsNavLink href='#'>Why GC Notify</GcdsNavLink>
                    <GcdsNavLink href='#'>Contact us</GcdsNavLink>
                </GcdsTopNav>
                </div>
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
