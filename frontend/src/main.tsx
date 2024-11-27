import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <Auth0Provider
    domain="dev-jsmrqvab3vyr5osd.us.auth0.com"
    clientId="BQ7jPURr4cWx7U2D90FSn7MD5GldCD0e"
    authorizationParams={{
      redirect_uri: "http://localhost:5173/questionnaire"
    }}
  >
    <App />
  </Auth0Provider>,

)
