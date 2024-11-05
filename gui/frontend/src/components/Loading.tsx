import { FC } from 'react'
import { Backdrop, Box, CircularProgress, Stack, Typography } from '@mui/material'
import { useAppStore } from '../store'
import './Loading.css'

export const Loading = () => {
    const store = useAppStore()

    return (
        <Backdrop open={store.isLoading}>
            <Stack id="loading-box" spacing="1em">
                <CircularProgressWithLabel value={store.amountQuery} />

                <Typography color="textPrimary" variant="body2">
                    Querying media from <strong>{store.extractorName}</strong>...
                </Typography>
            </Stack>
        </Backdrop>
    )
}

type CircularProgressProps = {
    value: number
}

const CircularProgressWithLabel: FC<CircularProgressProps> = ({ value }) => {
    return (
        <Box id="circular-progress">
            <CircularProgress color="primary" size="5em" />
            <Typography position="absolute">{value}</Typography>
        </Box>
    )
}
