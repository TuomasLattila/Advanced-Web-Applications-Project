import React, {useState, useEffect} from 'react'

//MUI:
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

//RRD:
//import { useNavigate } from 'react-router-dom'

function DisplayEdit({displayText, label}) { //("the display value", "what user data it is")
  //MUI state variables
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState();

  const [oldValue, setOldValue] = useState('') // old value
  const [currValue, setCurrValue] = useState('') // new value to be evaluated by the server
  const [newValue, setNewValue] = useState('') // input value, not yet pressed submit btn
  const [displayValue, setDisplayValue] = useState('') // the value that is displayed currently

  //const navigate = useNavigate();

  //MUI popper handle function
  const handleClick = (newPlacement) => (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => placement !== newPlacement || !prev);
    setPlacement(newPlacement);
  };

  //Sets the given prop displayText as the initial value
  useEffect(() => {
    setOldValue(displayText)
    setCurrValue(displayText)
    setDisplayValue(displayText);
  }, [displayText]);

  // Sends a update request to server, with the old and new value (fetch works based on the given lable)
  useEffect(() => {
    if (currValue !== oldValue) {
      const updateUserValue = async () => {
        const res = await fetch(`/user/update/${label}`, {
          method: "PUT",
          body: `{ "old_${label}": "${oldValue}", "new_${label}": "${currValue}" }`,
          headers: {
            "Content-type": 'application/json' 
          }
        })
        if (res.ok) {
          setDisplayValue(currValue) // Set accepted value to display and as new "oldValue"
          setOldValue(currValue)
        }
      }
      updateUserValue()
    }
  }, [currValue, oldValue, label])

  //Changes the displayed value to new given value
  const handleSubmit = () => {
    setCurrValue(newValue)
    setNewValue('')
    setOpen(false)
  }

  //Updates the new value state on change
  const handleTextChange = (event) => {
    setNewValue(event.target.value)
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
                <TextField label={`Insert new ${label}`} onChange={handleTextChange}>{newValue}</TextField>
                <Button variant="contained" onClick={handleSubmit} >Submit</Button>
              </Stack>
            </Paper>
          </Fade>
        )}
      </Popper>

      <Stack direction='row' display='flex' justifyContent='space-between' alignItems='center'>
        <Typography
          color='white'
        >
          {displayValue}
        </Typography>
        <Button variant="contained" onClick={label === 'username'? handleClick('left-end') : handleClick('left-start')} >Edit</Button>
      </Stack>
    </div>
  )
}

export default DisplayEdit