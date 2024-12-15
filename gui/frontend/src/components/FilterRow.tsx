import React, { ChangeEvent, useEffect, useState } from 'react'
import { Button, Checkbox, FormControlLabel, InputAdornment, Stack, TextField } from '@mui/material'
import {
    Checklist,
    Folder,
    FolderOpen,
    Image,
    ImageOutlined,
    SmartDisplay,
    SmartDisplayOutlined
} from '@mui/icons-material'
import { model } from '../../wailsjs/go/models'
import { OpenDirectory } from '../../wailsjs/go/main/App'
import { useAppStore } from '../store'
import './FilterRow.css'
import Media = model.Media

export const FilterRow = () => {
    const store = useAppStore()

    const [filter, setFilter] = useState('')
    const [checkboxImage, setCheckboxImage] = useState(true)
    const [checkboxVideo, setCheckboxVideo] = useState(true)

    const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value)
    }

    const handleDirectoryChange = (e: ChangeEvent<HTMLInputElement>) => {
        store.setDirectory(e.target.value)
    }

    const handleDirectoryClick = async () => {
        const newDir = await OpenDirectory(store.directory)
        store.setDirectory(newDir)
    }

    const selectUnselect = (isOn: boolean, mType: number) => {
        if (isOn) {
            const selected = store.media.filter(media => media.Type === mType)

            const mergedSelected = [
                ...[...store.selectedMedia, ...selected]
                    .reduce((map, obj) => {
                        // In case of duplicates, objects from 'selected' persist over 'store.selectedMedia'
                        return map.set(obj.Url, obj)
                    }, new Map<string, Media>())
                    .values()
            ]

            store.setSelectedMedia(mergedSelected)
        } else {
            const selected = store.selectedMedia.filter(media => media.Type !== mType)
            store.setSelectedMedia(selected)
        }
    }

    useEffect(() => {
        const numImages = store.selectedMedia.filter(media => media.Type === 0).length
        setCheckboxImage(numImages > 0)

        const numVideos = store.selectedMedia.filter(media => media.Type === 1).length
        setCheckboxVideo(numVideos > 0)
    }, [store.selectedMedia])

    return (
        <Stack spacing="0.5em">
            <Stack direction="row" spacing="1em">
                <TextField
                    fullWidth
                    id="filter"
                    label="Filter by filename"
                    value={filter}
                    disabled={store.isDownloading}
                    size="small"
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Checklist />
                                </InputAdornment>
                            )
                        }
                    }}
                    onChange={handleFilterChange}
                    sx={{ flex: 0.85 }}
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={checkboxImage}
                            onClick={() => selectUnselect(!checkboxImage, 0)}
                            icon={<ImageOutlined />}
                            checkedIcon={<Image />}
                        />
                    }
                    disabled={store.isDownloading}
                    label="Images"
                    sx={{ flex: 0.075 }}
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={checkboxVideo}
                            onClick={() => selectUnselect(!checkboxVideo, 1)}
                            icon={<SmartDisplayOutlined />}
                            checkedIcon={<SmartDisplay />}
                        />
                    }
                    disabled={store.isDownloading}
                    label="Videos"
                    sx={{ flex: 0.075 }}
                />
            </Stack>

            <Stack direction="row" spacing="1em" style={{ marginTop: '0.75em' }}>
                <TextField
                    fullWidth
                    id="directory"
                    label="Save directory"
                    value={store.directory}
                    size="small"
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FolderOpen />
                                </InputAdornment>
                            )
                        }
                    }}
                    disabled={store.isDownloading}
                    onChange={handleDirectoryChange}
                    sx={{ flex: 0.85 }}
                />

                <Button
                    variant="outlined"
                    startIcon={<Folder />}
                    disabled={store.isDownloading}
                    onClick={handleDirectoryClick}
                    sx={{ flex: 0.15 }}>
                    Browse
                </Button>
            </Stack>
        </Stack>
    )
}
