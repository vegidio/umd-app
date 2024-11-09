import React, { useState } from 'react'
import { Button, LinearProgress, Stack, Typography } from '@mui/material'
import { StartDownload } from '../../wailsjs/go/main/App'
import { useAppStore } from '../store'
import './DownloadRow.css'

export const DownloadRow = () => {
    const store = useAppStore()

    const [progress, setProgress] = useState(50)

    const handleDownloadClick = async () => {
        await StartDownload(store.selectedMedia, '/Users/vegidio/Desktop', 5)
    }

    return (
        <Stack direction="row" spacing="1em">
            <Stack direction="row" spacing="1em" sx={{ flex: 0.85 }} alignItems="center">
                <LinearProgress variant="determinate" value={progress} sx={{ flex: 0.9 }} />
                <Typography variant="body2" sx={{ flex: 0.1 }}>
                    {progress}%
                </Typography>
            </Stack>

            <Button
                id="query"
                variant="contained"
                disabled={store.selectedMedia.length === 0}
                onClick={handleDownloadClick}
                sx={{ flex: 0.15 }}>
                Download
            </Button>
        </Stack>
    )
}
