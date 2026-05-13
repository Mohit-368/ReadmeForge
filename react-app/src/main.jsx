import './index.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ReadmeProvider } from './context/ReadmeContext.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ReadmeProvider>
        <App />
      </ReadmeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
