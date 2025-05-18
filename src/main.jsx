import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'primereact/resources/themes/lara-light-blue/theme.css'; // Choose theme
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
	// <React.StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<App />
			</AuthProvider>
		</BrowserRouter>
	// </React.StrictMode>
)