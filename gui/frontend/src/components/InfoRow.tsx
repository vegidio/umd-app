import { Divider, Stack, Typography, useTheme } from '@mui/material'
import './InfoRow.css'

export const InfoRow = () => {
    const theme = useTheme()

    return (
        <Stack
            id="info-bar"
            textAlign="center"
            direction="row"
            divider={<Divider orientation="vertical" />}
            sx={{ borderColor: theme.palette.divider, borderWidth: 1, borderStyle: 'solid' }}>
            <Typography variant="body2" sx={{ flex: 0.5 }}>
                Site name: <strong>Reddit</strong>
            </Typography>

            <Typography variant="body2" sx={{ flex: 0.5 }}>
                Source type: <strong>Subreddit</strong>
            </Typography>
        </Stack>
    )
}
