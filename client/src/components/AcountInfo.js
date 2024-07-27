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
import { Container } from '@mui/material';

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
  const [userId, setUserId] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [description, setDescription] = useState('')
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
        setUserId(json.id)
        setUsername(json.username)
        setEmail(json.email)
        setDescription(json.description)
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
      body: img,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    if (imgRes.ok) {
      const imgId = await imgRes.text()
      console.log(email) 
      const res = await fetch('/user/update/image', {
        method: "PUT",
        body: `{"id": "${userId}", "imgId": ${imgId}}`,
        headers: {
          "Content-type": 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      if (res.ok) {
        navigate(0, { replace: true })
      }
    }
  }

  return (
    <div>
      <Container maxWidth={'xl'}>
        <div style={{ width:'100%', display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
          <Stack spacing={4} direction={'column'} alignItems={'center'} flex={'auto'} sx={{ backgroundColor:'#90caf9', padding: '10px', borderRadius: '10px', margin: {sx: '50px', md: '0px 50px', lg: '0px 100px'}, maxWidth: '700px' }}>
            <Typography variant='h5' sx={{
                mr: 2,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}>Your profile</Typography>
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} width={'90%'}>
                <Avatar
                  src={imageSrc}
                  sx={{ height: { xs: 60, sm: 80, md: 100}, width: { xs: 60, sm: 80, md: 100} }}
                />
                 <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    sx={{ height: { xs: 30, sm: 30, md: 30}, width: { xs: 100, sm: 100, md: 100} }}
                  >
                    Upload
                    <VisuallyHiddenInput type="file" accept='image/*' onChange={handleImageChange} />
                  </Button>
            </Stack>
            <Stack direction={'column'} justifyContent={'space-between'} width={'90%'} sx={{ backgroundColor: '#3f51b5', padding: '10px', borderRadius: '10px' }}>
              <label style={{ fontWeight: 'bold' }} htmlFor='username'>Username:</label>
              <div id='username'>
                <DisplayEdit displayText={username} label={'username'}/>
              </div>
              <Divider style={{ borderWidth: '2px', marginTop: '10px', marginBottom: '10px' }}/>
              <label style={{ fontWeight: 'bold' }} htmlFor='email'>Email:</label>
              <div id='email'>
                <DisplayEdit displayText={email} label={'email'}/>
              </div>
              <Divider style={{ borderWidth: '2px', marginTop: '10px', marginBottom: '10px' }}/>
              <label style={{ fontWeight: 'bold' }} htmlFor='bio'>Bio:</label>
              <div id='bio'>
                <DisplayEdit displayText={description} label={'description'}/>
              </div>
            </Stack>
          </Stack>
        </div>
      </Container>
    </div>
  )
}

export default AcountInfo