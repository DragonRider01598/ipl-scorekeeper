# IPL Scorekeeper

**IPL Scorekeeper** is a dynamic web application initially designed to track and manage IPL matches. Over time, it has evolved to support various types of matches, allowing users to host and participate in games of their choice. Built with the MERN stack and styled using Tailwind CSS, this platform offers a seamless and engaging user experience.

## Features

- **User Authentication**: Secure login and registration system.
- **Password Recovery**: Integrated "Forgot Password" workflow for user convenience.
- **Match Management**: Manually add and manage matches and their results.
- **Flexible Hosting**: Host any kind of match, not limited to IPL.
- **Responsive Design**: Tailwind CSS ensures a mobile-friendly interface.
- **Email Notifications**: Send emails using the Resend API.

## Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Email Service**: Resend API

## Getting Started

### Prerequisites

- Node.js installed on your machine.
- MongoDB instance (local or cloud-based).
- Resend API key for email functionalities.

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/DragonRider01598/ipl-scorekeeper.git
   cd ipl-scorekeeper
   ```

2. **Set up environment variables**:

   Create a `.env` file in both the `frontend` and `backend` directories with the following variables:

   ```env
   JWT_SECRET=your_jwt_secret
   RESEND_API_KEY=your_resend_api_key
   FRONTEND_URL=http://localhost:3000
   MONGO_URI=your_mongodb_connection_string
   ```

3. **Install dependencies**:

   - For the frontend:

     ```bash
     cd frontend
     npm install
     npm run build
     ```

   - For the backend:

     ```bash
     cd ../backend
     npm install
     npm start
     ```

4. **Access the application**:

   Open your browser and navigate to `http://localhost:3000`.

## Contributing

We welcome contributions! To contribute:

1. **Fork the repository**.
2. **Create a new branch**:

   ```bash
   git checkout -b feature/YourFeatureName
   ```

3. **Make your changes and commit them**:

   ```bash
   git commit -m "Add your message here"
   ```

4. **Push to your forked repository**:

   ```bash
   git push origin feature/YourFeatureName
   ```

5. **Open a Pull Request**: Navigate to the original repository and open a pull request from your forked repository.
