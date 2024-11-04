import React, { ChangeEvent, useState } from 'react'
import { Box, Checkbox, FormControlLabel, Stack, TextField } from '@mui/material'
import {
    Bookmark,
    BookmarkBorder,
    Favorite,
    FavoriteBorder,
    Image,
    ImageOutlined,
    Slideshow,
    SlideshowOutlined,
    SmartDisplay,
    SmartDisplayOutlined
} from '@mui/icons-material'
import './FilterRow.css'

export const FilterRow = () => {
    const [filter, setFilter] = useState('')
    const [directory, setDirectory] = useState('')
    const [checkboxImage, setCheckboxImage] = useState(true)
    const [checkboxVideo, setCheckboxVideo] = useState(true)

    const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value)
    }

    const handleDirectoryChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDirectory(e.target.value)
    }

    const handleImageClick = () => {
        setCheckboxImage(!checkboxImage)
    }

    const handleVideoClick = () => {
        setCheckboxVideo(!checkboxVideo)
    }

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
                            onClick={handleImageClick}
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
                            onClick={handleVideoClick}
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
                    value={directory}
                    size="small"
                    onChange={handleDirectoryChange}
                />
            </Stack>
        </Stack>
    )
}
