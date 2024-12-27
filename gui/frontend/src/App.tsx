import React, { useEffect } from 'react'
import { Stack } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { DownloadRow, FilterRow, InfoRow, Loading, MediaList, SearchBox } from './components'
import { GetHomeDirectory } from '../wailsjs/go/main/App'
import { useAppStore } from './store'
import './App.css'

const App = () => {
    const store = useAppStore()

    useEffect(() => {
        const getHomeDirectory = async () => {
            let dir = localStorage.getItem('lastDirectory')
            if (!dir) dir = await GetHomeDirectory()
            store.setDirectory(dir)
        }

        getHomeDirectory()
    }, [])

    return (
        <SnackbarProvider maxSnack={3}>
            <Stack id="app" spacing="1em">
                <SearchBox />

                <InfoRow />

                <MediaList />

                <FilterRow />

                <DownloadRow />
            </Stack>

            <Loading />
        </SnackbarProvider>
    )
}

export default App
