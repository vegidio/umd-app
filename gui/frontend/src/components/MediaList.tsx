import React from 'react'
import { DataGridPremium, GridColDef, GridRowsProp } from '@mui/x-data-grid-premium'
import './MediaList.css'

export const MediaList = () => {
    const columns: GridColDef[] = [
        { field: 'url', headerName: 'URL', flex: 0.6 },
        { field: 'extension', headerName: 'Extension', flex: 0.1 },
        { field: 'type', headerName: 'Type', flex: 0.15 },
        { field: 'metadata', headerName: 'Metadata', flex: 0.1 }
    ]

    const rows: GridRowsProp = [
        { id: 1, url: 'Hello', extension: 'mp4', type: 'video', metadata: '...' },
        { id: 2, url: 'Hello', extension: 'mp4', type: 'video', metadata: '...' },
        { id: 3, url: 'Hello', extension: 'mp4', type: 'video', metadata: '...' },
        { id: 1, url: 'Hello', extension: 'mp4', type: 'video', metadata: '...' },
        { id: 2, url: 'Hello', extension: 'mp4', type: 'video', metadata: '...' },
        { id: 3, url: 'Hello', extension: 'mp4', type: 'video', metadata: '...' },
        { id: 1, url: 'Hello', extension: 'mp4', type: 'video', metadata: '...' },
        { id: 2, url: 'Hello', extension: 'mp4', type: 'video', metadata: '...' },
        { id: 3, url: 'Hello', extension: 'mp4', type: 'video', metadata: '...' },
        { id: 3, url: 'Hello', extension: 'mp4', type: 'video', metadata: '...' },
        { id: 1, url: 'Hello', extension: 'mp4', type: 'video', metadata: '...' },
        { id: 2, url: 'Hello', extension: 'mp4', type: 'video', metadata: '...' },
        { id: 3, url: 'Hello', extension: 'mp4', type: 'video', metadata: '...' },
        { id: 3, url: 'Hello', extension: 'mp4', type: 'video', metadata: '...' },
        { id: 1, url: 'Hello', extension: 'mp4', type: 'video', metadata: '...' },
        { id: 2, url: 'Hello', extension: 'mp4', type: 'video', metadata: '...' },
        { id: 3, url: 'Hello', extension: 'mp4', type: 'video', metadata: '...' },
        { id: 3, url: 'Hello', extension: 'mp4', type: 'video', metadata: '...' }
    ]

    return <DataGridPremium rows={rows} columns={columns} checkboxSelection density="compact" />
}
