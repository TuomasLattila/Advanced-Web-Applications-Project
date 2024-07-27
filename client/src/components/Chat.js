import { Stack, Typography, TextField, Button, Avatar } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { socket } from '../socket'

//MUI Components:
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

//RRD:
import { useNavigate } from 'react-router-dom'

function Chat( { matchUser } ) {
  const [messageList, setMessageList] = useState([])
  const [messagesFetched, setMessagesFetched] = useState(false)

  const [newMessage, setNewMessage] = useState('')

  const navigate = useNavigate();


  useEffect(() => {
    socket.on('message', (newMessage) => {
      setMessageList([...messageList, newMessage])
    })
    const fetchMessages = async () => {
      if (!messagesFetched) {
        const res = await fetch(`chat/messages/${matchUser.id}`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (res.ok) {
          const json = await res.json()
          setMessageList(json.messages)
          setMessagesFetched(true)
        }
      }
    }
    fetchMessages()
  }, [messagesFetched, matchUser, messageList])


  const handleMsgChange = (event) => {
    setNewMessage(event.target.value)
  }

  const handleSend = async () => {
    const res = await fetch('/chat/message', {
      method: "POST",
      body: JSON.stringify({
        to: matchUser.id,
        msg: newMessage
      }),
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        "Content-type": 'application/json'
      }
    })
    if (res.ok) {
      setNewMessage('')
    }
  }

  const handleBackBtn = () => {
    navigate(0, { replace: true }) //Reload to get back to matched users list (disconnects the room also)
  }

  return (
    <div style={{ padding: '50px', display: 'flex', flexDirection: 'column' }}>
      <Stack direction={'row'}>
        <Button onClick={handleBackBtn} variant='contained'>
          <ArrowBackIcon></ArrowBackIcon>
        </Button>
      </Stack>
      <Stack direction={'column'} spacing={2} sx={{ flex: 1, overflowY: 'auto'}}>
        {messageList.map((msg, index) => (
          <Stack key={index} direction={'row'} justifyContent={msg.from === matchUser.id? 'flex-start': 'flex-end'}>
            <Stack sx={{ width: 'fit-content'}} maxWidth={'50%'} borderRadius={'5px'} padding={'5px'} direction={'column-reverse'} style={msg.from === matchUser.id? { backgroundColor: '#2196f3' } : { backgroundColor: '#8bc34a' }}>
              <Stack direction={'row'}>
                <Typography sx={{ wordBreak: "break-word" }}>{msg.msg}</Typography>
              </Stack>
              <Stack direction={'row'} spacing={1}>
                {msg.from === matchUser.id? <Avatar src={`/images/${matchUser.image}`}></Avatar> : null}
                <Typography color={'yellow'}>{msg.from === matchUser.id? matchUser.username: 'You'}</Typography>
                <Typography fontSize={10}>{`${(new Date(msg.ts)).getDay()}/${(new Date(msg.ts)).getMonth()}/${(new Date(msg.ts)).getFullYear()} ${(new Date(msg.ts)).getHours().toString().padStart(2, 0)}:${(new Date(msg.ts)).getMinutes().toString().padStart(2, 0)}`}</Typography>
              </Stack>
            </Stack>
          </Stack>
        ))}
      </Stack>
      <Stack marginTop={2} spacing={1} direction={'row'} position={'sticky'}>
        <TextField
          label="New message"
          name='message'
          type='text'
          value={newMessage}
          onChange={handleMsgChange}
          fullWidth
        />
        <Button onClick={handleSend} variant='contained'>
        Send
        </Button>
      </Stack>
    </div>
  )
}

export default Chat