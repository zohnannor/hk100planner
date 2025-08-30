import './index.css';

import { StrictMode } from 'react';
import React from 'react-dom/client';

import App from './App';

const root = document.getElementById('root')!;

React.createRoot(root).render(
    <StrictMode>
        <App />
    </StrictMode>
);
