# 🔐 MERN Authentication System with SHA-256 Hashing

## 📌 Overview
This project is a **secure authentication system** built using the **MERN stack** (MongoDB, Express.js, React.js, and Node.js). It implements **SHA-256 hashing** to store passwords securely, ensuring better protection of user credentials.

Users can **sign up, log in, and log out**, with access control enforced on protected routes. The authentication status is managed using `localStorage`, preventing unauthorized users from accessing restricted pages.

---

## ⚙️ Features  
✅ **User Authentication** (Signup & Login)  
✅ **SHA-256 Password Hashing** for security  
✅ **Protected Routes** (Home page accessible only after login)  
✅ **Logout Functionality** (Clears authentication session)  
✅ **User Feedback** (Displays success/error messages on UI)  
✅ **JWT Authentication**: After successful login, users receive a JWT token, which is required to access protected routes.


## 🔑 **How SHA-256 Hashing Works in This Project**
SHA-256 (Secure Hash Algorithm 256-bit) is a **one-way cryptographic hashing function** that converts a password into a unique **64-character hexadecimal hash**. Instead of storing plaintext passwords, we store these irreversible hashes in the database.  
![Screenshot 2025-04-04 005355](https://github.com/user-attachments/assets/20ce7eff-2c42-4ff9-92f5-2f4c83c90775)

### **Hashing Process in Our Project**
1. The user enters a password during **signup**.
2. The backend hashes the password using **Node.js `crypto` module** before saving it to the database.
3. During **login**, the entered password is hashed again and compared with the stored hash.
4. If they match, access is granted; otherwise, an error message is shown.

```javascript
const crypto = require('crypto');

const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};
```

---

## 🏗️ **Tech Stack Used**
### **Frontend** (React.js)
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling

### **Backend** (Node.js + Express)
- Express.js for handling API requests
- `crypto` module for SHA-256 hashing
- MongoDB for user data storage

### **Database** (MongoDB + Mongoose)
- Stores **username and hashed passwords**
- Uses Mongoose for schema management

---

## 🚀 **Installation & Setup**
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/your-repo-name.git
cd your-repo-name
```

### **2️⃣ Install Dependencies**
#### **Backend Setup**
```sh
cd backend
npm install
```
- Create a `.env` file in `backend/` and add:
```env
MONGO_URI=mongodb://localhost:27017/auth_demo
PORT=5000
```
- Start the backend server:
```sh
npm start
```

#### **Frontend Setup**
```sh
cd frontend
npm install
```
- Start the React app:
```sh
npm start
```

---

## 📌 **Usage**
1. **Signup** with a username and password.
2. **Login** using the registered credentials.
3. If successful, you will be redirected to the **Home page**.
4. Click **Logout** to end the session.
5. Trying to access the Home page after logout will redirect to **Login**.
## **JWT Usage**
- Upon successful login, the server generates a JWT token, which is stored in the frontend (e.g., in localStorage or cookies). This token is required for accessing protected routes, ensuring secure user sessions.
---

## 🎯 **Future Improvements**
- Implement **JWT authentication** for better security.
- Add **password reset functionality**.
- Store user session securely using **httpOnly cookies** instead of localStorage.

---

## 📜 **License**
This project is licensed under the MIT License.  

---

## 💡 **Contributors**
👨‍💻 **Team Members:**  
- **Shiva**  
- **Vidushi Singh**  
- **Jayesh Kaushik**  
- **Risha Sri**
- **Gaurav Mamgain**  

---

## 🌟 **Show Your Support**
If you found this project helpful, ⭐ **star** this repository on GitHub! 🚀  
