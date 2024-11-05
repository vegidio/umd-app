import React, { useState } from 'react'
import { Button, LinearProgress, Stack, Typography } from '@mui/material'
import './DownloadRow.css'
import { useAppStore } from '../store'

export const DownloadRow = () => {
    const [progress, setProgress] = useState(50)

    const selectedMedia = useAppStore(state => state.selectedMedia)

    const handleDownloadClick = () => {}

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
                disabled={selectedMedia.length === 0}
                onClick={handleDownloadClick}
                sx={{ flex: 0.15 }}>
                Download
            </Button>
        </Stack>
    )
}
