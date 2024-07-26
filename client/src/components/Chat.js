import { Stack, Typography, TextField, Button } from '@mui/material'
import React, { useState, useEffect } from 'react'
//import { socket } from '../socket'

function Chat( { user } ) {
  const [messageList, setMessageList] = useState([])
  const [messagesFetched, setMessagesFetched] = useState(false)
  const [username, setUsername] = useState('')

  const [newMessage, setNewMessage] = useState('')


  useEffect(() => {
    const fetchMessages = async () => {
      if (!messagesFetched) {
        const res = await fetch(`chat/messages/${user.id}`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (res.ok) {
          const json = await res.json()
          setMessageList(json.messages)
          setUsername(json.username)
          setMessagesFetched(true)
        }
      }
    }
    fetchMessages()
  }, [messagesFetched, user])


  const handleMsgChange = (event) => {
    setNewMessage(event.target.value)
  }

  const handleSend = async () => {
    const res = await fetch('/chat/message', {
      method: "POST",
      body: JSON.stringify({
        to: user.id,
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

  return (
    <div style={{ padding: '50px', display: 'flex', flexDirection: 'column' }}>
      <Stack direction={'column'} spacing={2} sx={{ flex: 1, overflowY: 'auto'}}>
        {messageList.map((msg, index) => (
          <Stack key={index} direction={'row'} justifyContent={msg.from === user.id? 'flex-start': 'flex-end'}>
            <Stack sx={{ width: 'fit-content'}} maxWidth={'50%'} borderRadius={'5px'} padding={'5px'} direction={'column-reverse'} style={{ backgroundColor: '#2196f3' }}>
              <Stack direction={'row'}>
                <Typography sx={{ wordBreak: "break-word" }}>{msg.msg}</Typography>
              </Stack>
              <Stack direction={'row'} spacing={1}>
                <Typography color={'yellow'}>{msg.from === user.id? user.username: username}</Typography>
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