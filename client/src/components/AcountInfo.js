import React, { useState, useEffect } from 'react'

//Components:
import DisplayEdit from './DisplayEdit';

//MUI:
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

//RRD:
import { useNavigate } from 'react-router-dom'

//MUI file upload button
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden', 
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function AcountInfo() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [imageSrc, setImageSrc] = useState('')

  const navigate = useNavigate();

  //useEffect fetches the loged in user's data (image, username and email), when page loaded
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
        if (json.image !== null){
          setImageSrc(`/images/${json.image}`) //set profile picture imageSrc
        }
      } else {
        localStorage.removeItem('token')
        navigate(0, { replace: true })  //If authorization went wrong, logout.
      }
    } 
    fetchUserData()
  }, [navigate])

  //Handles the image upload to the server and setting the image id to correct user
  const handleImageChange = async (event) => {
    const img = new FormData()
    img.append('image', event.target.files[0]) 
    const imgRes = await fetch('/images', {
      method: "POST",
      body: img
    })
    if (imgRes.ok) {
      const imgId = await imgRes.text()
      console.log(email) 
      const res = await fetch('/user/update/image', {
        method: "PUT",
        body: `{"email": "${email}", "imgId": ${imgId}}`,
        headers: {
          "Content-type": 'application/json' 
          }
        })
      if (res.ok) {
        navigate(0, { replace: true })
      }
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div className='container' style={{ flex: 'auto', maxWidth:'700px', padding: 70, margin: 30, backgroundColor: "#2196f3", borderRadius: '20px' }}>
        <Stack direction="column" spacing={4} width={'100%'} sx={{ alignItems: "center" }}>
          <Typography variant='h5' sx={{
                mr: 2,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}>Your profile</Typography>
          <Stack direction='row' width="100%" display='flex' justifyContent='space-between' alignItems='center'>  
            <Avatar
              src={imageSrc}
              sx={{ width: 112, height: 112 }}
            />
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              sx={{ width: 164, height: 40 }}
            >
              Change image
              <VisuallyHiddenInput type="file" accept='image/*' onChange={handleImageChange} />
            </Button>
          </Stack>
          <Stack  direction="column" width="100%" borderRadius='20px' padding='10px' style={{ backgroundColor: 'grey'}} >
            
            <DisplayEdit displayText={username} label={'username'}/> {/* Editable user data */}
            
            <Divider style={{ borderWidth: '2px', marginTop: '10px', marginBottom: '10px' }}/>
            
            <DisplayEdit displayText={email} label={'email'}/> {/* Editable user data */}
          
          </Stack>
        </Stack>  
      </div>
    </div>
  )
}

export default AcountInfo