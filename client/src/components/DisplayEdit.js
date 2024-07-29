import React, {useState, useEffect} from 'react'

//MUI components:
import { Stack, Typography, Button, Popper, Fade, Paper, TextField } from '@mui/material';

//Language module:
import { useTranslation } from 'react-i18next';

function DisplayEdit({displayText, label}) { //("the display value", "what user data it is"), for example ('Kimmo', 'username')
  const { t } = useTranslation(['translation']) //translation
  
  //MUI state variables for the popper
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState();

  const [oldValue, setOldValue] = useState('') // old displayText
  const [currValue, setCurrValue] = useState('') // new value to be evaluated by the server
  const [newValue, setNewValue] = useState('') // input value, not yet pressed submit btn
  const [displayValue, setDisplayValue] = useState('') // the value that is displayed currently

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

  // Sends an update request to server, with the old and new value (fetch works based on the given lable)
  useEffect(() => {
    if (currValue !== oldValue) {
      const updateUserValue = async () => {
        const res = await fetch(`/user/update/${label}`, {
          method: "PUT",
          body: `{ "old_${label}": "${oldValue}", "new_${label}": "${currValue}" }`, //new value will be validated in the server and changed if validation OK
          headers: {
            "Content-type": 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
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

  //Handle submit, set input as current value, which will be sent to server
  const handleSubmit = () => {
    setCurrValue(newValue)
    setNewValue('') //empty input field
    setOpen(false) //close popper
  }

  //Updates the new value state on change
  const handleTextChange = (event) => {
    setNewValue(event.target.value)
  }

  return ( //uses Material UI components and normal react components
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
                <TextField label={t(`Insert new ${label}`)} onChange={handleTextChange}>{newValue}</TextField>
                <Button variant="contained" onClick={handleSubmit} >{t('Submit')}</Button>
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
        <Button variant="contained" onClick={label === 'username'? handleClick('left-end') : (label === 'email'? handleClick('left') : handleClick('left-start')) } >{t('Edit')}</Button>
      </Stack>
    </div>
  )
}

export default DisplayEdit