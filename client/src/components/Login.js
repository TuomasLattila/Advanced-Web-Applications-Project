import React from 'react'

//MUI:
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

//css:
import '../css/Login.css'

function Login() {
  return (
    <div className='container'> 
      <Box
      component="form"
      noValidate
      autoComplete="off"
      >
        <div style={{margin: 100}}>
        <h1 style={{textAlign: "center"}}>Login!</h1>
          <Stack spacing={2} direction="column">
            <TextField
              id="outlined-email-input"
              label="Email/username"
              type="text"
              autoComplete="current-email"
              size='lg'
              required
            />
            <TextField
              id="outlined-password-input"
              label="Password"
              type="password"
              autoComplete="current-password"
              required
            />
            <Button type='submit' id='register' variant='contained'>Log in</Button>
          </Stack>
        </div>
      </Box>
    </div>
  )
}

export default Login