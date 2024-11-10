import React, { useEffect, useState } from 'react'
import { Button, LinearProgress, Stack, Typography } from '@mui/material'
import { StartDownload } from '../../wailsjs/go/main/App'
import { useAppStore } from '../store'
import './DownloadRow.css'

export const DownloadRow = () => {
    const store = useAppStore()

    const [progress, setProgress] = useState(0)
    const [buttonDisabled, setButtonDisabled] = useState(false)

    const handleDownloadClick = async () => {
        setButtonDisabled(true)

        setProgress(0)
        store.clearDownloads()
        const download = await StartDownload(store.selectedMedia, store.directory, 5)
        store.showMessage('Download completed', 'success')

        setButtonDisabled(false)
    }

    useEffect(() => {
        const percentage = (store.downloadedMedia.length * 100) / store.selectedMedia.length
        setProgress(isNaN(percentage) ? 0 : percentage)
    }, [store.downloadedMedia, store.selectedMedia])

    return (
        <Stack direction="row" spacing="1em">
            <Stack direction="row" spacing="1em" sx={{ flex: 0.85 }} alignItems="center">
                <LinearProgress variant="determinate" value={progress} sx={{ flex: 0.9 }} />

                <Typography variant="body2" sx={{ flex: 0.1 }}>
                    {progress.toFixed(1)}%
                </Typography>
            </Stack>

            <Button
                id="query"
                variant="contained"
                disabled={store.selectedMedia.length === 0 || buttonDisabled}
                onClick={handleDownloadClick}
                sx={{ flex: 0.15 }}>
                Download
            </Button>
        </Stack>
    )
}
