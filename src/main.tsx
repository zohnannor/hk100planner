import { StrictMode } from 'react';
import * as React from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const root = document.getElementById('root')!;

React.createRoot(root).render(
    <StrictMode>
        <App />
    </StrictMode>
);
