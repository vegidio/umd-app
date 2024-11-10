import { useEffect, useState } from 'react'
import { Alert, Snackbar } from '@mui/material'
import { useAppStore } from '../store'

export const Message = () => {
    const store = useAppStore()
    const [open, setOpen] = useState(false)
    const [duration, setDuration] = useState(5000)

    useEffect(() => {
        setDuration(Math.max(store.message.slice(24).length * 100, 5000))
        if (store.message.length > 0) setOpen(true)
    }, [store.message])

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <Snackbar open={open} autoHideDuration={duration} onClose={handleClose}>
            <Alert onClose={handleClose} severity={store.messageSeverity} variant="filled" sx={{ width: '100%' }}>
                {store.message.slice(24)}
            </Alert>
        </Snackbar>
    )
}
