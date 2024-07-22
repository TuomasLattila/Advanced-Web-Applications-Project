import React from 'react'

//MUI:
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

//RRD:
import { useNavigate } from 'react-router-dom'

function DisplayEdit({text, label}) {
  //MUI state variables
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState();

  const [editValue, setEditValue] = React.useState('')

  const navigate = useNavigate();

  //MUI popper handle function
  const handleClick = (newPlacement) => (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => placement !== newPlacement || !prev);
    setPlacement(newPlacement);
  };

/*   React.useEffect(() => {
    if (editValue !== text && editValue !== '') {
      const saveNewValue = async () => {
        const res = await fetch(`/user/update/${label}`, {
          method: "PUT",
          body: `{ "old_${label}":"${text}", "new_${label}":"${editValue}"}`,
          headers: {
            "Content-type": 'application/json'
          }
        })
        if (res.ok) {
          setEditValue('')
          navigate(0, { replace: true })
        }
      }
    }
  
    },[editValue, text, label, navigate]) */

  const handleTextChange = (event) => {
    setEditValue(event.target.value)
  }

  return (
    <div>
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement={placement}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <Stack p={1}>
                <TextField label={`Insert new ${label}`} onChange={handleTextChange}></TextField>
                <Button variant="contained" >Submit</Button>
              </Stack>
            </Paper>
          </Fade>
        )}
      </Popper>

      <Stack direction='row' display='flex' justifyContent='space-between' alignItems='center'>
        <Typography
          color='white'
        >
          {text}
        </Typography>
        <Button variant="contained" onClick={label === 'username'? handleClick('left-end') : handleClick('left-start')} >Edit</Button>
      </Stack>
    </div>
  )
}

export default DisplayEdit