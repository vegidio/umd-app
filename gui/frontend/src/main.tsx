import React from 'react'
import { createRoot } from 'react-dom/client'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { LicenseInfo } from '@mui/x-license'
import App from './App'
import Events from './Events'

const container = document.getElementById('root')
const root = createRoot(container!)

const lightTheme = createTheme({
    palette: {
        mode: 'light'
    }
})

const darkTheme = createTheme({
    palette: {
        mode: 'dark'
    }
})

const licenseKey = import.meta.env.VITE_MUI_LICENSE
LicenseInfo.setLicenseKey(licenseKey)

root.render(
    <React.StrictMode>
        <ThemeProvider theme={lightTheme}>
            <Events />
            <CssBaseline />
            <App />
        </ThemeProvider>
    </React.StrictMode>
)
