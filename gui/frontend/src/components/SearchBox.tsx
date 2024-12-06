import React, { ChangeEvent, useState } from 'react'
import {
    Button,
    Checkbox,
    FormControlLabel,
    InputAdornment,
    Stack,
    TextField,
    Tooltip,
    Typography
} from '@mui/material'
import { Public, Search } from '@mui/icons-material'
import { QueryMedia } from '../../wailsjs/go/main/App'
import { useAppStore } from '../store'
import './SearchBox.css'

export const SearchBox = () => {
    const store = useAppStore()
    const [url, setUrl] = useState('')
    const [limit, setLimit] = useState(99_999)
    const [checkboxDeep, setCheckboxDeep] = useState(true)

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

    const handleQueryClick = async () => {
        store.setIsQuerying(true)

        try {
            const media = await QueryMedia(url, limit, checkboxDeep)
            store.setMedia(media)
        } catch (e) {
            store.showMessage('Error querying the media from this URL', 'error')
        } finally {
            store.setIsQuerying(false)
        }
    }

    return (
        <Stack id="search-box" direction="row" spacing="1em">
            <TextField
                id="url"
                label="Enter a URL"
                value={url}
                size="small"
                disabled={store.isDownloading}
                autoComplete="off"
                autoCapitalize="off"
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <Public />
                            </InputAdornment>
                        )
                    }
                }}
                onChange={handleUrlChange}
                sx={{ flex: 0.68 }}
            />

            <Tooltip title={'Check to do a deep query'} sx={{ flex: 0.1 }}>
                <FormControlLabel
                    control={<Checkbox size="small" checked={checkboxDeep} disabled={store.isDownloading} />}
                    label={<Typography variant="caption">Deep</Typography>}
                    onClick={() => setCheckboxDeep(!checkboxDeep)}
                />
            </Tooltip>

            <TextField
                id="limit"
                label="Limit results"
                type="number"
                value={limit}
                disabled={store.isDownloading}
                size="small"
                onChange={handleLimitChange}
                sx={{ flex: 0.12 }}
            />

            <Button
                id="query"
                variant="outlined"
                startIcon={<Search />}
                disabled={url.trim() === '' || store.isDownloading}
                onClick={handleQueryClick}
                sx={{ flex: 0.12 }}>
                Query
            </Button>
        </Stack>
    )
}
