import React from 'react'

//MUI:
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

//css:
import '../css/Frontpage.css'

//react-router-dom:
import {Link} from 'react-router-dom'
 
function Frontpage() {
  return (
    <div className='container' style={{margin: 100}}>
      <Stack spacing={2} direction="column">
        <Button LinkComponent={Link} id='register' to='/register' variant='contained'>Create account</Button>
        <Button LinkComponent={Link} id='login' to='/login' variant='outlined'>Log in</Button>
      </Stack>
    </div>
  )
}

export default Frontpage