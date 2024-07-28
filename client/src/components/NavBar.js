import React, { useEffect } from 'react'

import { socket } from '../socket'

//MUI Components
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import AdbIcon from '@mui/icons-material/Adb';
import Drawer from '@mui/material/Drawer';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatIcon from '@mui/icons-material/Chat';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';

//RRD:
import { useNavigate, useLocation } from 'react-router-dom'

//Language:
import { useTranslation } from 'react-i18next';

const pages = ['Start swiping', 'Chat'];
const settings = ['Profile', 'Logout'];
const languages = ['FI', 'EN']

function Profile({ Component }) { //This component takes another component as param, and it is diplyed under the navbar.
  const { t, i18n } = useTranslation(['translation'])
  
  const navigate = useNavigate();
  const location = useLocation()

  //Material ui hidden menus state variables:
  const [open, setOpen] = React.useState(false);

  const changeLanguage = (language) => {
    i18n.changeLanguage(language)
  }

  //Material ui functions to handle hidden menus
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  useEffect(() => {
    if (location.pathname !== '/chat' && socket.connected) {
      socket.disconnect()
      console.log("user disconnected chat")
    }
  }, [location])

  //Function for loging the user out.
  const logUserOut = () => { 
    localStorage.removeItem('token')
    if (location.pathname === '/') {
      navigate(0, { replace: true }) // delete token and refresh the index page.
    } else {
      window.location.href = '/' //navigate('/', { replace: true }) // navigate to index if not already there
    }
  }

  const navigateToProfile = () => {
    navigate('/', { replace: true }) // Refreshes, because this is profile page
  }
  const navigateToChat = () => {
    navigate('/chat') // Navigates to the chat page
  }
  const navigateToSwiping = () => { 
    navigate('/swipe') // Navigates to the swipe page
  }

  //This is the sidebar that opens when hamburger icon is pressed on smaller screens.
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {pages.map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={text === "Chat"? navigateToChat : navigateToSwiping}>
              <ListItemIcon>
                {text === "Start swiping"? <FavoriteBorderIcon /> : <ChatIcon />}
              </ListItemIcon>
              <ListItemText primary={t(text)} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {settings.map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={text === "Profile"? navigateToProfile : logUserOut}>
              <ListItemIcon>
              {text === "Profile"? <AccountBoxIcon /> : <LogoutIcon />}
              </ListItemIcon>
              <ListItemText primary={t(text)} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <Typography fontWeight={'bold'}>Language:</Typography>
        {languages.map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => changeLanguage(text === 'FI'? 'fi' : 'en')}>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <AppBar position="sticky">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              {'LOGO'}
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>

              <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
              </Drawer>

            </Box>
            <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              {'LOGO'}
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button 
                  key={page}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                  onClick={page === "Chat"? navigateToChat : navigateToSwiping}  
                >
                  {t(page)}
                </Button>
              ))}
            </Box>
            <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
              {settings.map((setting) => (
                <Button
                  key={setting}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                  onClick={setting === "Profile"? navigateToProfile : logUserOut}
                >
                  {t(setting)}
                </Button>
              ))}
            </Box>
            <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
              {languages.map((language) => (
                <Button
                  key={language}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                  onClick={() => changeLanguage(language === 'FI'? 'fi' : 'en')}
                >
                  {language}
                </Button>
              ))}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
          
      <Component /> {/* Component which has been gotten as param */}
    </div>
  )
}

export default Profile