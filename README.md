# WTWR (What to Wear?): Back End

This is the back end code of the WTWR web application. This works as an API that supplies clothing items and user information to the front end
application. Once completed, user authenication will also be handled here.

Recently added user authentication which will allow people to register and login to their WTWR account.

## Accessing

- api.wtwr.haoqiw.com : How to access the backend application
- www.wtwr.haoqiw.com / wtwr.haoqiw.com : How to access the frontend application

## Technologies and Techniques used

- Back end code meant to be ran on servers with Node.js
- Express
- Node.js connects to a mongoDB which stores the data files
- eslint, prettier, and airbnb-base were used for styling and error checking
- Authentication with jsonwebtoken, bcryptjs, cors

## Running the Project

`npm run start` — to launch the server

`npm run dev` — to launch the server with the hot reload feature
