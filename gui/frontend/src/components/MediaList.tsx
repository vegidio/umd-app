import React, { FC, ReactElement, useEffect, useState } from 'react'
import {
    DataGridPremium,
    GridColDef,
    GridLocaleText,
    GridRowSelectionModel,
    GridRowsProp
} from '@mui/x-data-grid-premium'
import { useAppStore } from '../store'
import { ErrorTwoTone, ImageTwoTone, SmartDisplayTwoTone } from '@mui/icons-material'
import { Stack, Typography } from '@mui/material'
import './MediaList.css'

const customLocaleText: Partial<GridLocaleText> = {
    footerRowSelected: count => `${count} media selected`,
    footerTotalRows: 'Total media found:',
    noRowsLabel: ''
}

export const MediaList = () => {
    const store = useAppStore()
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([])

    const columns: GridColDef[] = [
        { field: 'url', headerName: 'URL', flex: 0.65 },
        { field: 'extension', headerName: 'Extension', flex: 0.1 },
        { field: 'type', headerName: 'Type', flex: 0.15, renderCell: params => <TypeCell type={params.value} /> },
        { field: 'metadata', headerName: 'Metadata', flex: 0.1 }
    ]

    const rows: GridRowsProp = store.media.map((m, id) => {
        return { id, url: m.Url, extension: m.Extension, type: m.Type, metadata: '...' }
    })

    const handleSelectionChange = (selected: GridRowSelectionModel) => {
        const selectedMedia = selected.map(s => store.media[s.valueOf() as number])
        store.setSelectedMedia(selectedMedia)
    }

    useEffect(() => {
        const selectedIds = store.selectedMedia.map(media => store.media.indexOf(media))
        setRowSelectionModel(selectedIds)
    }, [store.selectedMedia, store.media])

    return (
        <DataGridPremium
            rows={rows}
            columns={columns}
            checkboxSelection
            density="compact"
            localeText={customLocaleText}
            rowSelectionModel={rowSelectionModel}
            onRowSelectionModelChange={handleSelectionChange}
        />
    )
}

const TypeCell: FC<{ type: number }> = ({ type }) => {
    let icon: ReactElement
    let label: ReactElement

    switch (type) {
        case 0:
            icon = <ImageTwoTone color="primary" />
            label = <Typography variant="body2">Image</Typography>
            break
        case 1:
            icon = <SmartDisplayTwoTone />
            label = <Typography variant="body2">Video</Typography>
            break
        default:
            icon = <ErrorTwoTone color="error" />
            label = <Typography variant="body2">Unknown</Typography>
    }

    return (
        <Stack direction="row" alignItems="center">
            {icon}
            &nbsp;{label}
        </Stack>
    )
}
