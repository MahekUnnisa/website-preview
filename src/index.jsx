import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { completeOnboardOAuthCallback } from './lib/complete-onboard-oauth-callback';
import { subscribeOnboardOAuthResult } from './lib/onboard-oauth';
import './index.css';

subscribeOnboardOAuthResult(() => undefined);
void completeOnboardOAuthCallback();

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

