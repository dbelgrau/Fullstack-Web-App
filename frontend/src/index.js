import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

/* TO DO

BD

wyszukiwarka memów
ranking wg +, komentarzy, ulubionych
powiadomienia - memy, komentarze
raportowanie komentarzy
admin - import, eksport danych z pliku
APOC

*/
