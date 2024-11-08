import { useEffect, useState } from 'react'
import { Alert, Snackbar } from '@mui/material'
import { useAppStore } from '../store'

export const ErrorMessage = () => {
    const errorMessage = useAppStore(state => state.errorMessage)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        console.log(errorMessage)
        setOpen(true)
    }, [errorMessage])

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <Snackbar open={open} autoHideDuration={errorMessage.slice(24).length * 100} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: '100%' }}>
                {errorMessage.slice(24)}
            </Alert>
        </Snackbar>
    )
}
