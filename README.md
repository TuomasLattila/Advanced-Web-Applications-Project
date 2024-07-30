# Advanced-Web-Applications-Project Documentation
This is the project work of the Advanced Web Applications course.

## Technology used
Here is described all the important technologies used in the project, what they are for, and why they were chosen for this app.
### Backend
For the backend I used Node.js combined with Express framework. I used express-generator command-line tool to create the express server skeleton without any views. No views were needed because I build the frontend as a separated project with react. All the server-side code is written in JavaScript. 

**Used npm packages:**

![Näyttökuva 2024-07-30 151059](https://github.com/user-attachments/assets/9552999a-91cc-4999-b2f1-7b5a7e78bffc)<!-- {width=500px height=600px} -->

### Frontend
For the frontend I used react framework combined with mainly my own components and Material UI components.  Material UI is a good framework for react because the documentation is good and there is a lot of good components making the building of UI easier. The frontend skeleton was generated with the create-react-app command-line tool.

**Used npm packages:**

![Näyttökuva 2024-07-30 151132](https://github.com/user-attachments/assets/3dafad2e-4b4e-442a-a8a6-f7cf15ee2fd6)<!-- {width=500px height=600px} -->

## Installation Guideline
***Prerequisites***

You need:
- Node.js 18
- npm
- git


***1. Clone git repository***

Clone the repository using your favourable method or just by navigating to the folder where you want to clone the repository and running the following script:

`git clone https://github.com/TuomasLattila/Advanced-Web-Applications-Project.git`

***Install dependencies***

After cloning the repository, you need to install all necessary dependencies for the app to work. For this you need to execute following scripts:

`cd .\Advanced-Web-Applications-Project\client\`

`npm install`

`cd ..\server`

`npm install`

Then create .env file into the server folder with following variables:
SECRET="some secret string"
PORT=1234

***Start app***

If you have nodemon installed in the server folder and concurrently installed in the root folder, you can just run following script in root folder:

`npm run dev:both`

Else you can open 2 terminal and go to the client and server folders one at a time like in the step 2 using `cd`, and in each run the following script:

`npm install`

Now you should have both client and server running. The client runs on http://localhost:3000/ and the server runs http://localhost:1234

## User Manual
Here is briefly explained the application features and how to use them. 

### Login and register:



To use this app user must authenticate by log in to an account. User has options to either log into an already existing account or he/she can create a new account by registering. Registering needs user’s username, email, and password. Email needs to be actual email type (aaa.bbb@ccc.dd), and the password needs to be at least 8 characters long, it needs to have at least 1 upper case letter, 1 lower case letter, 1 number, and 1 symbol. After successful register, user is directed to login page, where he/she can log in to the new account. Also, the language can be changed in the front page between English and Finnish.

### Profile page and customization:



After successful login, user is directed to his/her profile page, where is displayed the account’s information. On this page users can add profile picture to their account, and write a profile bio, to tell something about themselves. Also, username and email are editable on this page. The profile picture can be added/changed just by pressing the upload button and choosing an image file from your device. Username, email, and bio can be edited by pressing the edit button, which opens input filed for the user.

### Navigation and language change:



The navigation in the app happens through the navbar, which is on top of the screen. With smaller screen sizes the buttons can be accessed by pressing a hamburger icon in the top left, which opens a side bar containing all the buttons. Start swiping directs user to the app’s swiping feature, chat directs user to chat page, where user can chat with matched users, profile leads to the profile page, and logout logs user out and directs user to the front page. The language can be changed also from the navbar, as you can see in the pictures above.

### Swiping and chatting features:



The main features of the app are liking/disliking (swiping) other users, and if two users have both liked each other (match), they can start chatting with each other. The left picture displays the swiping feature. It displays one new user at a time and the client can like or dislike the user. Liking can happen by pressing the green thumb up button, or by swiping the user card to right. Disliking happens the same way but to left. After swiping, a new user gets displayed, until no more new users to swipe, as shown on the picture. The middle picture displays a list of matched users, and by pressing the chat button on a matched user, you get directed to the chat with the specific user. The chat is displayed on the right picture. User can write new messages, send them, and go back to the matched users list by pressing the arrow button, on the top left.

## Accessibility report



Over all apps accessibility is ok.

## Features and points

Points: 46