
# Vehicle Rental System Server

Vehicle Rental System is a backend-only applicatioon that allows users to rent vehicles through secure API endpoints. It includes authentication, role-based features, booking management, rental status handling, and PostgreSQL database integration. The project is built using TypeScript and follows a clean service-based architecture.


## Live Link

http://vehicle-rental-system-server-one.vercel.app/


## 🚀 Features

### 🔐 Security & Authentication
* **JWT-Based Authentication:** Secure user sessions using JSON Web Tokens.
* **Role-Based Access Control (RBAC):** Dedicated permissions for **Admin** and **Customer** roles.
* **Secure Password Hashing:** Implementation of **bcrypt** for protecting user credentials.
* **Environment Safety:** Configuration management using **dotenv** to keep sensitive data secure.

### 🚗 Vehicle Management
* **Fleet Control:** Full CRUD functionality (Create, Read, Update, Delete) for vehicle listings.
* **Inventory Tracking:** Real-time management of available vehicles for rent.

### 📅 Booking & Rental Logic
* **Booking System:** Seamless process for users to book and rent vehicles.
* **Status Management:** Comprehensive tracking of booking states: `Active`, `Returned`, and `Cancelled`.
* **Automated Updates:** Booking statuses update automatically based on the rental end date.
* **Data Integrity:** Safety check to prevent user deletion if they have active bookings.

### 🛠️ Database & Infrastructure
* **PostgreSQL Integration:** Reliable relational database storage.
* **Scalable Architecture:** Optimized for handling complex relationships between users and assets.

---

## 🛠️ Technology Stack

### 🔹 Backend
* **Node.js**: Cross-platform JavaScript runtime environment.
* **Express.js (v5)**: Fast, unopinionated, minimalist web framework.
* **TypeScript**: Strongly typed programming language that builds on JavaScript.

### 🔹 Database
* **PostgreSQL**: Advanced open-source relational database.
* **pg (node-postgres)**: Non-blocking PostgreSQL client for Node.js.

### 🔹 Authentication & Security
* **JWT (jsonwebtoken)**: For secure transmission of information between parties as a JSON object.
* **bcryptjs**: Optimized password hashing library for secure data storage.

### 🔹 Dev Tools
* **tsx**: Type-safe execute (replacement for ts-node) for faster development.
* **dotenv**: Loads environment variables from a `.env` file.









# ⚙️ Installation & Setup
## Follow the below steps to run this project in your local machine:
### Run Locally

#### 1. Clone the project

```bash
    git clone https://github.com/arafat-yasin-2413/vehicle-rental-system-server.git
```

#### 2. Go to the project directory

```bash
  cd my-project
  cd vehicle-rental-system-server
```

#### 3. Install dependencies

```bash
  npm install
```

#### 4. Start the server

```bash
  npm run dev
```

#### 5. Setup Environment Variables

```bash
  PORT=5000
  DATABASE_URL=[your_postgresql_connection_string]
  JWT_SECRET=[your_jwt_secret]
```


#### 6. Database Setup
* PostgreSQL should be installed in your local machine.
* Create a PostgreSQL database in "neonDB"

#### 7. Build for Production
To build this project. Run :
```bash
npm run build
```
#### 8. API Testing
Tools: To Test the APIs you can use `Postman` app or `Thunder Client` extension in VS Code.

## Please Remember

* After Login You Will Get A JWT Token.
* This JWT Token Will Be Required To Access Private (Role-Based) Routes.
* Set The Token In The `Headers` Of Postman With A Key Named `Authorization`.
