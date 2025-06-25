import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store,persistor } from './Store/Store.ts'
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
      <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
)
