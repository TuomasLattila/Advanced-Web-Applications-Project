import { Stack, Typography, TextField, Button, Avatar } from '@mui/material'
import React, { useState, useEffect, useRef } from 'react'
import { socket } from '../socket'

//MUI Components:
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

//RRD:
import { useNavigate } from 'react-router-dom'

//Language:
import { useTranslation } from 'react-i18next';

function Chat( { matchUser } ) {
  const { t } = useTranslation(['translation'])

  const [messageList, setMessageList] = useState([])
  const [messagesFetched, setMessagesFetched] = useState(false)
  const lastMessageRef = useRef(null)

  const [newMessage, setNewMessage] = useState('')

  const navigate = useNavigate();


  useEffect(() => {
    socket.on('message', (newMessage) => {
      setMessageList([...messageList, newMessage])
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
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
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
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
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Stack direction={'column'} spacing={2} sx={{ flex: 'auto', padding: { xs: '5px', sm: '10px 30px', md: '10px 50px'}, maxWidth: '700px'}}>
        <Stack direction={'row'} sx={{ position: 'sticky', top: { xs: 66, sm: 74, md: 78.5 } }}>
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
                  {msg.from === matchUser.id? <Avatar sx={{ height: { xs: 20, sm: 30, md: 40}, width: { xs: 20, sm: 30, md: 40}}} src={`/images/${matchUser.image}`}></Avatar> : null}
                  <Typography color={'yellow'}>{msg.from === matchUser.id? matchUser.username: t('You')}</Typography>
                  <Typography fontSize={10}>{`${(new Date(msg.ts)).getDate()}/${(new Date(msg.ts)).getMonth()+1}/${(new Date(msg.ts)).getFullYear()} ${(new Date(msg.ts)).getHours().toString().padStart(2, 0)}:${(new Date(msg.ts)).getMinutes().toString().padStart(2, 0)}`}</Typography>
                </Stack>
              </Stack>
              <div ref={lastMessageRef}></div>
            </Stack>
          ))}
        </Stack>
        <Stack spacing={1} direction={'row'} sx={{ position: 'sticky', bottom: 10 }} >
          <TextField
            label={t("New message")}
            name='message'
            type='text'
            value={newMessage}
            onChange={handleMsgChange}
            fullWidth
          />
          <Button onClick={handleSend} variant='contained'>
          {t('Send')}
          </Button>
        </Stack>
      </Stack>
    </div>
  )
}

export default Chat