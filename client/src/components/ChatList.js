import React, { useState, useEffect } from 'react'
import { socket } from '../socket'

//MUI Components:
import { Avatar, Button, Stack, Typography } from '@mui/material';

//My components:
import Chat from './Chat';

//RRD:
import { useNavigate } from 'react-router-dom'

function ChatList() { 
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [userlist, setUserlist] = useState([])
  const [chatContent, setChatContent] = useState(false)
  const [matchUser, setMatchUser] = useState('')
  const [currUserId, setCurrUserId] = useState('')

  const navigate = useNavigate();

  useEffect(() => {
    if (!isConnected) {
      const fetchUserlist = async () => {
        const res = await fetch('/chat/userlist', {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (res.ok) {
          const json = await res.json()
          setUserlist(json.userlist)
          setCurrUserId(json.id)
        } else {
          localStorage.removeItem('token')
          navigate('/', { replace: true })  //If authorization went wrong, logout.
        }
      }
      fetchUserlist()
      socket.connect()
      setIsConnected(true)
      console.log('user connected to chat')
    }
  }, [isConnected, navigate])

  const handleOpenChat = (user) => {
    setMatchUser(user)
    setChatContent(true)
    socket.emit('joinChatroom', {userId: currUserId, matchId: user.id})
  }

  return (
    <div>
      { chatContent?
      (<Chat matchUser={matchUser}></Chat>)  
      :
      (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Stack direction={'column'} spacing={2} padding={'50px'} textAlign={'center'} maxWidth={'700px'} flex={'auto'}>
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
        </div>
      )
      }
    </div>   
  ) 
} 
 
export default ChatList