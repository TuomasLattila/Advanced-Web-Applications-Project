const express = require('express')
const router = express.Router()

//Required models:
const Image = require("../models/Image")
const multer  = require('multer')
const upload = multer()

//Authorization strategy:
const passport = require('../strategy/auth')


//ROUTES:

//This route is used to upload and save a single image to the database.
router.post("/", passport.authenticate('jwt', { session: false }), //user needs to be authenticated
  upload.single('image'), async function(req, res, next) {
    try {
      if (req.file) {
        const newImage = new Image({ //create new image document
          buffer: req.file.buffer,
          mimetype: req.file.mimetype, 
          name: req.file.originalname,
          encoding: req.file.encoding
        })
        const imgId = (await newImage.save())._id //save and get the id
        res.send(imgId) //OK (respond with the id of the image)
      } else {
        res.sendStatus(400) //Bad request (No file found)
      }
    } catch (error) {
      res.sendStatus(500) //Internal Server error (Something went wrong with the process)
    }
  }
)

//This route is used to get the image buffer as response, based on a given image id in the url param.
router.get("/:imageId", async function(req, res, next) {
  if (req.params.imageId === 'null') {
    return res.status(400).send(null) //no image id given
  }
  try {
    const image = await Image.findById(req.params.imageId)
    if (image) {
      res.contentType(image.mimetype) 
      res.appendHeader("content-disposition", "inline")
      res.send(image.buffer) // OK (respond with the image buffer)
    } else {
      res.sendStatus(400) //Bad request (No image found)
    }
  } catch (error) {
    res.sendStatus(500) //Internal Server error (Something went wrong with the process)
  }
})

module.exports = router

