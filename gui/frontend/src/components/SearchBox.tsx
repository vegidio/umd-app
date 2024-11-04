import React, { ChangeEvent, useState } from 'react'
import { Button, Stack, TextField } from '@mui/material'
import './SearchBox.css'

export const SearchBox = () => {
    const [url, setUrl] = useState('')
    const [limit, setLimit] = useState(99_999)

    const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value)
    }

    const handleLimitChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === '') {
            setLimit(1)
            return
        }

        const value = parseInt(e.target.value)
        setLimit(value < 1 ? 1 : value)
    }

    const handleQueryClick = () => {}

    return (
        <Stack id="search-box" direction="row" spacing="1em">
            <TextField
                id="url"
                label="Enter a URL"
                value={url}
                size="small"
                onChange={handleUrlChange}
                sx={{ flex: 0.7 }}
            />

            <TextField
                id="limit"
                label="Limit results"
                type="number"
                value={limit}
                size="small"
                onChange={handleLimitChange}
                sx={{ flex: 0.15 }}
            />

            <Button
                id="query"
                variant="outlined"
                disabled={url.trim() === ''}
                onClick={handleQueryClick}
                sx={{ flex: 0.15 }}>
                Query
            </Button>
        </Stack>
    )
}
