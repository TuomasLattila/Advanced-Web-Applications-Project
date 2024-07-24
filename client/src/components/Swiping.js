import React, { useState, useEffect } from 'react'

//Components:
import Slider from './Slider'

//RRD:
import { useNavigate } from 'react-router-dom'

//MUI components:
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

function Swiping() {
  const [userList, setUserList] = useState([]) // server returns list of swipeable users
  const [imageSrc, setImageSrc] = useState('')
  const [username, setUsername] = useState('')
  const [noMoreNewUsers, setNoMoreNewUsers] = useState(false) //false if server returns list of user, and it's length is more than 0

  const navigate = useNavigate();

  // fetch the new swipeable users
  useEffect(() => {
    if (userList.length === 0 && noMoreNewUsers === false) {
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
            setNoMoreNewUsers(true)
            setImageSrc(null)
            setUsername('No more new users')
          }
          setUserList(json)
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
    setUserList(userList.slice(1))
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
    setUserList(userList.slice(1))
  }

  // Handles the swipe. Calculates the breakpoint, which over the swipe has to go. Then handles either like or dislike
  const handleSwipe = (event) => {
    const windowWidth = window.innerWidth - 15
    const cardWidth = (windowWidth-400 <= 360? windowWidth-400: 360)
    const leftBreakPoint = ((windowWidth - cardWidth) / 4)
    const rightBreakPoint = windowWidth -((windowWidth - cardWidth) / 4)

    if (event.clientX < leftBreakPoint) {
      handleDislike()
    } else if (event.clientX > rightBreakPoint) {
      handleLike()
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center', overflow: 'hidden' }}>
      <div style={{margin: '200px', width: '100%', height: '100%', maxWidth: '360px'}}>
        <Slider >
          <div onPointerUp={noMoreNewUsers === false? handleSwipe : null} style={{ backgroundColor: "#2196f3", borderRadius: '10px', padding: '10px'}}>
            <Stack direction='column' spacing={1} alignItems={'center'}>
              <Avatar
                  src={imageSrc}
                  sx={{ width: 112, height: 112 }}
                  style={{ pointerEvents: 'none' }}
              />
              <Typography
                color='black'
              >
              {username}
              </Typography>
              <Divider style={{ borderWidth: '2px', width: '100%'}}></Divider>
            </Stack>
          </div>
        </Slider>
        <Stack marginTop={'15px'} direction={'row'} justifyContent='space-between'>
          <Button id='dislike' onClick={noMoreNewUsers === false? handleDislike : null} variant='contained' style={{ backgroundColor: 'red' }}><ThumbDownIcon/></Button>
          <Button id='like' onClick={noMoreNewUsers === false? handleLike : null} variant='contained' style={{ backgroundColor: 'green' }}><ThumbUpIcon/></Button>
        </Stack>
      </div>
    </div>
  )
}

export default Swiping