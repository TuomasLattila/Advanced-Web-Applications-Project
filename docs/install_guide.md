# Installation Guideline
***Prerequisites***

- Node.js 18
- npm
- git

<br>

***1. Clone git repository***

Clone the repository using your favourable method or just by navigating to the folder where you want to clone the repository and running the following script:

`git clone https://github.com/TuomasLattila/Advanced-Web-Applications-Project.git`

<br>

***2. Install dependencies***

After cloning the repository, you need to install all necessary dependencies for the app to work. For this you need to execute following scripts:

`cd .\Advanced-Web-Applications-Project\client\`

`npm install`

`cd ..\server`

`npm install`

Then create .env file into the server folder with following variables:

SECRET="some secret string"

PORT=1234

<br>

***3. Start app***

If you have nodemon installed in the server folder and concurrently installed in the root folder, you can just run following script in root folder:

`npm run dev:both`

Else you can open 2 terminal and go to the client and server folders one at a time like in the step 2 using `cd`, and in each run the following script:

`npm install`

Now you should have both client and server running. The client runs on http://localhost:3000/ and the server runs http://localhost:1234
