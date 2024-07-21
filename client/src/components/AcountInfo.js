import React, { useState, useEffect } from 'react'

//MUI:
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

//RRD:
import { useNavigate } from 'react-router-dom'

function AcountInfo() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [image, setImage] = useState('')

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const res = await fetch('/user/data', {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (res.ok) {
        const json = await res.json()
        setUsername(json.username)
        setEmail(json.email)
        setImage(json.image)
      } else {
        localStorage.removeItem('token')
        navigate(0, { replace: true }) //If authorization went wrong, logout.
      }
    } 
    fetchUserData()
  }, [navigate])

  return (
    <div className='container' style={{ padding: 70, margin: 30, backgroundColor: "#2196f3", borderRadius: '20px', boxShadow: '10px 5px 5px grey' }}>
      <Stack direction="column" spacing={4} sx={{ alignItems: "center" }}>
        <Avatar
          src={image}
          sx={{ width: 112, height: 112 }}
        />
        <Typography
          variant='h3'
        >
          {username}
        </Typography>
        <Typography
          variant='h3'
        >
          {email} 
        </Typography>
      </Stack>  
    </div>
  )
}

export default AcountInfo