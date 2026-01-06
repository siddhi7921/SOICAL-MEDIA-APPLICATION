import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { InternetIdentityProvider } from './hooks/useInternetIdentity';
import { initEditor } from './hooks/useEditor';
import App from './App';

import './index.css';

/* ================= QUERY CLIENT ================= */

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/* ================= INIT EDITOR SAFELY ================= */

const startEditor = () => {
  try {
    initEditor();
  } catch (error) {
    console.error('Editor init failed:', error);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startEditor, { once: true });
} else {
  startEditor();
}

/* ================= RENDER APP ================= */

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <InternetIdentityProvider>
        <App />
      </InternetIdentityProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

