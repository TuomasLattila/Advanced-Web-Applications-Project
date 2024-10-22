import React, { useState, useEffect } from 'react'

//MUI components:
import { Stack, Button, Box, TextField } from '@mui/material';

//RRD:
import { useNavigate } from 'react-router-dom';

//Language module:
import { useTranslation } from 'react-i18next';

function Login() {
  const { t } = useTranslation(['translation']) //translation

  const [identifier, setIdentifier] = useState('') //login email/username
  const [password, setPassword] = useState('') //login password
  const [fetchBoolean, setFetchBoolean] = useState(false) //False until form submits.

  const [helperText, setHelperText] = useState() //gets set if login fails
  const [error, setError] = useState(false) //true if login fails

  const navigate = useNavigate() //navigation between pages
 
  //useEffect should run only when identifier, password and fetchBoolean states are changed.
  useEffect(() => {
    if (fetchBoolean === true) {
      setFetchBoolean(false) //Set false, so that the fetch won't after every change
      const loginUser = async () => { //Async arrow function for making login request.
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
          console.log("Login success!")
          setIdentifier('') //empty input fields
          setPassword('')
          const json = await res.json()
          localStorage.setItem('token', json.token) //Store the jwt token to localStorege
          navigate('/', { replace: true }) //Navigate to index page, after succesfull login
        } else if (res.status === 401) {
          setHelperText('Incorrect email/username or password') //display error to user
          setError(true)
        }
      }
      loginUser()
    }
  }, [password, identifier, fetchBoolean, navigate])

  //This arrow function runs when the form element is submitted. It changes the state variables.
  const handleChangeOnSubmit = (event) => {
    event.preventDefault() //prevent form default function
    const elements = event.target.elements
    setIdentifier(elements.identifier.value)
    setPassword(elements.password.value)

    if (identifier !== '' && password !== '') {
      setFetchBoolean(true) //Set true (The registerUser fetch-function is allowed to run)
    }
  }

  //2 functions for handling the value change in the input fileds:
  const handleIdentifierChange = (event) => {
    setError(false) //when correcting information, set errror and helper text off
    setHelperText()
    setIdentifier(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setError(false)
    setHelperText()
    setPassword(event.target.value)
  }

  return (//uses Material UI components and normal react components
    <div className='container'> 
      <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleChangeOnSubmit}
      style={{ width:'100%', display: 'flex', justifyContent: 'center' }}
      >
        <Stack sx={{ padding: { xs: '100px 30px', sm: '100px 50px', md: '100px 80px'} }} style={{ maxWidth: '700px', flex: 'auto'}}>
          <h1 style={{textAlign: "center"}}>{t('Login!')}</h1>
          <Stack spacing={2} direction="column">
            <TextField
              error={error}
              id="outlined-input"
              label={t("Email/username")}
              type="text"
              autoComplete="current-email"
              name='identifier'
              value={identifier}
              onChange={handleIdentifierChange}
              required
            />
            <TextField
              error={error}
              helperText={t(helperText)}
              id="outlined-password-input"
              label={t("Password")}
              type="password"
              autoComplete="current-password"
              name='password'
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <Button type='submit' id='register' variant='contained'>{t('Log in')}</Button>
          </Stack>
        </Stack>
      </Box>
    </div>
  )
}

export default Login