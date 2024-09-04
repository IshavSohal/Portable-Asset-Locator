import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '@cdssnc/gcds-components-react/gcds.css';
import AuthProvider from './hooks/AuthProvider';

import {
  ChakraBaseProvider,
  extendBaseTheme,
  theme as chakraTheme,
} from '@chakra-ui/react';

const { Table, Link } = chakraTheme.components;

const theme = extendBaseTheme({
  components: {
    Table,
    Link,
  },
  fonts: {
    body: "'Noto Sans', sans-serif",
    heading: "'Lato', serif",
    mono: "'Noto Sans Mono', monospace",
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ChakraBaseProvider theme={theme}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ChakraBaseProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
