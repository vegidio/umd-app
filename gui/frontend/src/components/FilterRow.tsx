import React, { ChangeEvent, useEffect, useState } from 'react'
import { Checkbox, FormControlLabel, Stack, TextField } from '@mui/material'
import { Image, ImageOutlined, SmartDisplay, SmartDisplayOutlined } from '@mui/icons-material'
import { useAppStore } from '../store'
import { model } from '../../wailsjs/go/models'
import Media = model.Media
import './FilterRow.css'

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
                    size="small"
                    onChange={handleFilterChange}
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
                    label="Images"
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
                    label="Videos"
                />
            </Stack>

            <Stack direction="row" spacing="1em">
                <TextField
                    fullWidth
                    id="directory"
                    label="Save directory"
                    value={store.directory}
                    size="small"
                    onChange={handleDirectoryChange}
                />
            </Stack>
        </Stack>
    )
}
