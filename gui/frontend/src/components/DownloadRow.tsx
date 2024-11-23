import React, { useEffect, useState } from 'react'
import { Button, LinearProgress, Stack, Typography } from '@mui/material'
import { CloudDownload } from '@mui/icons-material'
import { StartDownload } from '../../wailsjs/go/main/App'
import { useAppStore } from '../store'
import './DownloadRow.css'

export const DownloadRow = () => {
    const store = useAppStore()

    const handleDownloadClick = async () => {
        store.setIsDownloading(true)
        store.setProgress(0)
        store.clearDownloads()

        await StartDownload(store.selectedMedia, store.directory, 5)

        store.showMessage('Download completed', 'success')
        store.setIsDownloading(false)
    }

    useEffect(() => {
        const percentage = (store.downloadedMedia.length * 100) / store.selectedMedia.length
        store.setProgress(isNaN(percentage) ? 0 : percentage)
    }, [store.downloadedMedia])

    return (
        <Stack direction="row" spacing="1em">
            <Stack direction="row" spacing="1em" sx={{ flex: 0.85 }} alignItems="center">
                <LinearProgress variant="determinate" value={store.progress} sx={{ flex: 0.9 }} />

                <Typography variant="body2" sx={{ flex: 0.1 }}>
                    {store.progress.toFixed(1)}%
                </Typography>
            </Stack>

            <Button
                id="query"
                variant="contained"
                startIcon={<CloudDownload />}
                disabled={store.selectedMedia.length === 0 || store.isDownloading}
                onClick={handleDownloadClick}
                sx={{ flex: 0.15 }}>
                Download
            </Button>
        </Stack>
    )
}
