# Uptime Monitoring RESTful API serve
An uptime monitoring RESTful API server that allows authenticated users to monitor URLs, and get detailed uptime reports about their availability, average response time, and total uptime/downtime.

## System Overview
### Authentication system
![alt text](https://github.com/MinaMamdouh2/BOSTA-API/blob/Readme.md-Images/UserCreation.png?raw=true)
- User Creation Process
  - A user sends a post request to the server with an email and password; an email with a JWT token is sent to him, and he uses this token to verify his email.
    - APIs used:
      - POST: http://localhost:3000/users --> Body: {"email": "user@gmail.com", "password": "@Test1234"}
      - POST:  http://localhost:3000/auth/verify-email --> Body: {"jwtToken": "eyJhbGciOiJIUR5cCI6IkpXVCJ9.asfasfasfas.iqowrqorq"}
  - You can resend the verification email through this API.
    - API used:
      - POST: {{URL}}/auth/send-verification-email --> Body: {"email:"user@gmail.com"}
 - Role Authorization flow:
  - Each user can be assigned a role "user" or "admin", by default all users created are assigned to "user" role.
    - Users can only create URL checks & generate reports
  - Admins can only get users & delete users
    - APIs used:
      - GET: {{URL}}/users
      - GET: {{URL}}/users/:id
      - DELETE: {{URL}}/users/:id
  - Each user must login to use any URL checks CRUDs or Reports CRUDs
    - API used: {{URL}}/auth/login --> Body: {"email": "user@gmail.com", "password": "@Test1234"}
      - This API return jwtToken which must be set in `Authorization Bearer Token` protected APIs.
   
      
