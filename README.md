
# E-commerce API (Node.js)

This is a simple **RESTful API for an e-commerce platform** built with **Node.js** and **Express.js**. It provides endpoints to manage products, users, orders, and authentication.

## 🚀 Features
- User authentication (register / login)
- JWT token-based authentication
- CRUD operations for Products
- Order management
- Error handling middleware
- Environment-based configurations
- MongoDB integration with Mongoose

## 🛠 Tech Stack
- Node.js
- Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- bcryptjs (for password hashing)
- dotenv
- Nodemon (for development)

## 📂 Project Structure
\`\`\`
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── .env
├── server.js
\`\`\`

## ⚙️ Installation
\`\`\`bash
git clone https://github.com/abdul-rhman/ecommerce-api-nodejs.git
cd ecommerce-api-nodejs
npm install
\`\`\`

## 📌 Usage
1. Create a \`.env\` file based on \`.env.example\`
2. Run the project:
\`\`\`bash
npm run dev   # for development with nodemon
\`\`\`

## 🔒 API Authentication
- Use the \`/api/auth/register\` and \`/api/auth/login\` endpoints to create or login a user.
- Pass the received JWT token in the \`Authorization\` header as:
\`\`\`
Bearer <your_token>
\`\`\`

## 📮 Example Routes
| Method | Endpoint            | Description               |
|------- |---------------------|---------------------------|
| POST   | /api/auth/register  | Register a new user       |
| POST   | /api/auth/login     | Login user (get token)    |
| GET    | /api/products       | Get all products          |
| POST   | /api/products       | Add a new product         |
| PUT    | /api/products/:id   | Update a product          |
| DELETE | /api/products/:id   | Delete a product          |

## ✅ TODO / Improvements
- Add unit and integration tests
- Implement role-based access (Admin / User)
- Add product categories and search
- Dockerize the project

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
