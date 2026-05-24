import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {store} from './redux/store'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.jsx'

import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   <Provider store={store}>        {/* 👈 Provider ANDAR */}
      <BrowserRouter> 
        <App />
      </BrowserRouter>
    </Provider> 
  </React.StrictMode>
);