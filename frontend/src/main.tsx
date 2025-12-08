import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'purecss/build/pure-min.css'
import 'purecss/build/grids-responsive-min.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
