<div align="center">
  <img src="./frontend/public/images/agrinova_logo.png" alt="AgriNova Logo" width="250" />

  <h1>🌾 AgriNova</h1>
  <p><strong>A Modern Full-Stack Farm-to-Table Marketplace</strong></p>

  <p>
    <a href="http://16.171.255.47" target="_blank">View Live Demo</a> · 
    <a href="#features">Explore Features</a> · 
    <a href="#tech-stack">View Tech Stack</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
    <img src="https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="AWS" />
  </p>
</div>

---

## 📖 About The Project

AgriNova is a comprehensive e-commerce platform designed to bridge the gap between local farmers and consumers. It provides a seamless marketplace where farmers can list their fresh produce directly, and customers can browse, add to cart, and securely purchase high-quality agricultural products.

Built with performance and scalability in mind, AgriNova features a fully automated CI/CD pipeline deploying Docker containers to AWS.

### ✨ Key Features

- 👨‍🌾 **Multi-Role Dashboards**: Dedicated interfaces for Customers and Farmers.
- 🛒 **Shopping Experience**: Real-time cart management and order tracking.
- 🔐 **Secure Authentication**: JWT-based secure login and session management.
- ☁️ **Cloud Database**: Persistent data storage using MongoDB Atlas.
- 🚀 **Automated Deployments**: GitHub Actions CI/CD pipeline to AWS EC2 via ECR.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** (Vite)
- **Tailwind CSS** for responsive styling
- **React Router** for navigation
- **Context API** for global state management (Auth, Cart)

### Backend
- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose** (Atlas Cloud Database)
- **JSON Web Tokens (JWT)** for Authentication

### DevOps & Hosting
- **Docker** & **Docker Compose**
- **Amazon Web Services (AWS)**: EC2, ECR
- **GitHub Actions** for CI/CD

---

## 🚀 Live Demo

The application is currently deployed and live on AWS EC2.
👉 **[Click here to visit AgriNova](http://16.171.255.47)**

---

## 💻 Local Development Setup

If you want to run this project locally on your machine:

### Prerequisites
- Node.js (v20 or higher)
- MongoDB (Local or Atlas URI)
- Git

### Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/DILJEETSINGH07/AgriNova.git
   cd AgriNova
   ```

2. **Setup Backend**
   ```sh
   cd backend
   npm install
   # Create a .env file based on .env.example
   npm run dev
   ```

3. **Setup Frontend**
   ```sh
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

---

## 📸 Screenshots

*(You can replace these placeholder images with actual screenshots of your application)*

| Customer Dashboard | Farmer Dashboard |
| :---: | :---: |
| <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&h=300&fit=crop" alt="Customer Dashboard" /> | <img src="https://images.unsplash.com/photo-1592982537447-6f23f37b9278?w=500&h=300&fit=crop" alt="Farmer Dashboard" /> |

---

<div align="center">
  <i>Built with ❤️ by Diljeet Singh</i>
</div>
