import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Piano } from './components/Piano'

// PWA registration
import { registerSW } from 'virtual:pwa-register'

registerSW({
  immediate: true,
  onNeedRefresh() {
    // We could show a toast here - for now just console log
    console.log('New content available, please refresh.')
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Piano />
  </StrictMode>,
)
