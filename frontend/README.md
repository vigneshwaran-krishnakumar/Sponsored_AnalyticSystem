# Sponsored Analytic System

A comprehensive web application for managing influencer marketing campaigns and sponsorship analytics. This project demonstrates full-stack development with React, Node.js, Express, and MongoDB.

## 🎯 Learning Objectives

This application covers all major operations in a modern web application:

- **Frontend Development**: React with TypeScript, routing, state management, UI components
- **Backend Development**: RESTful APIs, database operations, authentication
- **Data Visualization**: Charts and analytics dashboards
- **CRUD Operations**: Create, Read, Update, Delete functionality
- **User Interface**: Modern UI with shadcn/ui and Tailwind CSS
- **Database Management**: MongoDB with Mongoose ODM

## 🚀 Features

### Dashboard
- **KPI Cards**: Total revenue, active campaigns, average ROI, engagement rate
- **Revenue Charts**: Monthly revenue vs targets with line charts
- **Traffic Sources**: Pie chart showing platform distribution
- **Influencer Performance**: Bar charts comparing revenue and engagement

### Campaign Management
- **View Campaigns**: List all campaigns with status, budget, spent, revenue
- **Create Campaigns**: Add new sponsorship campaigns
- **Campaign Details**: Detailed view of individual campaigns
- **Status Management**: Active, paused, completed campaign states

### Influencer Management
- **Influencer Directory**: Browse influencers by platform
- **Performance Metrics**: Followers, engagement rates, campaign history
- **Revenue Tracking**: Individual influencer earnings

### Analytics & Reporting
- **ROI Calculation**: Return on investment metrics
- **Performance Reports**: Campaign effectiveness analysis
- **Traffic Analytics**: Platform-wise traffic distribution

### User Management
- **Authentication**: Login and registration system
- **User Roles**: Admin and user access levels
- **Settings**: User preferences and configuration

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router** for navigation
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Recharts** for data visualization
- **React Query** for data fetching
- **Context API** for state management

### Backend
- **Node.js** with Express.js
- **MySQL** with mysql2 driver
- **JWT Authentication** with jsonwebtoken
- **Password Hashing** with bcrypt
- **RESTful APIs**
- **CORS** for cross-origin requests
- **Environment Variables** for configuration

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- **MySQL Server** (v8.0 or higher)
- Git

## 🗄️ Database Setup

### MySQL Installation

