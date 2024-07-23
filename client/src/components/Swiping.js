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
  const [userList, setUserList] = useState([])
  const [imageSrc, setImageSrc] = useState('')
  const [username, setUsername] = useState('')

  const navigate = useNavigate();

  useEffect(() => {
    if (userList.length === 0) {
      const fetchUsers = async () => {
        const res = await fetch('/user/list', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (res.ok) {
          const json = await res.json()
          setUserList(json)
        } else {
          localStorage.removeItem('token') 
          navigate('/', { replace: true })  //If authorization went wrong, logout.
        }
      }
      fetchUsers()
    }
  }, [userList, navigate])

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

  const handleLike = (event) => {
    setUserList(userList.slice(1))
  }

  const handleDislike = (event) => {
    setUserList(userList.slice(1))
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
      <div style={{margin: '200px', width: '50%', height: '70%', maxWidth: '360px' }}>
        <Slider>
          <div style={{ backgroundColor: "#2196f3", borderRadius: '10px', padding: '10px'}}>
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
          <Button id='dislike' onClick={handleDislike} variant='contained' style={{ backgroundColor: 'red' }}><ThumbDownIcon/></Button>
          <Button id='like' onClick={handleLike} variant='contained' style={{ backgroundColor: 'green' }}><ThumbUpIcon/></Button>
        </Stack>
      </div>
    </div>
  )
}

export default Swiping