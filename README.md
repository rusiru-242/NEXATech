# 🚀 NexaTech – AI-Powered Electronics E-Commerce Platform

NexaTech is a modern, full-stack electronics e-commerce platform designed to provide a smarter and more interactive online shopping experience. It combines a user-friendly shopping interface with an AI-powered technology assistant, secure authentication, online payments, and a comprehensive administration dashboard.

## ✨ Features

### 🛍️ Customer Features
- Browse and search electronic products.
- View detailed product information.
- Add products to cart and wishlist.
- Compare multiple products.
- Secure user registration and login.
- Manage user profiles and account details.
- View order history and order details.
- Secure online payments using Stripe.

### 🤖 AI-Powered Assistant
- AI-powered technology assistant.
- Intelligent product recommendations.
- Product search through natural language.
- Hardware and technology-related question answering.
- Product comparisons and purchasing guidance.
- AI responses powered by Google Gemini.
- Persistent AI chat history.

### 🛠️ Admin Dashboard
- Manage products and product categories.
- Manage customer orders.
- Manage registered users.
- Manage customer reviews.
- View sales and analytics.
- Monitor e-commerce activities.

## 🧰 Technologies Used

### Frontend
- React.js
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication

### AI Service
- Python
- FastAPI
- Google Gemini API

### Payment Integration
- Stripe

### Development Tools
- Visual Studio Code
- Git & GitHub
- Postman

## 🏗️ System Architecture

NexaTech uses a distributed full-stack architecture with separate frontend, backend, and AI service layers.

1. **Frontend:** React communicates with the backend through REST APIs and connects to the AI service for intelligent assistance.
2. **Backend:** Express.js handles authentication, product management, orders, and business logic.
3. **Database:** MongoDB Atlas stores users, products, orders, and chat history.
4. **AI Service:** FastAPI communicates with Google Gemini and retrieves relevant product information through the backend API.
5. **Payment:** Stripe handles online payment processing.

## 📁 Project Structure

```text
NexaTech/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── assets/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
├── ai-service/
│   ├── app/
│   ├── requirements.txt
│   └── main.py
│
└── README.md
```

*Note: Update the structure above if your actual project folders or filenames differ.*

## ⚙️ Installation and Setup

### Prerequisites
- Node.js
- Python
- MongoDB Atlas account
- Google Gemini API key
- Stripe account

### 1. Clone the Repository

```bash
git clone https://github.com/rusiru-242/NEXATech.git
cd NEXATech
```

### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

### 3. Setup Backend

Open another terminal:

```bash
cd backend
npm install
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

### 4. Setup AI Service

Open another terminal:

```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

AI service runs at:

```text
http://localhost:8001
```

### 5. Environment Variables

Create the required `.env` files and configure the following variables according to the actual application configuration.

**Backend `.env`**

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

**AI Service `.env`**

```env
GEMINI_API_KEY=your_gemini_api_key
```

**Frontend `.env`**

```env
VITE_API_URL=http://localhost:5000
VITE_AI_API_URL=http://localhost:8001
```

Never commit real API keys, passwords, or secret environment variables to GitHub.

## 🔐 Security
- JWT-based authentication.
- Protected routes and role-based access.
- Secure password handling.
- Environment-based secret management.
- Stripe payment integration.

## 🚀 Future Improvements
- Advanced AI-based personalized recommendations.
- Real-time order tracking.
- Enhanced product filtering.
- Improved analytics and reporting.
- Additional payment methods.
- Mobile application integration.

## 👨‍💻 Developer

**Rusiru Karunarathna**

GitHub: [@rusiru-242](https://github.com/rusiru-242)

Project Repository: [NexaTech](https://github.com/rusiru-242/NEXATech)

---

⭐ If you find this project interesting, consider giving it a star!
