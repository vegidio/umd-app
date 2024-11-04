import React from 'react'
import { DataGridPremium, GridColDef, GridRowsProp } from '@mui/x-data-grid-premium'
import { useAppStore } from '../store'
import './MediaList.css'

export const MediaList = () => {
    const media = useAppStore(state => state.media)

    const columns: GridColDef[] = [
        { field: 'url', headerName: 'URL', flex: 0.6 },
        { field: 'extension', headerName: 'Extension', flex: 0.1 },
        { field: 'type', headerName: 'Type', flex: 0.15 },
        { field: 'metadata', headerName: 'Metadata', flex: 0.1 }
    ]

    const rows: GridRowsProp = media.map((m, id) => {
        return { id, url: m.Url, extension: m.Extension, type: m.Type, metadata: '...' }
    })

    return <DataGridPremium rows={rows} columns={columns} checkboxSelection density="compact" />
}
