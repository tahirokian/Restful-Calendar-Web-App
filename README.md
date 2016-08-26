# Resful-Calendar-Web-App
Restful Single Page Application (SPA) with Nodejs, Express, Mongodb, jQuery and Passport authentication.

# List of APIs
CalendarAPI provides below mentioned services for creating, editing, deleting and searching the events in the database. In addition passport authntication is used for login and signup. These work as an interface between the calender UI  application and the database.

1. Index page: GET /
2. Signup page: GET /signup
3. Log-in page: GET /login
4. Home page: GET /home
5. User signup: POST /signup
6. User log-in: POST /login
7. Get all events: GET /getevents
8. Create new event: POST /addevent
9. Search events: POST /searchevents
10. Update an event: PUT /editevent/:id
11. Delete an event: DELETE /delevent/:id
12. Update user info: PUT /edituser
13. Logout: GET /logout

# Parameters
1. For user signup:
  *username: String,
  *password: String,
  *fullname: String,
  *email: String

2. For user log-in:
  *username: String,
  *password: String

3. For creating new event:
  *startDate: YYYY-MM-DD,
  *endDate: YYYY-MM-DD,
  *startTime: HH:MM (24 hr format),
  *endTime: HH:MM (24 hr format),
  *description: String,
  *place: String

4. For searching events:
  startDate: YYYY-MM-DD,
  endDate: YYYY-MM-DD

5. For updating an event:
  startDate: YYYY-MM-DD,
  endDate: YYYY-MM-DD,
  startTime: HH:MM (24 hr format),
  endTime: HH:MM (24 hr format),
  description: String,
  place: String

  Date update require both starDate and endDate.
  
  Time update require both startDate and endDate alongwith startTime and endTime.
  
  Description and place can be updated independently.

6. For updating user information:
  fullname: String,
  email: String

 ( '*' represents required field )

# Nodejs
Nodejs can be downloaded from https://nodejs.org/en/
For Nodejs documentation, please visit https://nodejs.org/en/docs/ 

# MongoDB
MongoDB can be downloaded from https://www.mongodb.com/download-center?jmp=nav#community
For MongoDB documentation, please visit https://docs.mongodb.com/?_ga=1.199949294.1991671044.1470738239

# Expressjs
“Expressjs” is a framework for “nodejs” to develop RESTful web services. Express generator can be used to generate expressjs projects and get it running with less hassles.
For Expressjs API reference, please visit http://expressjs.com/en/4x/api.html

# Mongoosejs
Since MongoDB is schema-less, Mongoose provides a straight-forward, schema-based solution for modeling application data with MongoDB.
For Mongoosejs API reference, please visit http://mongoosejs.com/docs/api.html

# Passportjs
Passport is authentication middleware for Node.js. It can be easily dropped in to any Express-based web application. Username and password based local authentication is used in this project.
For Passportjs documentation, please visit http://passportjs.org/docs/overview

# Calendar API
FullCalendar is a jQuery plugin that provides a full-sized, drag & drop calendar. It uses AJAX to fetch events on-the-fly for each month and is easily configured.
For FullCalendar documentation, please visit http://fullcalendar.io/

# View engine
Embedded JavaScript (ejs) is a client-side templating language and it is used as view engine.
For more information, please visit https://www.npmjs.com/package/ejs

# Data validation
Before creating and updating any event in the database, provided date and time fields are validated and if invalid, error message is shown to the user. Dates should be in “YYYY-MM-DD” format and times should be in “HH:MM” 24 hr format.

# Set up:
1. Install Nodejs and MongoDB
2. Get source code:
  git clone https://github.com/tahirokian/Restful-Calendar-Web-App.git 
  or Extract from the zip
2. Install dependencies:   
  npm install
3. Start MongoDB
4. Use 'npm start' to start Nodejs server
5. Open web browser and go to http://localhost:3000
