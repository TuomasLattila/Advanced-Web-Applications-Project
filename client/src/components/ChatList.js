import React, { useState, useEffect } from 'react'
import { socket } from '../socket'

//MUI Components:
import { Avatar, Button, Pagination, Stack, Typography } from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';

//My components:
import Chat from './Chat';

//RRD:
import { useNavigate } from 'react-router-dom'

//Language:
import { useTranslation } from 'react-i18next';

function ChatList() { 
  const { t } = useTranslation(['translation'])

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [userlist, setUserlist] = useState([])
  const [currTenUsers, setCurrTenUsers] = useState([])
  const [chatContent, setChatContent] = useState(false)
  const [matchUser, setMatchUser] = useState('')
  const [currUserId, setCurrUserId] = useState('')
  const [pagerCount, setPagerCount] = useState(1)
 
  const navigate = useNavigate();
  //const testList = [{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol2', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol3', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, }]

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
          setPagerCount(Math.ceil(json.userlist.length/10))
          setCurrUserId(json.id)
          setCurrTenUsers(json.userlist.slice(0, (json.userlist.length > 10? 10:json.userlist.length)))
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

  const handlePagerChange = (event) => {
    const pageIndex = (Number(event.target.innerHTML[0]) - 1)
    const page = Number(event.target.innerHTML[0])
    setCurrTenUsers([])
    for (let i = (10*pageIndex); i < (10*page); i++) {
      if (userlist[i] === undefined) {
        break
      }
      setCurrTenUsers((prevUsers) => [...prevUsers, userlist[i]])
    }
  }

  return (
    <div>
      { chatContent?
      (<Chat matchUser={matchUser}></Chat>)  
      :
      (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Stack direction={'column'} spacing={2} padding={'50px'} textAlign={'center'} maxWidth={'700px'} flex={'auto'}>
            <Typography variant='h4'>{t('Matched users')}:</Typography>
            {currTenUsers.map((user, index) => (
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
                  <MessageIcon/>
                </Button>
              </Stack>
            ))}
            <Pagination onChange={handlePagerChange} count={pagerCount}></Pagination>
          </Stack>
        </div>
      )
      }
    </div>   
  ) 
} 
 
export default ChatList