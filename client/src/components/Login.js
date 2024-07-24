import React, { useState, useEffect } from 'react'

//MUI:
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

//css:
import '../css/Login.css'

//RRD:
import { useNavigate } from 'react-router-dom';

function Login() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [fetchBoolean, setFetchBoolean] = useState(false) //False until form submits.

  const navigate = useNavigate()
 
  //useEffect should run only when identifier, password and fetchBoolean states are changed.
  useEffect(() => {
    if (fetchBoolean === true) {
      setFetchBoolean(false) //Set false, so that the fetch won't after every change
      const loginUser = async () => { //Async arrow function for making register request.
        const res = await fetch('/user/login', {
          method: "POST",
          body: JSON.stringify({
            identifier: identifier,
            password: password
          }),
          headers: {
            "Content-type": 'application/json'  
          }
        }) 
        if (res.status === 200) {
          console.log("Kirjautuminen onnistui!")
          setIdentifier('')
          setPassword('')
          const json = await res.json()
          localStorage.setItem('token', json.token) //Store the jwt token to localStorege
          navigate('/', { replace: true }) //Navigate to index page, after succesfull login
        }
      }
      loginUser()
    }
  }, [password, identifier, fetchBoolean, navigate])

  //This arrow function runs when the form element is submitted. It changes the state variables.
  const handleChangeOnSubmit = (event) => {
    event.preventDefault()
    const elements = event.target.elements
    setIdentifier(elements.identifier.value)
    setPassword(elements.password.value)

    if (identifier !== '' && password !== '') {
      setFetchBoolean(true) //Set true (The registerUser fetch-function is allowed to run)
    }
  }

  //2 functions for handling the value change in the inputfileds
  const handleIdentifierChange = (event) => {
    setIdentifier(event.target.value)
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
      style={{ width:'100%', display: 'flex', justifyContent: 'center' }}
      >
        <div style={{ margin: 110, maxWidth: '700px', flex: 'auto'}}>
          <h1 style={{textAlign: "center"}}>Login!</h1>
          <Stack spacing={2} direction="column">
            <TextField
              id="outlined-input"
              label="Email/username"
              type="text"
              autoComplete="current-email"
              name='identifier'
              value={identifier}
              onChange={handleIdentifierChange}
              required
            />
            <TextField
              id="outlined-password-input"
              label="Password"
              type="password"
              autoComplete="current-password"
              name='password'
              value={password}
              onChange={handlePasswordChange}
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