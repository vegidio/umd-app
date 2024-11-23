import React, { useEffect } from 'react'
import { Stack } from '@mui/material'
import { DownloadRow, FilterRow, InfoRow, Loading, MediaList, Message, SearchBox } from './components'
import { GetHomeDirectory } from '../wailsjs/go/main/App'
import './App.css'
import { useAppStore } from './store'

const App = () => {
    const store = useAppStore()

    useEffect(() => {
        const getHomeDirectory = async () => {
            const dir = await GetHomeDirectory()
            store.setDirectory(dir)
        }

        getHomeDirectory()
    }, [])

    return (
        <>
            <Stack id="app" spacing="1em">
                <SearchBox />

                <InfoRow />

                <MediaList />

                <FilterRow />

                <DownloadRow />
            </Stack>

            <Loading />

            <Message />
        </>
    )
}

export default App
