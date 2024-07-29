import React, { useState, useEffect } from 'react'

//client side socet, used to keep chat messages updated in real-time
import { socket } from '../socket'

//MUI Components:
import { Avatar, Button, Pagination, Stack, Typography,  } from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';

//My components:
import Chat from './Chat';

//RRD:
import { useNavigate } from 'react-router-dom'

//Language module:
import { useTranslation } from 'react-i18next';

function ChatList() { 
  const { t } = useTranslation(['translation']) //translation

  const [isConnected, setIsConnected] = useState(socket.connected); // when true, the socket is connected to server io
  const [userlist, setUserlist] = useState([]) //all matched users
  const [currTenUsers, setCurrTenUsers] = useState([]) //currently displayed 10 or less users (pager keeps max 10 users displyed per page)
  const [chatContent, setChatContent] = useState(false) //if true return chat UI, if false return chatList UI
  const [matchUser, setMatchUser] = useState('') //this has the match user info, which is passed to the Chat component as prop
  const [currUserId, setCurrUserId] = useState('') //this is the current clients id (used for the chat room joining)
  const [pagerCount, setPagerCount] = useState(1) //the number of required pages on the pager (for example if 20 matched users, need 2 pages)
 
  const navigate = useNavigate(); //navigation between pages

  //const testList = [{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol2', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol3', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, },{username: 'lol', image: null, }]

  //fetches matched users
  useEffect(() => {
    if (!isConnected) { //check if socket is not connected
      const fetchUserlist = async () => { 
        const res = await fetch('/chat/userlist', {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (res.ok) {
          const json = await res.json()
          setUserlist(json.userlist) //set users and pager data:
          setPagerCount(Math.ceil(json.userlist.length/10))
          setCurrUserId(json.id)
          setCurrTenUsers(json.userlist.slice(0, (json.userlist.length > 10? 10:json.userlist.length)))
        } else {
          localStorage.removeItem('token')
          navigate('/', { replace: true })  //If authorization went wrong, logout.
        }
      }
      fetchUserlist()
      socket.connect() // connect the socket to server
      setIsConnected(true) //connected true
      console.log('user connected to chat')
    }
  }, [isConnected, navigate])

  //handles the chat opening. (sets the correct user and sets chat open to true)
  const handleOpenChat = (user) => {
    setMatchUser(user)
    setChatContent(true)
    socket.emit('joinChatroom', {userId: currUserId, matchId: user.id}) //sends server io 'joinChatroom', which creates room or joins existing room (done in server side)
  }

  //handles pager page change
  const handlePagerChange = (event) => {
    const page = Number(event.target.innerHTML[0]) //get the page number from element 
    const pageIndex = (page - 1) //page - 1 (index)

    setCurrTenUsers([]) //remove currently displayed users
    for (let i = (10*pageIndex); i < (10*page); i++) { //set the loop start index and end index correctly to get the right set of users for this page
      if (userlist[i] === undefined) { // if less than 10 users, break the loop
        break
      }
      setCurrTenUsers((prevUsers) => [...prevUsers, userlist[i]]) //sets new user to be displyed
    }
  }

  return ( //uses Material UI components and normal react components and my own components
    <div>
      { chatContent? //cheks if user has opened a chat or not
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