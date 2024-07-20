import React, { useState, useEffect } from 'react'

//MUI:
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

//css:
import '../css/Register.css'

function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fetchBoolean, setFetchBoolean] = useState(false) //False until form submits.

  //useEffect should run only when at least email, password and fetchBoolean states are changed.
  useEffect(() => {
    if (fetchBoolean === true) {
      setFetchBoolean(false) //Set false, so that the fetch won't after every change
      const registerUser = async () => { //Async arrow function for making register request.
        const res = await fetch('/user/register', {
          method: "POST",
          body: JSON.stringify({
            username: username,
            email: email,
            password: password
          }),
          headers: {
            "Content-type": 'application/json'
          }
        }) 
        if (res.status === 200) {
          console.log("Rekisteröinti onnistui!")
          setUsername('')
          setEmail('')
          setPassword('')
          //TODO: Move to login page after successfull registering.
        }
      }
      registerUser()
    }
  }, [password, username, email, fetchBoolean])

  //This arrow function runs when the form element is submitted. It changes the states.
  const handleChangeOnSubmit = (event) => {
    event.preventDefault()
    const elements = event.target.elements
    setUsername(elements.username.value)
    setEmail(elements.email.value)
    setPassword(elements.password.value)

    if (email !== '' && password !== '') {
      setFetchBoolean(true) //Set true (The registerUser fetch-function is allowed to run)
    }
  }

  //3 functions for handling the value change in the inputfileds
  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  return (
    <div className='container'> 
      <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleChangeOnSubmit}
      >
        <div style={{margin: 150}}>
          <h1 style={{textAlign: "center"}}>Register!</h1>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: "15px",
            paddingBottom: "35px"
          }}>
            <TextField
              id="outlined-input"
              label="Type your username"
              type="text"
              name='username'
              value={username}
              onChange={handleUsernameChange}
            />
            <TextField
              id="outlined-email-input"
              label="Type your email"
              type="email"
              autoComplete="current-email"
              name='email'
              value={email}
              onChange={handleEmailChange}
              required
            />
            <TextField
              id="outlined-password-input"
              label="Type your password"
              type="password"
              autoComplete="current-password"
              name='password'
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <Stack spacing={2} direction="column">
            <Button type='submit' id='register' variant='contained'>Create account</Button>
          </Stack>
        </div>
      </Box>
    </div>
  )
}

export default Register