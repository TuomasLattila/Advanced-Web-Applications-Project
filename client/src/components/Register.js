import React, { useState, useEffect } from 'react'

//MUI components:
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

//RRD:
import { useNavigate } from 'react-router-dom';

//Language module:
import { useTranslation } from 'react-i18next';

function Register() {
  const { t } = useTranslation(['translation']) //translation

  const [username, setUsername] = useState('') //register username
  const [email, setEmail] = useState('') //register email
  const [password, setPassword] = useState('') //register password
  const [fetchBoolean, setFetchBoolean] = useState(false) //False until form submits.

  const [helperTextEmail, setHelperTextEmail] = useState() //helpertext if register error
  const [helperTextPassword, setHelperTextPassword] = useState() //helpertext if register error
  const [error, setError] = useState(false) //true if register error

  const navigate = useNavigate() //navigation between pages

  //useEffect should run only when at least email, password and fetchBoolean states are changed.
  useEffect(() => {
    if (fetchBoolean === true) {
      setFetchBoolean(false) //Set false, so that the fetch won't run after every change
      const registerUser = async () => { //Async arrow function for making register request to server.
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
          console.log("Registration success!")            
          navigate('/login', { replace: true }) //use navigate to replace page with login page.      
        } else if (res.status === 400) {
          setHelperTextEmail('Invalid email or password') //set helper texts and error, if register failed
          setHelperTextPassword('Min: 8 characters, 1 lower case, 1 upper case, 1 symbol')
          setError(true)
        }
      }
      registerUser()
    }
  }, [password, username, email, fetchBoolean, navigate])

  //This arrow function runs when the form element is submitted. It changes the states.
  const handleChangeOnSubmit = (event) => {
    event.preventDefault() //prevent default form function
    const elements = event.target.elements
    setUsername(elements.username.value) //set values from input fields
    setEmail(elements.email.value)
    setPassword(elements.password.value)

    if (email !== '' && password !== '') {
      setFetchBoolean(true) //Set true (The registerUser fetch-function is allowed to run)
    }
  }

  //3 functions for handling the value change in the inputfileds
  const handleUsernameChange = (event) => {
    setError(false) // set error and helper texts off after change
    setHelperTextEmail()
    setHelperTextPassword()
    setUsername(event.target.value)
  }

  const handleEmailChange = (event) => {
    setError(false)
    setHelperTextEmail()
    setHelperTextPassword()
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setError(false)
    setHelperTextEmail()
    setHelperTextPassword()
    setPassword(event.target.value)
  }

  return ( //uses Material UI components and normal react components
    <div className='container'> 
      <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleChangeOnSubmit}
      style={{ width:'100%', display: 'flex', justifyContent: 'center' }}
      >
        <Stack sx={{ padding: { xs: '100px 30px', sm: '100px 50px', md: '100px 80px'} }} style={{ maxWidth: '700px', flex: 'auto'}}>
          <h1 style={{textAlign: "center"}}>{t('Register!')}</h1>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: "15px",
            paddingBottom: "35px"
          }}>
            <TextField
              id="outlined-input"
              label={t("Type your username")}
              type="text"
              name='username'
              value={username}
              onChange={handleUsernameChange}
            />
            <TextField
              error={error}
              helperText={t(helperTextEmail)}
              id="outlined-email-input"
              label={t("Type your email")}
              type="email"
              autoComplete="current-email"
              name='email'
              value={email}
              onChange={handleEmailChange}
              required
            />
            <TextField
              error={error}
              helperText={t(helperTextPassword)}
              id="outlined-password-input"
              label={t("Type your password")}
              type="password"
              autoComplete="current-password"
              name='password'
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <Stack spacing={2} direction="column">
            <Button type='submit' id='register' variant='contained'>{t('Create account')}</Button>
          </Stack>
        </Stack>
      </Box>
    </div>
  )
}

export default Register