import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AppProviders } from './context/index.tsx';

const rootElement = document.getElementById('interactiplay');
const idCampaign = rootElement?.getAttribute('data-campaign');
const idTestAB = rootElement?.getAttribute('data-testab');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <AppProviders>
        <App idCampaign={idCampaign} idTestAB={idTestAB} />
      </AppProviders>
    </StrictMode>,
  );
}
