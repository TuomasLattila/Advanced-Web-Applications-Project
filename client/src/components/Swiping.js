import React, { useState, useEffect } from 'react'

//Slider component:
import Slider from './Slider'

//RRD:
import { useNavigate } from 'react-router-dom'

//MUI components:
import { Stack, Avatar, Button, Divider, Typography, Container } from '@mui/material'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

//Language module:
import { useTranslation } from 'react-i18next';

function Swiping() {
  const { t } = useTranslation(['translation']) //translation

  const [userList, setUserList] = useState([]) // server returns list of swipeable users (all users that have not been liked/disliked yet by the current client)
  const [imageSrc, setImageSrc] = useState('') // currently displayed user's image src
  const [username, setUsername] = useState('') // currently displayed user's username
  const [bio, setBio] = useState('') // currently displayed user's bio 
  const [noMoreNewUsers, setNoMoreNewUsers] = useState(false) //false if server returns list of user, and it's length is more than 0

  const navigate = useNavigate(); //navigation between pages

  // fetch the new swipeable users list
  useEffect(() => {
    if (userList.length === 0 && noMoreNewUsers === false) { //if list empty and could still be new users to fetch
      const fetchUsers = async () => {
        const res = await fetch('/swipe/list', { 
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (res.ok) {
          const json = await res.json()
          if (json.length === 0) { // test if the userlist is empty
            setNoMoreNewUsers(true) //set 'no more new users left'
            setImageSrc(null)
            setUsername('No more new users')
            setBio('-')
          }
          setUserList(json) //set the fetched list to be displyed
        } else {
          localStorage.removeItem('token') 
          navigate('/', { replace: true })  //If authorization went wrong, logout.
        }
      }
      fetchUsers()  
    }
  }, [userList, navigate, noMoreNewUsers])

  //set new user to display, runs everytime when userList changes
  useEffect(() => {
    if (userList.length !== 0) {
      setUsername(userList[0].username)
      setBio(userList[0].description)
      if (userList[0].image !== null) {
        setImageSrc(`/images/${userList[0].image}`) 
      } else {
        setImageSrc(null)
      }
    }
  }, [userList])

  //Send request to add like/dislike to server
  const handleLike = async () => { 
    const res = await fetch('/swipe/add', { 
      method: "POST",
      body: JSON.stringify({
        to_email: userList[0].email,
        liked: true
      }),
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        "Content-type": 'application/json'
      }
    })
    if (res.ok) {
      console.log('liked')
    }
    setUserList(userList.slice(1)) //remove the swiped user from the list
  }

  //Send request to add like/dislike to server
  const handleDislike = async () => {
    const res = await fetch('/swipe/add', {
      method: "POST",
      body: JSON.stringify({
        to_email: userList[0].email,
        liked: false
      }),
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        "Content-type": 'application/json'
      }
    })
    if (res.ok) {
      console.log('disliked')
    }
    setUserList(userList.slice(1)) //remove the swiped user from the list
  }

  // Handles the swipe. Calculates the breakpoint, which over the swipe has to go. Then handles either like or dislike
  const handleSwipe = (event) => {
    const windowWidth = window.innerWidth
    const cardWidth = (windowWidth < 600? 170 : (windowWidth < 900? 250 : 360))
    const leftBreakPoint = ((windowWidth - cardWidth) / 4)
    const rightBreakPoint = windowWidth -((windowWidth - cardWidth) / 4)

    if (event.clientX < leftBreakPoint) {
      handleDislike()
    } else if (event.clientX > rightBreakPoint) {
      handleLike()
    }
  }
  
  return ( //uses Material UI components and normal react components
    <div style={{ alignItems: 'center', overflow: 'hidden', height: 'max-content' }}>
      <Container maxWidth="xl">
        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-evenly'}>
          <NotInterestedIcon style={{ color: 'red' }} sx={{ height: { xs: 30, sm: 40, md: 50}, width: { xs: 30, sm: 40, md: 50}}}></NotInterestedIcon>
          <Stack direction={'column'} alignItems={'center'} marginTop={'100px'}>
            <Typography variant='h6'>{t('Swipe or click')}!</Typography>
            <Stack direction={'column'} spacing={4} textAlign={'center'} sx={{ height: '100%', width: { xs: 170, sm: 250, md: 360}}}>
              <Slider >
                <div onPointerUp={noMoreNewUsers === false? handleSwipe : handleSwipe} style={{ backgroundColor: "#2196f3", borderRadius: '10px', padding: '10px'}}>
                  <Stack direction='column' spacing={1} alignItems={'center'}>
                    <Avatar
                        src={imageSrc}
                        sx={{ width: 112, height: 112 }}
                        style={{ pointerEvents: 'none' }}
                    />
                    <Typography
                      color='black'
                    >
                    {username !== 'No more new users'? username : t(username)}
                    </Typography>
                    <Divider style={{ borderWidth: '2px', width: '100%'}}></Divider>
                    <Typography
                      color='black'
                    >
                    {bio}
                    </Typography>
                  </Stack>
                </div>
              </Slider>
              <Stack marginTop={'15px'} direction={'row'} justifyContent='space-between'>
                <Button id='dislike' onClick={noMoreNewUsers === false? handleDislike : null} variant='contained' style={{ backgroundColor: 'red' }}><ThumbDownIcon/></Button>
                <Button id='like' onClick={noMoreNewUsers === false? handleLike : null} variant='contained' style={{ backgroundColor: 'green' }}><ThumbUpIcon/></Button>
              </Stack>
            </Stack>
          </Stack>
          <FavoriteBorderIcon style={{ color: 'green' }} sx={{ height: { xs: 30, sm: 40, md: 50}, width: { xs: 30, sm: 40, md: 50}}}></FavoriteBorderIcon>
        </Stack>
      </Container>
    </div>
  )
}

export default Swiping