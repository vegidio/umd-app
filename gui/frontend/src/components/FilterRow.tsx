import {
    Checklist,
    CloudDownload,
    FolderOpen,
    Image,
    ImageOutlined,
    SmartDisplay,
    SmartDisplayOutlined,
} from '@mui/icons-material';
import { Button, Checkbox, FormControlLabel, InputAdornment, Stack, TextField } from '@mui/material';
import React, { type ChangeEvent, useEffect, useState } from 'react';
import { OpenDirectory } from '../../wailsjs/go/main/App';
import './FilterRow.css';
import { useAppStore } from '../stores/app';
import { Download } from './Download';

export const FilterRow = () => {
    const store = useAppStore();

    const [filter, setFilter] = useState('');
    const [checkboxImage, setCheckboxImage] = useState(false);
    const [checkboxVideo, setCheckboxVideo] = useState(false);
    const [startDownload, setStartDownload] = useState(false);

    const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value);
    };

    const handleDirectoryChange = (e: ChangeEvent<HTMLInputElement>) => {
        store.setDirectory(e.target.value);
    };

    const handleDirectoryClick = async () => {
        const newDir = await OpenDirectory(store.directory);
        store.setDirectory(newDir);
    };

    const handleDownloadClick = () => {
        setStartDownload(true);
    };

    useEffect(() => {
        const selected = store.media.filter((media) => {
            return (
                (filter.length > 0 && media.Url.toLowerCase().includes(filter.toLowerCase())) ||
                (checkboxImage && media.Type === 0) ||
                (checkboxVideo && media.Type === 1)
            );
        });

        store.setSelectedMedia(selected);
    }, [checkboxImage, checkboxVideo, filter, store.setSelectedMedia, store.media]);

    return (
        <>
            <Stack spacing="0.5em">
                <Stack direction="row" spacing="1em">
                    <TextField
                        fullWidth
                        id="filter"
                        label="Filter by URL"
                        value={filter}
                        autoComplete="off"
                        autoCapitalize="off"
                        size="small"
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Checklist />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        onChange={handleFilterChange}
                        sx={{ flex: 0.85 }}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={checkboxImage}
                                onClick={() => setCheckboxImage(!checkboxImage)}
                                icon={<ImageOutlined />}
                                checkedIcon={<Image />}
                            />
                        }
                        label="Images"
                        sx={{ flex: 0.075 }}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={checkboxVideo}
                                onClick={() => setCheckboxVideo(!checkboxVideo)}
                                icon={<SmartDisplayOutlined />}
                                checkedIcon={<SmartDisplay />}
                            />
                        }
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
                                ),
                            },
                        }}
                        onClick={handleDirectoryClick}
                        sx={{ flex: 0.85 }}
                    />

                    <Button
                        id="query"
                        variant="contained"
                        startIcon={<CloudDownload />}
                        onClick={handleDownloadClick}
                        disabled={store.selectedMedia.length === 0}
                        sx={{ flex: 0.15 }}
                    >
                        Download
                    </Button>
                </Stack>
            </Stack>

            {startDownload && <Download open={true} onClose={() => setStartDownload(false)} />}
        </>
    );
};
