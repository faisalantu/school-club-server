# School Project Server side Doc

**Navigation** <br>

- [School Project Server side Doc](#school-project-server-side-doc)
- [Api Routes](#api-routes)
    - [**api/auth**](#apiauth)
    - [**api/users**](#apiusers)
    - [**api/events**](#apievents)
- [Npm Packages](#npm-packages)
- [Middleware](#middleware)
  - [auth.js middleware](#authjs-middleware)

# Api Routes

### **api/auth**

This route for **sing in** and checking auth status
GET Request returns user data can use to check what kind of user login for access permission like admin or superuser
POST Request for **Sign In** and it returns jwt tokens after user signin

### **api/users**

This api route for **sing up** users and update user i formation can perform GET, POST, PUT, DELETE

### **api/events**

This api route for **CRUD** ( Create, Read, Update, Delete ) Events.
Functionalities should be GET, POST, PUT, DELETE

# Npm Packages

```json
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "config": "^3.3.6",
    "cors": "^2.8.5",
    "express": "^4.17.1",
    "express-validator": "^6.10.0",
    "jsonwebtoken": "^8.5.1",
    "mongoose": "^5.12.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.4"
  }
```

# Middleware
## auth.js middleware
auth.js middleware for auth verification every request it checks auth and limit users to vist or get api requests
to use this middleware have to import first and then pass as middleware

```js
const auth = require("../middleware/auth");
router.get("/", auth, async (req, res) => {
    ...code
  }
);
```
