# Installation Guide
## Appliance Management System

This guide provides detailed instructions for installing and running the Appliance Management System on your local machine.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Installation](#backend-installation)
3. [Frontend Installation](#frontend-installation)
4. [Configuration](#configuration)
5. [Running the Application](#running-the-application)
6. [Verification](#verification)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before installing the application, ensure you have the following software installed:

### Required Software

#### Java Development Kit (JDK)
- **Version**: Java 17 or higher
- **Download**: [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) or [OpenJDK](https://openjdk.org/)
- **Verify installation**:
  ```bash
  java -version
  ```
  Expected output should show version 17 or higher.

#### Apache Maven
- **Version**: 3.6.x or higher
- **Download**: [Maven Downloads](https://maven.apache.org/download.cgi)
- **Verify installation**:
  ```bash
  mvn -version
  ```

#### Node.js and npm
- **Version**: Node.js 18.x or higher, npm 9.x or higher
- **Download**: [Node.js Downloads](https://nodejs.org/)
- **Verify installation**:
  ```bash
  node -v
  npm -v
  ```

#### Git (for cloning repository)
- **Download**: [Git Downloads](https://git-scm.com/downloads)
- **Verify installation**:
  ```bash
  git --version
  ```

---

## Backend Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/UNO-CSCI4830/project4-logbook.git
cd project4-logbook
```

### Step 2: Navigate to Backend Directory

```bash
cd backend
```

### Step 3: Install Dependencies

Maven will automatically download all required dependencies:

```bash
mvn clean install
```

This process may take a few minutes on first run.

### Step 4: Verify Backend Build

If the build is successful, you should see:
```
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```

---

## Frontend Installation

### Step 1: Navigate to Frontend Directory

From the project root:

```bash
cd frontend/user-app
```

### Step 2: Install Node Modules

```bash
npm install
```

This will install all dependencies listed in `package.json`.

### Step 3: Verify Frontend Installation

Check that `node_modules` directory was created and no errors were reported.

---

## Configuration

### Backend Configuration

#### Database Configuration
The application uses SQLite and requires minimal configuration. The database file (`demo.db`) will be created automatically in the `backend` directory on first run.

#### Email Configuration (Optional)

To enable email notifications, configure SMTP settings in `backend/src/main/resources/application.properties`:

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

**Note**: For Gmail, you'll need to use an [App Password](https://support.google.com/accounts/answer/185833).

#### JWT Secret Configuration

The JWT secret is configured in `application.properties`. For production, change the default secret:

```properties
jwt.secret=your-secure-secret-key-here
jwt.expiration=86400000
```

### Frontend Configuration

#### API Endpoint Configuration

The frontend is configured to connect to `http://localhost:8080` by default. If your backend runs on a different port, update the API base URL in your frontend code.

---

## Running the Application

### Start the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

3. Wait for the application to start. You should see:
   ```
   Started DemoApplication in X.XXX seconds
   ```

4. The backend will be available at: **http://localhost:8080**

### Start the Frontend

1. Open a **new terminal window/tab**

2. Navigate to the frontend directory:
   ```bash
   cd frontend/user-app
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. The frontend will be available at: **http://localhost:3000**

---

## Verification

### Verify Backend is Running

1. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

2. You can also test API endpoints using curl:
   ```bash
   curl http://localhost:8080/api/appliances
   ```

### Verify Frontend is Running

1. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

2. You should see the application login page.

### Verify Database

After the backend runs for the first time, check that `demo.db` exists in the `backend` directory:

```bash
ls backend/demo.db
```

---

## Troubleshooting

### Common Issues

#### Port Already in Use

**Backend (Port 8080)**
```
Error: Port 8080 is already in use
```

**Solution**: Stop the process using port 8080 or change the port in `application.properties`:
```properties
server.port=8081
```

**Frontend (Port 3000)**
```
Error: Port 3000 is already in use
```

**Solution**: Stop the process using port 3000 or specify a different port:
```bash
PORT=3001 npm run dev
```

#### Java Version Mismatch

```
Error: Unsupported class file major version
```

**Solution**: Ensure you're using Java 17 or higher:
```bash
java -version
```

Update `JAVA_HOME` environment variable if necessary.

#### Maven Build Failures

```
Error: Failed to execute goal
```

**Solutions**:
1. Clear Maven cache and rebuild:
   ```bash
   mvn clean install -U
   ```

2. Delete `.m2/repository` folder and rebuild

#### Node Module Installation Issues

```
Error: EACCES permission denied
```

**Solution**: Fix npm permissions or use nvm (Node Version Manager)

#### Database Lock Issues

```
Error: database is locked
```

**Solution**:
1. Stop all running instances of the backend
2. Delete `demo.db` and restart (Note: This will erase all data)

#### CORS Errors

```
Error: CORS policy blocked
```

**Solution**: Ensure the backend SecurityConfig allows the frontend origin (http://localhost:3000)

---

## Running Tests

### Backend Tests

```bash
cd backend
mvn test
```

### Frontend Tests

```bash
cd frontend/user-app
npm test
```

---

## Production Build

### Backend Production JAR

```bash
cd backend
mvn clean package
java -jar target/demo-0.0.1-SNAPSHOT.jar
```

### Frontend Production Build

```bash
cd frontend/user-app
npm run build
npm start
```

---

## Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)