import { Backdrop, Box, CircularProgress, Stack, Typography } from '@mui/material';
import './Loading.css';
import { useAppStore } from '../stores/app';

export const Loading = () => {
    const store = useAppStore();

    return (
        <Backdrop open={store.isQuerying}>
            <Stack id="loading-box" spacing="1em">
                <CircularProgressWithLabel value={store.amountQuery} />

                <Typography color="textPrimary" variant="body2">
                    Querying media from <strong>{store.extractorName}</strong>...
                </Typography>
            </Stack>
        </Backdrop>
    );
};

type CircularProgressProps = {
    value: number;
};

const CircularProgressWithLabel = ({ value }: CircularProgressProps) => {
    return (
        <Box id="circular-progress">
            <CircularProgress color="primary" size="5em" />
            <Typography position="absolute">{value}</Typography>
        </Box>
    );
};
