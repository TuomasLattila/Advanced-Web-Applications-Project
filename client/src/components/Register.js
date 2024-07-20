import React from 'react'

//MUI:
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

//css:
import '../css/Register.css'

function Register() {
  return (
    <div className='container'> 
      <Box
      component="form"
      noValidate
      autoComplete="off"
      >
        <div style={{margin: 100}}>
          <h1 style={{textAlign: "center"}}>Register!</h1>
          <Stack spacing={2} direction="column">
            <TextField
              id="outlined-input"
              label="Type your username"
              type="text"
            />
            <TextField
              id="outlined-email-input"
              label="Type your email"
              type="email"
              autoComplete="current-email"
              required
            />
            <TextField
              id="outlined-password-input"
              label="Type your password"
              type="password"
              autoComplete="current-password"
              required
            />
            <Button type='submit' id='register' variant='contained'>Create account</Button>
          </Stack>
        </div>
      </Box>
    </div>
  )
}

export default Register