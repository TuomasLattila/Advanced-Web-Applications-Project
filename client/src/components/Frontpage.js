import React from 'react'

//Components:
import NavBar from './NavBar';
import AcountInfo from './AcountInfo';


//MUI:
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

//css:
import '../css/Frontpage.css'

//react-router-dom:
import {Link} from 'react-router-dom'
 
function Frontpage() {
  if (localStorage.getItem('token')) {
    return <NavBar Component={AcountInfo} /> //Returns the profile component, becuase token is found
  }

  return (
    <div className='container' style={{margin: 110, display: 'flex', justifyContent: 'center'}}>
      <Stack spacing={2} direction="column" flex='auto' maxWidth='700px'>
        <Button LinkComponent={Link} id='register' to='/register' variant='contained'>Create account</Button>
        <Button LinkComponent={Link} id='login' to='/login' variant='outlined'>Log in</Button>
      </Stack>
    </div>
  )
}

export default Frontpage