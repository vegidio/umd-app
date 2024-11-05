import { Divider, Stack, Typography, useTheme } from '@mui/material'
import { useAppStore } from '../store'
import './InfoRow.css'

export const InfoRow = () => {
    const theme = useTheme()
    const store = useAppStore()

    return (
        <Stack
            id="info-bar"
            textAlign="center"
            direction="row"
            divider={<Divider orientation="vertical" />}
            sx={{ borderColor: theme.palette.divider, borderWidth: 1, borderStyle: 'solid' }}>
            <Typography variant="body2" sx={{ flex: 0.5 }}>
                Site name: <strong>{store.extractorName || '-'}</strong>
            </Typography>

            <Typography variant="body2" sx={{ flex: 0.5 }}>
                Source type: <strong>{store.extractorType || '-'}</strong>
            </Typography>
        </Stack>
    )
}
