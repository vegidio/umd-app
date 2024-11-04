import {Stack, Typography} from "@mui/material";
import "./InfoBar.css";

export const InfoBar = () => {
    return (
        <Stack id="info-bar" textAlign="center" direction="row" spacing={2}>
            <Typography variant="body2" sx={{flex: 0.5}}>
                Site name: <strong>Reddit</strong>
            </Typography>

            <Typography variant="body2" sx={{flex: 0.5}}>
                Source type: <strong>Subreddit</strong>
            </Typography>
        </Stack>
    )
}