1. **Install MySQL Server**:
   - Download from [MySQL Official Website](https://dev.mysql.com/downloads/mysql/)
   - Or use package managers:
     - Windows: `choco install mysql`
     - macOS: `brew install mysql`
     - Ubuntu: `sudo apt install mysql-server`

2. **Start MySQL Service**:
   ```bash
   # Windows
   net start mysql

   # macOS/Linux
   sudo systemctl start mysql
   ```

3. **Create Database and Tables**:
   ```bash
   mysql -u root -p < backend/database_setup.sql
   ```

   Or manually:
   ```sql
   CREATE DATABASE sponsored_analytics;
   USE sponsored_analytics;
   -- Run the table creation statements from database_setup.sql
   ```

### Environment Configuration

Update `backend/.env` with your MySQL credentials and JWT secret:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=sponsored_analytics
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
```

## 🔧 Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=sponsored_analytics
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
```

4. Start the backend server:
```bash
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## � Authentication System

The application includes a complete user authentication system with MySQL database integration.

### Features
- **User Registration**: Create accounts with secure password hashing
- **User Login**: JWT-based authentication
- **Protected Routes**: Dashboard and API routes require authentication
- **Token Storage**: JWT tokens stored in localStorage
- **Auto-redirect**: Unauthenticated users redirected to login

### API Endpoints

#### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

#### Protected APIs
- `GET /api/campaigns` - Requires Bearer token
- `POST /api/campaigns` - Requires Bearer token
- `PUT /api/campaigns/:id` - Requires Bearer token
- `DELETE /api/campaigns/:id` - Requires Bearer token
- `GET /api/influencers` - Requires Bearer token
- `POST /api/influencers` - Requires Bearer token
- `PUT /api/influencers/:id` - Requires Bearer token
- `DELETE /api/influencers/:id` - Requires Bearer token
- `GET /api/roi` - Requires Bearer token

### Database Schema

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Security Features
- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: 24-hour expiration
- **Input Validation**: Email format and required fields
- **SQL Injection Protection**: Parameterized queries
- **CORS Protection**: Configured for frontend origin

### Campaign Schema
```sql
CREATE TABLE campaigns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(255) NOT NULL,
  status ENUM('active','paused') DEFAULT 'active',
  budget DECIMAL(10,2) NOT NULL,
  spent DECIMAL(10,2) NOT NULL,
  revenue DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎮 Application Operations

### 1. User Authentication
- **Register**: Create new user account
- **Login**: Authenticate existing users
- **Session Management**: Maintain user sessions

### 2. Dashboard Operations
- **View KPIs**: Monitor key performance indicators
- **Analyze Charts**: Study revenue trends and traffic sources
- **Track Performance**: Review influencer and campaign metrics

### 3. Campaign Operations
- **List Campaigns**: View all sponsorship campaigns from MySQL database
- **Create Campaign**: Add new marketing campaigns via modal form
- **View Details**: Examine individual campaign performance
- **Update Status**: Change campaign states (active/paused)
- **Delete Campaign**: Remove campaigns from database

### Campaign Creation Flow
1. Click **"+ New Campaign"** button
2. Modal opens with form fields:
   - Campaign Name (required)
   - Brand (required)
   - Status (active/paused)
   - Budget (decimal)
   - Spent (decimal)
   - Revenue (decimal)
3. Submit form → POST to `/api/campaigns`
4. Backend validates and stores in MySQL
5. Frontend refreshes campaign list automatically

### 4. Influencer Operations
- **List Influencers**: View all influencers from MySQL database
- **Create Influencer**: Add new influencers via modal form
- **View Performance**: Monitor engagement rates and revenue
- **Platform Filtering**: Filter influencers by social media platform
- **Update Influencer**: Edit influencer information
- **Delete Influencer**: Remove influencers from database

### Influencer Creation Flow
1. Click **"+ Add Influencer"** button
2. Modal opens with form fields:
   - Influencer Name (required)
   - Platform (Instagram/YouTube/TikTok/Twitter)
   - Followers (number, required)
   - Engagement Rate (decimal, required)
   - Revenue (decimal, optional)
3. Submit form → POST to `/api/influencers`
4. Backend validates and stores in MySQL
5. Frontend refreshes influencer list automatically

### 5. Reporting Operations
- **Generate Reports**: Create campaign performance reports
- **Export Data**: Download analytics in various formats
- **ROI Analysis**: Calculate return on investment

### 6. Settings Operations
- **User Preferences**: Customize application settings
- **Profile Management**: Update user information
- **System Configuration**: Admin-level system settings

## 🔄 Data Flow

1. **Frontend** makes API calls to backend
2. **Backend** processes requests and interacts with MySQL database
3. **Database** stores campaign, analytics, and user data
4. **Frontend** receives data and updates UI components
5. **Charts and visualizations** render real-time data

## 📊 Database Models

### Users Table
- **id**: INT AUTO_INCREMENT PRIMARY KEY
- **name**: VARCHAR(100) - User's full name
- **email**: VARCHAR(150) UNIQUE - User's email address
- **password**: VARCHAR(255) - Hashed password (bcrypt)
- **created_at**: TIMESTAMP - Account creation timestamp

### Influencers Table
- **id**: INT AUTO_INCREMENT PRIMARY KEY
- **name**: VARCHAR(150) - Influencer's full name
- **platform**: VARCHAR(100) - Social media platform
- **followers**: INT - Number of followers
- **engagement_rate**: DECIMAL(5,2) - Engagement percentage
- **revenue**: DECIMAL(10,2) - Total revenue generated
- **created_at**: TIMESTAMP - Record creation timestamp

## 🎨 UI Components

### Core Components
- **KPICard**: Displays key metrics with trend indicators
- **ChartCard**: Container for data visualizations
- **StatusBadge**: Shows campaign/influencer status
- **DashboardLayout**: Main application layout with navigation

### UI Library
- Built with shadcn/ui components
- Responsive design with Tailwind CSS
- Accessible and modern interface
- Consistent design system

## 🚀 Deployment

### Backend Deployment
```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Serve static files
npm run preview
```

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For questions or issues, please open an issue in the repository.

---

**Happy Learning!** 🎉

This application demonstrates real-world full-stack development practices and can serve as a foundation for building more complex analytics and management systems.
