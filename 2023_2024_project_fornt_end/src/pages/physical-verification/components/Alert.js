import { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

const SnackbarConsecutive = ({message,severity,setAlert}) => {

    const [open, setOpen] = useState(true)
    const handleClose = () => {setOpen(false);setAlert(false)}

  return (
    <>
      <Snackbar
        open={open}
        onClose={handleClose}
        autoHideDuration={2500}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          variant='filled'
          onClose={handleClose}
          className='w-full shadow-xs'
          severity={severity}
        >
        {message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default SnackbarConsecutive