# Advanced-Web-Applications-Project Documentation
This is the project work of the Advanced Web Applications course.

## Technology used
Here is described all the important technologies used in the project, what they are for, and why they were chosen for this app.
### Backend
For the backend I used Node.js combined with Express framework. I used express-generator command-line tool to create the express server skeleton without any views. No views were needed because I build the frontend as a separated project with react. All the server-side code is written in JavaScript. 

**Used npm packages:**

![Näyttökuva 2024-07-30 151059](https://github.com/user-attachments/assets/9552999a-91cc-4999-b2f1-7b5a7e78bffc)

### Frontend
For the frontend I used react framework combined with mainly my own components and Material UI components.  Material UI is a good framework for react because the documentation is good and there is a lot of good components making the building of UI easier. The frontend skeleton was generated with the create-react-app command-line tool.

**Used npm packages:**

![Näyttökuva 2024-07-30 151132](https://github.com/user-attachments/assets/3dafad2e-4b4e-442a-a8a6-f7cf15ee2fd6)

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
