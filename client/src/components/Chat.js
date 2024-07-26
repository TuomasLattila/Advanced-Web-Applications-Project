import { Stack, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { socket } from '../socket'

function Chat( { user } ) {
  const [messageList, setMessageList] = useState([])

  const fetchMessages = async () => {
    const res = await fetch(`chat/messages/${user.id}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    if (res.ok) {
      const json = await res.json()
      setMessageList(json)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])


  return (
    <div>
      <Stack direction={'column'} spacing={2}>
        {messageList.map((msg, index) => (
          <Stack direction={'row'} key={index} style={{ backgroundColor: '#2196f3' }}>
            <Typography>{msg.msg}</Typography>
            <Typography>{msg.ts}</Typography>
          </Stack>
        ))}
      </Stack>
    </div>
  )
}

export default Chat