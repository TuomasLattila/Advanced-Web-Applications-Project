import React from 'react'

//Components:
import NavBar from './NavBar';
import AcountInfo from './AcountInfo';


//MUI:
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

//Language:
import { useTranslation } from 'react-i18next';

//react-router-dom:
import {Link} from 'react-router-dom'
 
function Frontpage() {
  const { t, i18n } = useTranslation(['translation']);

  const changeLanguage = (language) => {
    i18n.changeLanguage(language)
  }
  
  if (localStorage.getItem('token')) {
    return <NavBar Component={AcountInfo} /> //Returns the profile component, becuase token is found
  }

  return (
    <div className='container' style={{display: 'flex', justifyContent: 'center'}}>
      <Stack spacing={2} direction="column" flex='auto' maxWidth='700px' sx={{ padding: { xs: '100px 30px', sm: '100px 50px', md: '100px 80px'} }}>
        
        <Stack direction={'row'} spacing={0.5} paddingBottom={'200px'} justifyContent={'end'}>
          <Button onClick={() => changeLanguage("fi")} variant='outlined'>FI</Button>
          <Button onClick={() => changeLanguage("en")} variant='outlined'>EN</Button>
        </Stack>
        
        <Button LinkComponent={Link} id='register' to='/register' variant='contained'>{t('Create account')}</Button>
        <Button LinkComponent={Link} id='login' to='/login' variant='outlined'>{t('Log in')}</Button>
      </Stack>
    </div>
  )
}

export default Frontpage