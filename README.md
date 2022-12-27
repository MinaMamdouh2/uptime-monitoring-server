# Uptime Monitoring RESTful API serve
An uptime monitoring RESTful API server that allows authenticated users to monitor URLs, and get detailed uptime reports about their availability, average response time, and total uptime/downtime.

## System Overview
### Authentication system
![alt text](https://github.com/MinaMamdouh2/BOSTA-API/blob/Readme.md-Images/UserCreation.png?raw=true)
- User Creation Process
  - A user sends a post request to the server with an email and password; an email with a JWT token is sent to him, and he uses this token to verify his email.
    - APIs used:
      - POST: http://localhost:3000/users -->bBody: {"email": "user@gmail.com", "password": "@Test1234"}
      - POST:  http://localhost:3000/auth/verify-email --> body: {"jwtToken": "eyJhbGciOiJIUR5cCI6IkpXVCJ9.asfasfasfas.iqowrqorq"}
  - You can resend the verification email through this API.
    - API used:
      - POST: {{URL}}/auth/send-verification-email --> body: {"email:"user@gmail.com"}
  - Role Authorization flow:
    - Each user can be assigned a role "user" or "admin", by default all users created are assigned to "user" role.
    - Users can only create URL checks & generate reports
      - APIs used:
        - POST: http://localhost:3000/users --> body: {"email": "user@gmail.com", "password": "@Test1234", `"role": "admin"`} 
  - Admins can only get users & delete users
    - APIs used:
      - `PROTECTED` GET: {{URL}}/users
      - `PROTECTED` GET: {{URL}}/users/:id
      - `PROTECTED` DELETE: {{URL}}/users/:id
  - Each user must login to use any URL checks CRUDs or Reports CRUDs
    - API used: {{URL}}/auth/login --> body: {"email": "user@gmail.com", "password": "@Test1234"}
      - This API returns jwtToken which must be set in `Authorization Bearer` Token `Protected APIs`.
### URL Checks
![alt text](https://github.com/MinaMamdouh2/BOSTA-API/blob/Readme.md-Images/UrlcheckCreation.png?raw=true)
- URL Check Creation Proccess
  - A user creates a URL check, which is then sent to the monitor URL function, which pings the server on an interval basis.
    - The check status is only considered `available` if only the server responds with status code `2XX` otherwise it is considered `down`
    - If URL check consists of `assert.statusCode`, if the server `response's status != assert.statusCode`; it is considered `down` 
    - An email with a `down` notification is sent to the user's email upon exceeding the check `threshold`
    - An email with an `available` notification is sent to the user's email upon exceeding the check `threshold` & comes back `available`
    - The URL check is terminated if the check or the user who created it has been `deleted`
      - APIs used:
        -`PROTECTED` POST: {{URL}}/checks --> body: {"name": "check1", "url":"localhost", "protocol": "HTTP", "port": 5000, "path": "/api", "threshold": 3,
        "ignoreSSL": false,"assert":{ "statusCode": 200}, "webhook": "http://localhost:5000/webhook", "httpHeaders":{ "post":{"header1": 1}}}
        - `PROTECTED` POST: {{URL}}/checks --> To check for `basic authentication` --> body:{"name": "check2","url":"httpbin.org/basic-auth/foo/bar","protocol": "http", "tags": ["localhost", "my enviroment"], "authentication":{ "username": "foo","password": "bar"},"ignoreSSL": false}
        -  `PROTECTED` POST: {{URL}}/checks --> To check  `ignore broken/expired SSL certificates` --> body:{ "name": "check71", "url":"expired.badssl.com", "protocol": "HTTPS", "tags": ["trial3"], "threshold": 3, "ignoreSSL": true, "webhook": "http://localhost:5000/webhook", "httpHeaders":{ "post":{ "header1": 1}}}
        - `PROTECTED` GET: {{URL}}/checks/:id
        - `PROTECTED` GET: {{URL}}/checks?page=1&limit=10&tags=localhost&tags=dev&tags=production
        - `PROTECTED` PUT: {{URL}}/checks/:id
        - `PROTECTED` DELETE: {{URL}}/checks/:id
### Reports
- A user can obtain a detailed report for a single URL check or a group of URL checks.
  - APIs used:
    - `PROTECTED` GET: {{URL}}/reports/:id?page=1&limit=10
    - `PROTECTED` GET: {{URL}}/reports/?page=1&limit=10&tags=env&tags=dev
   
      
