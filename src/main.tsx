import './index.css';

import { StrictMode } from 'react';
import * as React from 'react-dom/client';

import App from './App.tsx';

const root = document.getElementById('root')!;

React.createRoot(root).render(
    <StrictMode>
        <App />
    </StrictMode>
);
