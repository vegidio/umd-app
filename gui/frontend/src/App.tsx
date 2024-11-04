import React from 'react'
import { Stack } from '@mui/material'
import { DownloadRow, FilterRow, InfoRow, MediaList, SearchBox } from './components'
import './App.css'

const App = () => {
    return (
        <Stack id="app" spacing="1em">
            <SearchBox />

            <InfoRow />

            <MediaList />

            <FilterRow />

            <DownloadRow />
        </Stack>
    )
}

export default App
