import React, { useState, useEffect } from 'react'
import { socket } from '../socket'

//MUI Components:
import { Avatar, Button, Stack, Typography } from '@mui/material';

//My components:
import Chat from './Chat';

function ChatList() { 
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [userlist, setUserlist] = useState([])
  const [chatContent, setChatContent] = useState(false)
  const [currChatUser, setCurrChatUser] = useState('')

  const fetchUserlist = async () => {
    const res = await fetch('/chat/userlist', {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    if (res.ok) {
      const json = await res.json()
      setUserlist(json)
    }
  }

  useEffect(() => {
    if (!isConnected) {
      socket.connect()
      setIsConnected(true)
      console.log('user connected to chat')
      fetchUserlist()
    }
  }, [isConnected])

  const handleOpenChat = (user) => {
    setCurrChatUser(user)
    setChatContent(true)
  }

  return (
    <div>
      { chatContent?
      (<Chat user={currChatUser}></Chat>)  
      :
      (
        <Stack direction={'column'} spacing={2} padding={'50px'} textAlign={'center'}>
          <Typography variant='h4'>Mathed users:</Typography>
          {userlist.map((user, index) => (
            <Stack key={index} direction={'row'} alignItems={'center'} justifyContent='space-between'
              style={{ backgroundColor: '#2196f3', borderRadius: '5px', padding: '10px'}}
            >
              <Stack direction={'row'} spacing={4} alignItems={'center'}>
                <Avatar
                  src={`/images/${user.image}`}
                ></Avatar>
                <Typography>
                  {user.username}
                </Typography>
              </Stack>
              <Button onClick={() => handleOpenChat(user)} variant='contained'>
                Chat
              </Button>
            </Stack>
          ))}
        </Stack>
      )
      }
    </div>   
  ) 
} 
 
export default ChatList