import { ErrorTwoTone, ImageTwoTone, ListAlt, SmartDisplayTwoTone } from '@mui/icons-material'
import {
    Box,
    IconButton,
    Link,
    Popover,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Tooltip,
    Typography
} from '@mui/material'
import {
    DataGridPremium,
    type GridColDef,
    type GridLocaleText,
    type GridRowSelectionModel,
    type GridRowsProp
} from '@mui/x-data-grid-premium'
import { type ReactElement, useState } from 'react'
import { useAppStore } from '../store'
import './MediaList.css'
import { model } from '../../wailsjs/go/models'
import { BrowserOpenURL } from '../../wailsjs/runtime'
import Media = model.Media

const customLocaleText: Partial<GridLocaleText> = {
    footerRowSelected: count => `${count} media selected`,
    footerTotalRows: 'Total media found:',
    noRowsLabel: ''
}

export const MediaList = () => {
    const store = useAppStore()

    const columns: GridColDef[] = [
        { field: 'url', headerName: 'URL', flex: 0.65, renderCell: params => <LinkCell url={params.value} /> },
        { field: 'extension', headerName: 'Extension', flex: 0.1 },
        { field: 'type', headerName: 'Type', flex: 0.15, renderCell: params => <TypeCell type={params.value} /> },
        {
            field: 'metadata',
            headerName: 'Metadata',
            sortable: false,
            flex: 0.1,
            renderCell: params => <MetadataCell metadata={params.value} />
        }
    ]

    const rows: GridRowsProp = store.media.map((m, id) => {
        return { id, url: m.Url, extension: m.Extension, type: m.Type, metadata: m.Metadata }
    })

    const handleSelectionChange = (selected: GridRowSelectionModel) => {
        const selectedMedia = selected.map(s => store.media[s.valueOf() as number])
        store.setSelectedMedia(selectedMedia)
    }

    const handleSelectionModel = (selectedMedia: Media[]): number[] => {
        return store.selectedMedia.map(media => store.media.indexOf(media))
    }

    return (
        <DataGridPremium
            rows={rows}
            columns={columns}
            checkboxSelection={!store.isDownloading}
            disableRowSelectionOnClick
            density="compact"
            localeText={customLocaleText}
            rowSelectionModel={handleSelectionModel(store.selectedMedia)}
            onRowSelectionModelChange={handleSelectionChange}
        />
    )
}

const LinkCell = ({ url }: { url: string }) => {
    const handleClick = () => BrowserOpenURL(url)

    return (
        <Link href="#" onClick={handleClick}>
            {url}
        </Link>
    )
}

const TypeCell = ({ type }: { type: number }) => {
    let icon: ReactElement
    let label: ReactElement

    switch (type) {
        case 0:
            icon = <ImageTwoTone sx={{ color: '#e3d026' }} />
            label = <Typography variant="body2">Image</Typography>
            break
        case 1:
            icon = <SmartDisplayTwoTone color="secondary" />
            label = <Typography variant="body2">Video</Typography>
            break
        default:
            icon = <ErrorTwoTone color="error" />
            label = <Typography variant="body2">Unknown</Typography>
    }

    return (
        <Stack direction="row" alignItems="center">
            {icon}
            &nbsp;{label}
        </Stack>
    )
}

const MetadataCell = ({ metadata }: { metadata: [string: string] }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

    const handlePopoverOpen = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget)
    }

    const handlePopoverClose = () => {
        setAnchorEl(null)
    }

    const open = Boolean(anchorEl)

    return (
        <Box id="metadata">
            <Tooltip title="View metadata" arrow>
                <IconButton color="info" onClick={handlePopoverOpen}>
                    <ListAlt />
                </IconButton>
            </Tooltip>

            <Popover open={open} anchorEl={anchorEl} onClose={handlePopoverClose}>
                <Table size="small">
                    <TableBody>
                        {Object.entries(metadata).map(([key, value]) => (
                            <TableRow key={key}>
                                <TableCell>
                                    <strong>{key}</strong>
                                </TableCell>
                                <TableCell>{value}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Popover>
        </Box>
    )
}
