import { Close } from '@mui/icons-material';
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    FormGroup,
    IconButton,
} from '@mui/material';
import { type ChangeEvent, useState } from 'react';
import { useSettingsStore } from '../stores/settings';

type Props = {
    open: boolean;
    onClose: () => void;
};

export const DialogSettings = ({ open, onClose }: Props) => {
    const store = useSettingsStore();
    const [deepSearch, setDeepSearch] = useState(store.deepSearch);
    const [ignoreCache, setIgnoreCache] = useState(store.ignoreCache);
    const [enableTelemetry, setEnableTelemetry] = useState(store.enableTelemetry);

    const onSave = () => {
        store.setDeepSearch(deepSearch);
        store.setIgnoreCache(ignoreCache);
        store.setEnableTelemetry(enableTelemetry);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={(event, reason) => {
                if (reason !== 'backdropClick') {
                    onClose();
                }
            }}
            disableEscapeKeyDown
        >
            <DialogTitle sx={{ m: 0, p: 1.5 }} id="customized-dialog-title">
                Settings
            </DialogTitle>

            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={(theme) => ({
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: theme.palette.grey[500],
                })}
            >
                <Close />
            </IconButton>

            <DialogContent dividers>
                <FormGroup sx={{ rowGap: 2 }}>
                    <FormControlLabel
                        sx={{ alignItems: 'flex-start' }}
                        control={
                            <Checkbox
                                sx={{ m: 0, mr: 1, p: 0 }}
                                checked={deepSearch}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setDeepSearch(e.target.checked)}
                            />
                        }
                        label={
                            <>
                                <strong>Deep Search:</strong> expands the search of unknown URLs, attempting to discover
                                additional media files.
                            </>
                        }
                    />
                    <FormControlLabel
                        sx={{ alignItems: 'flex-start' }}
                        control={
                            <Checkbox
                                sx={{ m: 0, mr: 1, p: 0 }}
                                checked={ignoreCache}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setIgnoreCache(e.target.checked)}
                            />
                        }
                        label={
                            <>
                                <strong>Ignore Cache:</strong> this option will bypass previously cached URLs and always
                                fetch new ones.
                            </>
                        }
                    />
                    <FormControlLabel
                        sx={{ alignItems: 'flex-start' }}
                        control={
                            <Checkbox
                                sx={{ m: 0, mr: 1, p: 0 }}
                                checked={enableTelemetry}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setEnableTelemetry(e.target.checked)}
                            />
                        }
                        label={
                            <>
                                <strong>Enable Telemetry:</strong> this option will send anonymous data to help improve
                                the app.
                            </>
                        }
                    />
                </FormGroup>
            </DialogContent>

            <DialogActions>
                <Button color="error" onClick={onClose} sx={{ fontWeight: 'bold' }}>
                    Cancel
                </Button>
                <Button autoFocus onClick={onSave} sx={{ fontWeight: 'bold' }}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};
